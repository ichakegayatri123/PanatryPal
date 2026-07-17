import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient, Db } from 'mongodb';
import { PantryItem, UserStats } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  dietaryPreferences: string[];
  bio: string;
  createdAt: string;
}

export interface PantryRecord {
  [userId: string]: PantryItem[];
}

export interface FavoritesRecord {
  [userId: string]: string[];
}

export interface StatsRecord {
  [userId: string]: UserStats;
}

function getMongoUri(): string {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }
  
  // Try reading from backend/.env.txt
  try {
    const envPath = path.join(__dirname, '.env.txt');
    if (fs.existsSync(envPath)) {
      let rawUri = fs.readFileSync(envPath, 'utf-8').trim();
      // Remove any enclosing angle brackets if present: e.g. <Gayatri@2006> -> Gayatri%402006
      rawUri = rawUri.replace(/<([^>]+)>/g, (_, p1) => {
        return encodeURIComponent(p1);
      });
      // Encode password if password contains '@' and has not been encoded yet
      const match = rawUri.match(/^(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.+)$/);
      if (match) {
        const prefix = match[1];
        const pwd = match[2];
        const suffix = match[3];
        if (pwd.includes('@') && !pwd.includes('%')) {
          rawUri = `${prefix}${encodeURIComponent(pwd)}${suffix}`;
        }
      }
      return rawUri;
    }
  } catch (err) {
    console.error('Error reading backend/.env.txt for MongoDB URI:', err);
  }
  
  return 'mongodb://localhost:27017/pantrypal';
}

let client: MongoClient | null = null;
let dbInstance: Db | null = null;

async function getDb(): Promise<Db> {
  if (dbInstance) return dbInstance;
  
  const uri = getMongoUri();
  const maskedUri = uri.replace(/(:\/\/[^:]+:)([^@]+)(@)/, '$1****$3');
  console.log(`Connecting to MongoDB using URI: ${maskedUri}`);
  
  client = new MongoClient(uri);
  await client.connect();
  dbInstance = client.db(); // Uses the default database in connection string, or falls back
  console.log('Connected to MongoDB successfully!');
  return dbInstance;
}

/**
 * Reads data from MongoDB collections.
 */
export async function readData<T>(filename: string, defaultValue: T): Promise<T> {
  try {
    const db = await getDb();
    if (filename === 'users.json') {
      const docs = await db.collection('users').find({}).toArray();
      const users = docs.map(({ _id, ...rest }) => rest);
      return users as any;
    }
    
    if (filename === 'pantry.json') {
      const docs = await db.collection('pantry').find({}).toArray();
      const result: PantryRecord = {};
      for (const doc of docs) {
        result[doc.userId] = doc.items;
      }
      return result as any;
    }
    
    if (filename === 'favorites.json') {
      const docs = await db.collection('favorites').find({}).toArray();
      const result: FavoritesRecord = {};
      for (const doc of docs) {
        result[doc.userId] = doc.recipes;
      }
      return result as any;
    }
    
    if (filename === 'stats.json') {
      const docs = await db.collection('stats').find({}).toArray();
      const result: StatsRecord = {};
      for (const doc of docs) {
        result[doc.userId] = doc.stats;
      }
      return result as any;
    }
    
    return defaultValue;
  } catch (err) {
    console.error(`Error reading from MongoDB for ${filename}:`, err);
    return defaultValue;
  }
}

/**
 * Writes data to MongoDB collections.
 */
export async function writeData<T>(filename: string, data: T): Promise<void> {
  try {
    const db = await getDb();
    if (filename === 'users.json') {
      const users = data as UserRecord[];
      for (const user of users) {
        await db.collection('users').replaceOne({ id: user.id }, user, { upsert: true });
      }
    } else if (filename === 'pantry.json') {
      const record = data as PantryRecord;
      for (const [userId, items] of Object.entries(record)) {
        await db.collection('pantry').replaceOne({ userId }, { userId, items }, { upsert: true });
      }
    } else if (filename === 'favorites.json') {
      const record = data as FavoritesRecord;
      for (const [userId, recipes] of Object.entries(record)) {
        await db.collection('favorites').replaceOne({ userId }, { userId, recipes }, { upsert: true });
      }
    } else if (filename === 'stats.json') {
      const record = data as StatsRecord;
      for (const [userId, stats] of Object.entries(record)) {
        await db.collection('stats').replaceOne({ userId }, { userId, stats }, { upsert: true });
      }
    }
  } catch (err) {
    console.error(`Error writing to MongoDB for ${filename}:`, err);
    throw err;
  }
}

const writeQueues = new Map<string, Promise<void>>();

/** Serialize read-modify-write cycles to prevent concurrent clobbering. */
export async function updateData<T, R>(filename: string, defaultValue: T, updater: (data: T) => Promise<R> | R): Promise<R> {
  let result!: R;
  const previous = writeQueues.get(filename) ?? Promise.resolve();
  const task = previous.catch(() => undefined).then(async () => {
    const data = await readData<T>(filename, defaultValue);
    result = await updater(data);
    await writeData(filename, data);
  });
  writeQueues.set(filename, task);
  try { await task; return result; }
  finally { if (writeQueues.get(filename) === task) writeQueues.delete(filename); }
}
