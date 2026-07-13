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

export interface Recipe {
  id: string;
  name: string;
  image: string;
  time: string;
  difficulty: 'Easy' | 'Medium' | 'Intermediate' | 'Hard' | 'Advanced';
  calories: number;
  isVeggie: boolean;
  ingredients: { name: string; amount: string }[];
  instructions: string[];
  category: 'Quick Meals' | 'Vegetarian' | 'Budget Friendly' | 'Suggested';
  costCategory?: string;
  description?: string;
  matchPercentage?: number;
}
