export interface IngredientItem {
  name: string;
  amount: string;
  category?: string;
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Intermediate' | 'Hard' | 'Advanced';
  calories: number;
  isVeggie: boolean;
  ingredients: IngredientItem[];
  instructions: string[];
  category: 'Quick Meals' | 'Vegetarian' | 'Budget Friendly' | 'Suggested';
  costCategory?: 'Under $3' | 'Under $5' | string;
  description?: string;
  matchPercentage?: number; // Calculated dynamically
}

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  expiryDate?: string;
  isInFridge: boolean;
}

export interface UserStats {
  recipesCooked: number;
  foodSavedLbs: number;
  co2SavedLbs: number;
  activeStreak: number;
}
