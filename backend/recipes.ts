import express, { Request, Response } from 'express';
import { authenticateToken, AuthRequest, verifyToken } from './auth';
import { readData, writeData, FavoritesRecord, PantryRecord } from './db';
import { INITIAL_RECIPES, calculateMatchPercentage } from '../frontend/src/recipesData';
import { GoogleGenAI } from '@google/genai';
import { Recipe } from './types';

const router = express.Router();

// Initialize Gemini Client if API key is provided
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({ apiKey });
  console.log('Gemini API client initialized successfully.');
} else {
  console.log('Warning: GEMINI_API_KEY is not configured. AI suggestions will fall back to a mock generated recipe.');
}

// GET ALL RECIPES (Optional authentication to compute matches)
router.get('/', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    let activePantryNames: string[] = [];
    
    if (token) {
      const userId = verifyToken(token);
      if (userId) {
        const pantryRecord = await readData<PantryRecord>('pantry.json', {});
        const items = pantryRecord[userId] || [];
        activePantryNames = items.filter(item => item.isInFridge).map(item => item.name);
      }
    }

    const recipesWithMatches = INITIAL_RECIPES.map(recipe => {
      const matchPct = calculateMatchPercentage(recipe, activePantryNames);
      return {
        ...recipe,
        matchPercentage: matchPct
      };
    });

    // Sort recipes: higher match percentage first
    recipesWithMatches.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));

    res.json(recipesWithMatches);
  } catch (err) {
    console.error('Failed to get recipes:', err);
    res.status(500).json({ error: 'Failed to retrieve recipes' });
  }
});

// GET FAVORITE RECIPES
// NOTE: This route MUST be defined before /:id, otherwise Express will match
// the string 'favorites' as a recipe ID parameter and return a 404.
router.get('/favorites/list', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  try {
    const favoritesRecord = await readData<FavoritesRecord>('favorites.json', {});
    const favoriteIds = favoritesRecord[userId] || [];
    res.json(favoriteIds);
  } catch (err) {
    console.error('Failed to get favorites:', err);
    res.status(500).json({ error: 'Failed to retrieve favorites' });
  }
});

// GET RECIPE DETAILS
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const recipe = INITIAL_RECIPES.find(r => r.id === id);
    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve recipe details' });
  }
});


// ADD FAVORITE
router.post('/favorites/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  try {
    const favoritesRecord = await readData<FavoritesRecord>('favorites.json', {});
    const favoriteIds = favoritesRecord[userId] || [];

    if (!favoriteIds.includes(id)) {
      favoriteIds.push(id);
      favoritesRecord[userId] = favoriteIds;
      await writeData<FavoritesRecord>('favorites.json', favoritesRecord);
    }

    res.json(favoriteIds);
  } catch (err) {
    console.error('Failed to add favorite:', err);
    res.status(500).json({ error: 'Failed to add recipe to favorites' });
  }
});

// REMOVE FAVORITE
router.delete('/favorites/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const { id } = req.params;
  try {
    const favoritesRecord = await readData<FavoritesRecord>('favorites.json', {});
    const favoriteIds = favoritesRecord[userId] || [];

    const updatedFavorites = favoriteIds.filter(favId => favId !== id);
    favoritesRecord[userId] = updatedFavorites;
    await writeData<FavoritesRecord>('favorites.json', favoritesRecord);

    res.json(updatedFavorites);
  } catch (err) {
    console.error('Failed to remove favorite:', err);
    res.status(500).json({ error: 'Failed to remove recipe from favorites' });
  }
});

// POST AI RECOMMEND
router.post('/ai-recommend', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  try {
    const pantryRecord = await readData<PantryRecord>('pantry.json', {});
    const items = pantryRecord[userId] || [];
    const activeIngredients = items.filter(item => item.isInFridge).map(item => item.name);

    if (activeIngredients.length === 0) {
      res.status(400).json({ error: 'Please add ingredients to your fridge first to generate AI recipes!' });
      return;
    }

    if (!ai) {
      // Fallback response for mock if API key isn't provided
      console.log('Gemini client not initialized. Sending mock generated recipe.');
      const mockRecipe: Recipe = {
        id: `ai-mock-recipe-${Date.now()}`,
        name: `AI Crispy Garden Sauté`,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        time: '15m',
        difficulty: 'Easy',
        calories: 310,
        isVeggie: true,
        ingredients: activeIngredients.map(name => ({ name, amount: '1 cup' })),
        instructions: [
          'Wash and prep all ingredients: ' + activeIngredients.join(', ') + '.',
          'Heat a splash of olive oil in a hot pan over medium heat.',
          'Sauté the prepped ingredients until golden and fragrant.',
          'Season with a pinch of salt and pepper, serve warm immediately!'
        ],
        category: 'Suggested',
        description: 'A quick and nutrient-dense skillet sauté made using the ingredients found in your fridge.'
      };
      res.json(mockRecipe);
      return;
    }

    const prompt = `You are a culinary expert AI.
Based on the following active ingredients in the user's pantry:
${activeIngredients.join(', ')}

Please invent a creative, delicious, and realistic recipe that incorporates at least some of these ingredients.
Return the recipe in JSON format strictly matching this TypeScript interface:
interface Recipe {
  id: string; // url-friendly unique identifier, e.g. 'roasted-mediterranean-chickpeas'
  name: string;
  image: string; // a high quality Unsplash image URL related to the recipe type (e.g. pasta, salad, stirfry, chicken)
  time: string; // format like '20m', '40m' or '1h'
  difficulty: 'Easy' | 'Medium' | 'Intermediate' | 'Hard' | 'Advanced';
  calories: number;
  isVeggie: boolean; // boolean if it is vegetarian
  ingredients: { name: string; amount: string }[];
  instructions: string[];
  category: 'Quick Meals' | 'Vegetarian' | 'Budget Friendly' | 'Suggested';
  costCategory?: string; // e.g. 'Under $5'
  description: string;
}

Guidelines:
1. Ensure the JSON is valid and strictly parsed.
2. Return ONLY the raw JSON string. Do NOT enclose it in markdown blocks (e.g. do not wrap with \`\`\`json).
3. Select a beautiful, high-resolution Unsplash food image URL appropriate to the recipe.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    let text = response.text;

    
    // Clean up code block markdown formatting if Gemini included it anyway
    if (text.startsWith('```json')) {
      text = text.substring(7);
    } else if (text.startsWith('```')) {
      text = text.substring(3);
    }
    if (text.endsWith('```')) {
      text = text.substring(0, text.length - 3);
    }
    text = text.trim();

    try {
      const generatedRecipe = JSON.parse(text) as Recipe;
      // Guarantee ID is unique
      generatedRecipe.id = `ai-gen-${Date.now()}-${generatedRecipe.id}`;
      generatedRecipe.category = 'Suggested';
      res.json(generatedRecipe);
    } catch (parseError) {
      console.error('Failed to parse Gemini JSON output:', text, parseError);
      res.status(500).json({ error: 'Failed to generate a valid recipe. Please try again.' });
    }
  } catch (err) {
    console.error('AI Suggestion error:', err);
    res.status(500).json({ error: 'Failed to generate recipe from Gemini API' });
  }
});

export default router;
