import express, { Response } from 'express';
import { authenticateToken, AuthRequest } from './auth';
import { readData, writeData, PantryRecord } from './db';
import { PantryItem } from './types';
import { ApiError, requiredString } from './http';
import crypto from 'crypto';

const router = express.Router();

// GET ALL PANTRY ITEMS
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  try {
    const pantryRecord = await readData<PantryRecord>('pantry.json', {});
    const items = pantryRecord[userId] || [];
    res.json(items);
  } catch (err) {
    console.error('Failed to get pantry items:', err);
    res.status(500).json({ error: 'Failed to retrieve pantry items' });
  }
});

// ADD PANTRY ITEM
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { name, category, quantity, expiryDate, isInFridge } = req.body ?? {};

  try {
    const safeName = requiredString(name, 'Name', 120);
    const safeCategory = requiredString(category, 'Category', 80);
    const safeQuantity = requiredString(quantity, 'Quantity', 80);
    if (expiryDate !== undefined && (typeof expiryDate !== 'string' || expiryDate.length > 80)) throw new ApiError(400, 'Expiry date is invalid');
    if (isInFridge !== undefined && typeof isInFridge !== 'boolean') throw new ApiError(400, 'isInFridge must be a boolean');
    const pantryRecord = await readData<PantryRecord>('pantry.json', {});
    const items = pantryRecord[userId] || [];

    const newItem: PantryItem = {
      id: crypto.randomUUID(),
      name: safeName,
      category: safeCategory,
      quantity: safeQuantity,
      isInFridge: isInFridge ?? true,
      expiryDate: expiryDate || '7 days'
    };

    items.unshift(newItem);
    pantryRecord[userId] = items;
    await writeData<PantryRecord>('pantry.json', pantryRecord);

    res.status(201).json(newItem);
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    console.error('Failed to add pantry item:', err);
    res.status(500).json({ error: 'Failed to add pantry item' });
  }
});

// UPDATE PANTRY ITEM
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  const { name, category, quantity, isInFridge, expiryDate } = req.body;

  try {
    if (name !== undefined) requiredString(name, 'Name', 120);
    if (category !== undefined) requiredString(category, 'Category', 80);
    if (quantity !== undefined) requiredString(quantity, 'Quantity', 80);
    if (isInFridge !== undefined && typeof isInFridge !== 'boolean') throw new ApiError(400, 'isInFridge must be a boolean');
    if (expiryDate !== undefined && (typeof expiryDate !== 'string' || expiryDate.length > 80)) throw new ApiError(400, 'Expiry date is invalid');
    const pantryRecord = await readData<PantryRecord>('pantry.json', {});
    const items = pantryRecord[userId] || [];
    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
      res.status(404).json({ error: 'Pantry item not found' });
      return;
    }

    // Merge updates
    items[index] = {
      ...items[index],
      name: name !== undefined ? name.trim() : items[index].name,
      category: category !== undefined ? category.trim() : items[index].category,
      quantity: quantity !== undefined ? quantity.trim() : items[index].quantity,
      isInFridge: isInFridge !== undefined ? isInFridge : items[index].isInFridge,
      expiryDate: expiryDate !== undefined ? expiryDate : items[index].expiryDate
    };

    pantryRecord[userId] = items;
    await writeData<PantryRecord>('pantry.json', pantryRecord);

    res.json(items[index]);
  } catch (err) {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    console.error('Failed to update pantry item:', err);
    res.status(500).json({ error: 'Failed to update pantry item' });
  }
});

// DELETE PANTRY ITEM
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;

  try {
    const pantryRecord = await readData<PantryRecord>('pantry.json', {});
    const items = pantryRecord[userId] || [];
    const initialLength = items.length;
    const filteredItems = items.filter(item => item.id !== id);

    if (filteredItems.length === initialLength) {
      res.status(404).json({ error: 'Pantry item not found' });
      return;
    }

    pantryRecord[userId] = filteredItems;
    await writeData<PantryRecord>('pantry.json', pantryRecord);

    res.json({ success: true, message: 'Pantry item deleted successfully' });
  } catch (err) {
    console.error('Failed to delete pantry item:', err);
    res.status(500).json({ error: 'Failed to delete pantry item' });
  }
});

export default router;
