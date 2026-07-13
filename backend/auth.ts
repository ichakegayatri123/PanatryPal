import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { readData, writeData, UserRecord, PantryRecord, StatsRecord, FavoritesRecord } from './db';
import { ApiError, requiredString } from './http';

const router = express.Router();

// Extends Express Request to include userId
export interface AuthRequest extends Request {
  userId?: string;
}

const DEFAULT_PASSWORD_SALT = 'pantrypal_password_salt_59281';
const DEFAULT_JWT_SECRET = 'pantrypal_jwt_secret_038291';

const PASSWORD_SALT = process.env.PASSWORD_SALT || DEFAULT_PASSWORD_SALT;
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

// Warn loudly in production if secrets are still defaults
if (PASSWORD_SALT === DEFAULT_PASSWORD_SALT || JWT_SECRET === DEFAULT_JWT_SECRET) {
  console.warn(
    '⚠️  WARNING: Using default PASSWORD_SALT or JWT_SECRET.\n' +
    '   Set PASSWORD_SALT and JWT_SECRET in your .env file before deploying to production!'
  );
}

/**
 * Hashes password using SHA-512 with a salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('base64url');
  const derived = crypto.scryptSync(password, `${PASSWORD_SALT}:${salt}`, 64).toString('base64url');
  return `scrypt$${salt}$${derived}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  if (storedHash.startsWith('scrypt$')) {
    const [, salt, derived] = storedHash.split('$');
    if (!salt || !derived) return false;
    const expected = crypto.scryptSync(password, `${PASSWORD_SALT}:${salt}`, 64).toString('base64url');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(derived));
  }
  // Compatibility for development accounts created by the original backend.
  const legacy = crypto.createHmac('sha512', PASSWORD_SALT).update(password).digest('hex');
  return legacy.length === storedHash.length && crypto.timingSafeEqual(Buffer.from(legacy), Buffer.from(storedHash));
}

/**
 * Generates a lightweight, secure token
 */
export function generateToken(userId: string): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

/**
 * Verifies a token and returns the userId, or null if invalid/expired
 */
export function verifyToken(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
  if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (decoded.exp < Date.now()) return null;
    return decoded.userId;
  } catch (_) {
    return null;
  }
}

/**
 * Middleware to authenticate requests using JWT
 */
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token is required' });
    return;
  }

  const userId = verifyToken(token);
  if (!userId) {
    res.status(403).json({ error: 'Invalid or expired access token' });
    return;
  }

  req.userId = userId;
  next();
}

/**
 * Pre-seeds the default user if the users database is empty
 */
export async function seedDefaultUser() {
  const users = await readData<UserRecord[]>('users.json', []);
  const email = 'ichakegayatri@gmail.com';
  
  const alreadyExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (!alreadyExists) {
    const defaultUserId = 'default-user-maria';
    const newUser: UserRecord = {
      id: defaultUserId,
      email: email.toLowerCase(),
      name: "Maria's Kitchen",
      passwordHash: hashPassword('password123'),
      dietaryPreferences: ['Vegetarian'],
      bio: 'Gourmet chef creating beautiful meals while reducing green kitchen waste.',
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await writeData<UserRecord[]>('users.json', users);

    // Seed default pantry
    const pantryRecord = await readData<PantryRecord>('pantry.json', {});
    pantryRecord[defaultUserId] = [
      { id: '1', name: 'Spinach', category: 'Vegetables', quantity: '2 cups', expiryDate: '2 days', isInFridge: true },
      { id: '2', name: 'Tomato', category: 'Vegetables', quantity: '1 cup', expiryDate: '4 days', isInFridge: true },
      { id: '3', name: 'Chicken', category: 'Proteins', quantity: '300g', expiryDate: 'Use today', isInFridge: true },
      { id: '4', name: 'Spaghetti', category: 'Grains', quantity: '400g', expiryDate: '90 days', isInFridge: true },
      { id: '5', name: 'Basil', category: 'Vegetables', quantity: '1 cup', expiryDate: '3 days', isInFridge: true },
      { id: '6', name: 'Parmesan Cheese', category: 'Dairy', quantity: '100g', expiryDate: '25 days', isInFridge: true }
    ];
    await writeData<PantryRecord>('pantry.json', pantryRecord);

    // Seed default stats
    const statsRecord = await readData<StatsRecord>('stats.json', {});
    statsRecord[defaultUserId] = {
      recipesCooked: 14,
      foodSavedLbs: 16.8,
      co2SavedLbs: 21.5,
      activeStreak: 4
    };
    await writeData<StatsRecord>('stats.json', statsRecord);

    // Seed default favorites
    const favoritesRecord = await readData<FavoritesRecord>('favorites.json', {});
    favoritesRecord[defaultUserId] = ['creamy-basil-pesto-pasta', 'roasted-tomato-pasta'];
    await writeData<FavoritesRecord>('favorites.json', favoritesRecord);

    console.log('Seeded default user and collections successfully.');
  }
}

// REGISTER API
router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password, dietaryPreferences } = req.body ?? {};

  try {
    const safeName = requiredString(name, 'Name', 100);
    const safeEmail = requiredString(email, 'Email', 254).toLowerCase();
    const safePassword = requiredString(password, 'Password', 1024);
    if (!/^\S+@\S+\.\S+$/.test(safeEmail)) throw new ApiError(400, 'Email must be valid');
    if (safePassword.length < 8) throw new ApiError(400, 'Password must be at least 8 characters');
    if (dietaryPreferences !== undefined && (!Array.isArray(dietaryPreferences) || dietaryPreferences.some(item => typeof item !== 'string'))) throw new ApiError(400, 'Dietary preferences must be a list of strings');
    const users = await readData<UserRecord[]>('users.json', []);
    const alreadyExists = users.some(u => u.email.toLowerCase() === safeEmail);
    if (alreadyExists) {
      res.status(400).json({ error: 'This email is already registered' });
      return;
    }

    const userId = crypto.randomUUID();
    const newUser: UserRecord = {
      id: userId,
      email: safeEmail,
      name: safeName,
      passwordHash: hashPassword(safePassword),
      dietaryPreferences: dietaryPreferences || [],
      bio: 'Gourmet chef creating beautiful meals while reducing green kitchen waste.',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeData<UserRecord[]>('users.json', users);

    // Seed initial stats and empty pantry/favorites for the new user
    const pantryRecord = await readData<PantryRecord>('pantry.json', {});
    pantryRecord[userId] = [];
    await writeData<PantryRecord>('pantry.json', pantryRecord);

    const statsRecord = await readData<StatsRecord>('stats.json', {});
    statsRecord[userId] = {
      recipesCooked: 0,
      foodSavedLbs: 0,
      co2SavedLbs: 0,
      activeStreak: 0
    };
    await writeData<StatsRecord>('stats.json', statsRecord);

    const token = generateToken(userId);
    res.status(201).json({
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        dietaryPreferences: newUser.dietaryPreferences,
        bio: newUser.bio
      }
    });
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to create user account' });
  }
});

// LOGIN API
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  try {
    const safeEmail = requiredString(email, 'Email', 254).toLowerCase();
    const safePassword = requiredString(password, 'Password', 1024);
    const users = await readData<UserRecord[]>('users.json', []);
    const found = users.find(u => u.email.toLowerCase() === safeEmail);

    if (!found || !verifyPassword(safePassword, found.passwordHash)) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    if (!found.passwordHash.startsWith('scrypt$')) {
      found.passwordHash = hashPassword(safePassword);
      await writeData<UserRecord[]>('users.json', users);
    }

    const token = generateToken(found.id);
    res.json({
      token,
      user: {
        name: found.name,
        email: found.email,
        dietaryPreferences: found.dietaryPreferences,
        bio: found.bio
      }
    });
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// GOOGLE SIMULATION AUTH API
router.post('/google', async (req: Request, res: Response) => {
  const { email, name, dietaryPreferences } = req.body;

  if (!email || !name) {
    res.status(400).json({ error: 'Google email and name are required' });
    return;
  }

  try {
    const users = await readData<UserRecord[]>('users.json', []);
    let found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!found) {
      // Create account
      const userId = crypto.randomUUID();
      found = {
        id: userId,
        email: email.toLowerCase().trim(),
        name: name.trim(),
        passwordHash: hashPassword('google-oauth-password-mock'),
        dietaryPreferences: dietaryPreferences || ['Vegetarian'],
        bio: 'Gourmet chef creating beautiful meals while reducing green kitchen waste.',
        createdAt: new Date().toISOString()
      };
      users.push(found);
      await writeData<UserRecord[]>('users.json', users);

      // Seed initial stats and empty pantry/favorites for the new Google user
      const pantryRecord = await readData<PantryRecord>('pantry.json', {});
      pantryRecord[userId] = [];
      await writeData<PantryRecord>('pantry.json', pantryRecord);

      const statsRecord = await readData<StatsRecord>('stats.json', {});
      statsRecord[userId] = {
        recipesCooked: 0,
        foodSavedLbs: 0,
        co2SavedLbs: 0,
        activeStreak: 0
      };
      await writeData<StatsRecord>('stats.json', statsRecord);
    }

    const token = generateToken(found.id);
    res.json({
      token,
      user: {
        name: found.name,
        email: found.email,
        dietaryPreferences: found.dietaryPreferences,
        bio: found.bio
      }
    });
  } catch (err) {
    console.error('Google Auth error:', err);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// GET CURRENT USER PROFILE
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  try {
    const users = await readData<UserRecord[]>('users.json', []);
    const user = users.find(u => u.id === userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      name: user.name,
      email: user.email,
      dietaryPreferences: user.dietaryPreferences,
      bio: user.bio
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

// UPDATE PROFILE API
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { name, email, dietaryPreferences, bio } = req.body;

  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }

  try {
    const users = await readData<UserRecord[]>('users.json', []);
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if email updated and already taken by someone else
    const emailTaken = users.some((u, i) => i !== index && u.email.toLowerCase() === email.toLowerCase().trim());
    if (emailTaken) {
      res.status(400).json({ error: 'This email is already in use by another account' });
      return;
    }

    users[index] = {
      ...users[index],
      name: name.trim(),
      email: email.toLowerCase().trim(),
      dietaryPreferences: dietaryPreferences || users[index].dietaryPreferences,
      bio: bio !== undefined ? bio : users[index].bio
    };

    await writeData<UserRecord[]>('users.json', users);

    res.json({
      name: users[index].name,
      email: users[index].email,
      dietaryPreferences: users[index].dietaryPreferences,
      bio: users[index].bio
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
