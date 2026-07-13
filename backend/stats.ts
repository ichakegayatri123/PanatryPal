import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from './auth';
import { readData, writeData, StatsRecord } from './db';
import { UserStats } from './types';

const router = express.Router();

// GET STATISTICS
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  try {
    const statsRecord = await readData<StatsRecord>('stats.json', {});
    const stats = statsRecord[userId] || {
      recipesCooked: 0,
      foodSavedLbs: 0,
      co2SavedLbs: 0,
      activeStreak: 0
    };
    res.json(stats);
  } catch (err) {
    console.error('Failed to get user stats:', err);
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

// UPDATE STATISTICS
router.put('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { recipesCooked, foodSavedLbs, co2SavedLbs, activeStreak } = req.body;

  try {
    const values = { recipesCooked, foodSavedLbs, co2SavedLbs, activeStreak };
    for (const [field, value] of Object.entries(values)) {
      if (value !== undefined && (typeof value !== 'number' || !Number.isFinite(value) || value < 0)) {
        res.status(400).json({ error: `${field} must be a non-negative number` });
        return;
      }
    }
    const statsRecord = await readData<StatsRecord>('stats.json', {});
    const currentStats = statsRecord[userId] || {
      recipesCooked: 0,
      foodSavedLbs: 0,
      co2SavedLbs: 0,
      activeStreak: 0
    };

    const updatedStats: UserStats = {
      recipesCooked: recipesCooked !== undefined ? recipesCooked : currentStats.recipesCooked,
      foodSavedLbs: foodSavedLbs !== undefined ? foodSavedLbs : currentStats.foodSavedLbs,
      co2SavedLbs: co2SavedLbs !== undefined ? co2SavedLbs : currentStats.co2SavedLbs,
      activeStreak: activeStreak !== undefined ? activeStreak : currentStats.activeStreak
    };

    statsRecord[userId] = updatedStats;
    await writeData<StatsRecord>('stats.json', statsRecord);

    res.json(updatedStats);
  } catch (err) {
    console.error('Failed to update user stats:', err);
    res.status(500).json({ error: 'Failed to update stats' });
  }
});

export default router;
