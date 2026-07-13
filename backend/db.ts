import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PantryItem, UserStats } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');

// Make sure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

/**
 * Reads a JSON database file, returning a default value if the file does not exist.
 */
export async function readData<T>(filename: string, defaultValue: T): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading database file ${filename}:`, err);
    return defaultValue;
  }
}

/**
 * Writes data to a JSON database file atomically.
 * It writes to a temporary file first, then renames it to prevent file corruption.
 */
export async function writeData<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  const tempPath = `${filePath}.tmp`;
  try {
    await fs.promises.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.promises.rename(tempPath, filePath);
  } catch (err) {
    console.error(`Error writing database file ${filename}:`, err);
    try {
      if (fs.existsSync(tempPath)) {
        await fs.promises.unlink(tempPath);
      }
    } catch (_) {}
    throw err;
  }
}

const writeQueues = new Map<string, Promise<void>>();

/** Serialize a collection's read-modify-write cycle to prevent lost updates. */
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
