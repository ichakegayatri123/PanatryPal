import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, X, Heart, User, ArrowLeft, Clock, Utensils, Flame, Sparkles, Check,
  Play, ArrowRight, Share2, Camera, Database, Calendar, ChevronRight, Trash2,
  PlusCircle, MinusCircle, Filter, TrendingUp, Leaf, Award, ChefHat, Menu, BookMarked,
  LogOut, Edit3
} from 'lucide-react';

import { Recipe, PantryItem, UserStats } from './types';
import { INITIAL_RECIPES, calculateMatchPercentage } from './recipesData';
import CameraModal from './components/CameraModal';
import CookingModeOverlay from './components/CookingModeOverlay';
import AddIngredientModal from './components/AddIngredientModal';
import AuthScreen from './components/AuthScreen';
import { apiRequest, getAuthToken, removeAuthToken } from './apiClient';

const DEFAULT_PANTRY: PantryItem[] = [
  { id: '1', name: 'Spinach', category: 'Vegetables', quantity: '2 cups', expiryDate: '2 days', isInFridge: true },
  { id: '2', name: 'Tomato', category: 'Vegetables', quantity: '1 cup', expiryDate: '4 days', isInFridge: true },
  { id: '3', name: 'Chicken', category: 'Proteins', quantity: '300g', expiryDate: 'Use today', isInFridge: true },
  { id: '4', name: 'Spaghetti', category: 'Grains', quantity: '400g', expiryDate: '90 days', isInFridge: true },
  { id: '5', name: 'Basil', category: 'Vegetables', quantity: '1 cup', expiryDate: '3 days', isInFridge: true },
  { id: '6', name: 'Parmesan Cheese', category: 'Dairy', quantity: '100g', expiryDate: '25 days', isInFridge: true }
];

export default function App() {
  // Screens: 'onboarding' | 'auth' | 'main' | 'recipe-detail' | 'suggested-recipes'
  const [screen, setScreen] = useState<'onboarding' | 'auth' | 'main' | 'recipe-detail' | 'suggested-recipes'>('onboarding');
  const [activeTab, setActiveTab] = useState<'search' | 'pantry' | 'saved' | 'profile'>('search');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // General image error fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80';
  };
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; dietaryPreferences: string[] } | null>(() => {
    const saved = localStorage.getItem('pantrypal_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedDiets, setEditedDiets] = useState<string[]>([]);
  const [editedBio, setEditedBio] = useState('Gourmet chef creating beautiful meals while reducing green kitchen waste.');

  const startEditingProfile = () => {
    setEditedName(currentUser ? currentUser.name : "Guest Gourmet Chef");
    setEditedEmail(currentUser ? currentUser.email : "ichakegayatri@gmail.com");
    setEditedDiets(currentUser ? currentUser.dietaryPreferences : ["Vegetarian"]);
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      return;
    }
    try {
      const data = await apiRequest('auth/profile', {
        method: 'PUT',
        body: {
          name: editedName,
          email: editedEmail,
          dietaryPreferences: editedDiets,
          bio: editedBio
        }
      });
      setCurrentUser(data);
      localStorage.setItem('pantrypal_current_user', JSON.stringify(data));
      setIsEditingProfile(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  // Filter category state
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  
  // App state
  const [pantry, setPantry] = useState<PantryItem[]>(DEFAULT_PANTRY);
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>(['creamy-basil-pesto-pasta', 'roasted-tomato-pasta']);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userStats, setUserStats] = useState<UserStats>({
    recipesCooked: 14,
    foodSavedLbs: 16.8,
    co2SavedLbs: 21.5,
    activeStreak: 4
  });

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCookingOpen, setIsCookingOpen] = useState(false);
  
  // Checked ingredients on detail view
  const [detailCheckedIngredients, setDetailCheckedIngredients] = useState<Record<string, boolean>>({});

  // AI suggestions state
  const [aiGeneratedRecipes, setAiGeneratedRecipes] = useState<Recipe[]>([]);
  const [isGeneratingAiRecipe, setIsGeneratingAiRecipe] = useState(false);
  const [aiGenerationError, setAiGenerationError] = useState('');

  const handleGenerateAiRecipe = async () => {
    setIsGeneratingAiRecipe(true);
    setAiGenerationError('');
    try {
      const newRecipe = await apiRequest<Recipe>('recipes/ai-recommend', {
        method: 'POST'
      });
      setAiGeneratedRecipes(prev => [newRecipe, ...prev]);
    } catch (err: any) {
      setAiGenerationError(err.message || 'Failed to generate AI recipe. Please check your internet connection or Gemini configuration.');
    } finally {
      setIsGeneratingAiRecipe(false);
    }
  };

  // Load session on startup
  useEffect(() => {
    const checkSession = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const user = await apiRequest('auth/me');
          setCurrentUser(user);
        } catch (err) {
          console.error('Session check failed:', err);
          setCurrentUser(null);
          removeAuthToken();
        }
      }
    };
    checkSession();
  }, []);

  // Fetch collections when user profile logs in or changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const [pantryItems, favoriteIds, stats] = await Promise.all([
            apiRequest('pantry'),
            apiRequest('recipes/favorites/list'),
            apiRequest('stats')
          ]);
          setPantry(pantryItems);
          setSavedRecipeIds(favoriteIds);
          setUserStats(stats);
        } catch (err) {
          console.error('Failed to fetch user data:', err);
        }
      } else {
        // Logged out / Guest default states
        setPantry(DEFAULT_PANTRY);
        setSavedRecipeIds(['creamy-basil-pesto-pasta', 'roasted-tomato-pasta']);
        setUserStats({
          recipesCooked: 14,
          foodSavedLbs: 16.8,
          co2SavedLbs: 21.5,
          activeStreak: 4
        });
      }
    };
    fetchUserData();
  }, [currentUser]);

  // Auth session expired listener
  useEffect(() => {
    const handleAuthExpired = () => {
      setCurrentUser(null);
      setScreen('auth');
    };
    window.addEventListener('auth_session_expired', handleAuthExpired);
    return () => {
      window.removeEventListener('auth_session_expired', handleAuthExpired);
    };
  }, []);

  // Extract names of active pantry items
  const activePantryNames = useMemo(() => {
    return pantry.filter(item => item.isInFridge).map(item => item.name);
  }, [pantry]);

  // Dynamic Recipe matches calculation
  const recipesWithMatches = useMemo(() => {
    return INITIAL_RECIPES.map(recipe => {
      const matchPct = calculateMatchPercentage(recipe, activePantryNames);
      return {
        ...recipe,
        matchPercentage: matchPct
      };
    }).sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
  }, [activePantryNames]);

  // Filters recipes for each category tab
  const quickMeals = useMemo(() => recipesWithMatches.filter(r => r.category === 'Quick Meals'), [recipesWithMatches]);
  const vegetarianMeals = useMemo(() => recipesWithMatches.filter(r => r.isVeggie), [recipesWithMatches]);
  const budgetMeals = useMemo(() => recipesWithMatches.filter(r => r.category === 'Budget Friendly'), [recipesWithMatches]);
  const suggestedMeals = useMemo(() => recipesWithMatches.filter(r => r.category === 'Suggested' || r.matchPercentage && r.matchPercentage >= 70), [recipesWithMatches]);

  // Active recipes matching the search input query and selected filter
  const searchedRecipes = useMemo(() => {
    let list = recipesWithMatches;

    // Apply category filter chip
    if (selectedCategoryFilter !== 'All') {
      const filter = selectedCategoryFilter.toLowerCase();
      if (filter === 'vegetarian') {
        list = list.filter(r => r.isVeggie);
      } else if (filter === 'quick meals') {
        list = list.filter(r => r.category === 'Quick Meals');
      } else if (filter === 'budget friendly') {
        list = list.filter(r => r.category === 'Budget Friendly');
      } else if (filter === 'suggested') {
        list = list.filter(r => r.category === 'Suggested' || (r.matchPercentage && r.matchPercentage >= 70));
      } else {
        // Cuisine or custom filter match
        list = list.filter(r => 
          r.name.toLowerCase().includes(filter) ||
          r.description?.toLowerCase().includes(filter) ||
          r.id.toLowerCase().includes(filter)
        );
      }
    }

    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase();
    return list.filter(r => 
      r.name.toLowerCase().includes(query) || 
      r.ingredients.some(ing => ing.name.toLowerCase().includes(query)) ||
      r.description?.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query) ||
      r.difficulty.toLowerCase().includes(query) ||
      (r.costCategory && r.costCategory.toLowerCase().includes(query))
    );
  }, [searchQuery, recipesWithMatches, selectedCategoryFilter]);

  // Count active matched recipes count
  const matchingRecipesCount = useMemo(() => {
    return recipesWithMatches.filter(r => r.matchPercentage && r.matchPercentage > 0).length;
  }, [recipesWithMatches]);

  // Adding item to pantry
  const handleAddPantryItem = async (name: string, category: string, quantity: string) => {
    try {
      const newItem = await apiRequest('pantry', {
        method: 'POST',
        body: { name, category, quantity }
      });
      setPantry(prev => [newItem, ...prev]);
    } catch (err) {
      console.error('Failed to add pantry item:', err);
    }
  };

  // Removing item from pantry
  const handleRemovePantryItem = async (id: string) => {
    try {
      await apiRequest(`pantry/${id}`, { method: 'DELETE' });
      setPantry(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete pantry item:', err);
    }
  };

  // Toggle item presence in fridge
  const handleTogglePantryItemPresence = async (id: string) => {
    const item = pantry.find(i => i.id === id);
    if (!item) return;
    try {
      const updated = await apiRequest(`pantry/${id}`, {
        method: 'PUT',
        body: { isInFridge: !item.isInFridge }
      });
      setPantry(prev => prev.map(i => i.id === id ? updated : i));
    } catch (err) {
      console.error('Failed to toggle pantry item presence:', err);
    }
  };

  // Adjust item quantity
  const handleAdjustQuantity = async (id: string, increment: boolean) => {
    const item = pantry.find(i => i.id === id);
    if (!item) return;
    const match = item.quantity.match(/^(\d+(\.\d+)?)\s*(\w+)?$/);
    if (!match) return;
    const num = parseFloat(match[1]);
    const unit = match[3] || '';
    const nextNum = increment ? num + 1 : Math.max(0.5, num - 0.5);
    const newQty = `${nextNum} ${unit}`.trim();
    try {
      const updated = await apiRequest(`pantry/${id}`, {
        method: 'PUT',
        body: { quantity: newQty }
      });
      setPantry(prev => prev.map(i => i.id === id ? updated : i));
    } catch (err) {
      console.error('Failed to adjust quantity:', err);
    }
  };

  // Adding detected items from Camera Scanner
  const handleIngredientsDetected = (ingredients: string[]) => {
    ingredients.forEach(ing => {
      // Check if it already exists in pantry
      const exists = pantry.some(item => item.name.toLowerCase() === ing.toLowerCase());
      if (!exists) {
        handleAddPantryItem(ing, 'Vegetables', '1 unit');
      }
    });
  };

  // Favorite toggle helper
  const handleToggleFavorite = async (recipeId: string) => {
    const isSaved = savedRecipeIds.includes(recipeId);
    try {
      if (isSaved) {
        const updated = await apiRequest(`recipes/favorites/${recipeId}`, { method: 'DELETE' });
        setSavedRecipeIds(updated);
      } else {
        const updated = await apiRequest(`recipes/favorites/${recipeId}`, { method: 'POST' });
        setSavedRecipeIds(updated);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  // Complete cooking celebration statistic updates
  const handleCookingComplete = async () => {
    const updatedStats = {
      recipesCooked: userStats.recipesCooked + 1,
      foodSavedLbs: parseFloat((userStats.foodSavedLbs + 1.2).toFixed(1)),
      co2SavedLbs: parseFloat((userStats.co2SavedLbs + 1.5).toFixed(1)),
      activeStreak: userStats.activeStreak + 1
    };
    try {
      const data = await apiRequest('stats', {
        method: 'PUT',
        body: updatedStats
      });
      setUserStats(data);
    } catch (err) {
      console.error('Failed to update stats:', err);
      // Fallback update state locally
      setUserStats(updatedStats);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex flex-col font-sans text-[#161d1f] relative overflow-x-hidden select-none pb-20">
      
      {/* -------------------- VIEW 1: ONBOARDING SCREEN -------------------- */}
      {screen === 'onboarding' && (
        <div className="relative flex-grow flex flex-col min-h-screen">
          {/* Background image */}
          <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
            <div 
              className="bg-cover bg-center w-full h-full scale-105 transform hover:scale-100 transition-transform duration-1000"
              style={{ 
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2SmngR2H8KXRQgZNAQUgihcE1qNe4vVhTmMeXeG4ULlnUYAsEwASVxyVaY8gaYtXz3dS7UX1O4TZU2eASqITTtyjTevGgTgje59Rd0lZrUdlt88wVswaOON5elN3dE8urxXXiLgqtthFSX1IeKp-ZTz1JV7a0UQhuK3Pkcoc20QX7SJ6fidCXt3DmnngE9yePyHckBsfIIKMEdXP8KP-29ksnSdhA3SeA9PnaeBhSCHWHhcLmgSA-')` 
              }}
            />
            {/* Dynamic Scrim */}
            <div className="absolute inset-0 scrim-bottom" />
          </div>

          {/* Logo Title top */}
          <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex justify-center items-center">
            <h1 className="font-serif font-bold text-4xl text-white drop-shadow-md tracking-tight">PantryPal</h1>
          </header>

          {/* Bottom text details & Actions */}
          <div className="relative z-10 flex-grow flex flex-col justify-end items-center px-6 pb-24 md:pb-32 text-center max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-6 mb-10"
            >
              <h2 className="font-serif font-bold text-3xl md:text-5xl text-[#F9F6F0] tracking-tight leading-tight">
                Cook with what you have
              </h2>
              <p className="text-[#F9F6F0] opacity-90 max-w-xl mx-auto leading-relaxed text-sm md:text-lg">
                Reduce food waste while discovering delicious new recipes tailored to your pantry.
              </p>
            </motion.div>

            {/* Interaction Layer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <button
                onClick={() => setScreen('auth')}
                className="bg-[#478C5C] text-[#F9F6F0] px-10 py-4 rounded-full font-semibold tracking-wider hover:bg-[#3D8253] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group text-xs uppercase"
              >
                <span>Get Started</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setScreen('auth')}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-[#F9F6F0] px-10 py-4 rounded-full font-semibold tracking-wider hover:bg-white/20 active:scale-95 transition-all text-xs uppercase"
              >
                Log In
              </button>
            </motion.div>
          </div>

          {/* Indicator slide dots */}
          <div className="relative z-10 w-full flex justify-center pb-8">
            <div className="flex gap-2">
              <div className="h-1.5 w-8 rounded-full bg-[#478C5C]" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
              <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      )}

      {/* -------------------- VIEW 2: AUTH SCREEN -------------------- */}
      {screen === 'auth' && (
        <AuthScreen 
          onBack={() => setScreen('onboarding')}
          onSuccess={(user) => {
            setCurrentUser(user);
            localStorage.setItem('pantrypal_current_user', JSON.stringify(user));
            setScreen('main');
            setActiveTab('search');
          }}
        />
      )}

      {/* -------------------- MAIN NAVIGATION TABS SHELL -------------------- */}
      {screen === 'main' && (
        <>
          {/* Top AppBar */}
          <header className="bg-[#F9F6F0] border-b border-[#F2EFE9] sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="text-[#478C5C] hover:opacity-80 transition-opacity active:scale-95 cursor-pointer"
                >
                  <Menu size={22} />
                </button>
                <h1 
                  onClick={() => {
                    setActiveTab('search');
                    setSearchQuery('');
                  }}
                  className="font-serif font-bold text-2xl text-[#2E5A3A] cursor-pointer"
                >
                  PantryPal
                </h1>
              </div>

              {/* Chef Avatar */}
              <button 
                onClick={() => setActiveTab('profile')}
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-[#478C5C] bg-[#E2EFE0] active:scale-95 transition-all cursor-pointer shadow-sm text-[#2E5A3A] font-bold"
              >
                {currentUser ? (
                  <span className="text-sm tracking-wider uppercase">
                    {currentUser.name ? currentUser.name.charAt(0) : 'C'}
                  </span>
                ) : (
                  <User size={18} />
                )}
              </button>
            </div>
          </header>

          {/* -------------------- SIDEBAR DRAWER -------------------- */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-black z-50 cursor-pointer"
                />
                {/* Drawer */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-72 bg-[#F9F6F0] z-50 shadow-2xl p-6 flex flex-col justify-between border-r border-[#F2EFE9]"
                >
                  <div className="space-y-8">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ChefHat className="text-[#478C5C]" size={28} />
                        <span className="font-serif font-bold text-xl text-[#2E5A3A]">PantryPal Menu</span>
                      </div>
                      <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1 hover:bg-stone-200/50 rounded-full text-stone-600 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setActiveTab('search');
                          setSearchQuery('');
                          setScreen('main');
                          setIsSidebarOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          activeTab === 'search' && screen === 'main'
                            ? 'bg-[#478C5C] text-white shadow-sm'
                            : 'text-stone-700 hover:bg-stone-200/50'
                        }`}
                      >
                        <Search size={18} />
                        <span>Search Recipes</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('pantry');
                          setScreen('main');
                          setIsSidebarOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          activeTab === 'pantry' && screen === 'main'
                            ? 'bg-[#478C5C] text-white shadow-sm'
                            : 'text-stone-700 hover:bg-[#E2EFE0]/50 hover:text-[#22683c]'
                        }`}
                      >
                        <Database size={18} />
                        <span>Pantry & Fridge</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('saved');
                          setScreen('main');
                          setIsSidebarOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          activeTab === 'saved' && screen === 'main'
                            ? 'bg-[#478C5C] text-white shadow-sm'
                            : 'text-stone-700 hover:bg-stone-200/50'
                        }`}
                      >
                        <Heart size={18} />
                        <span>Saved Recipes</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('profile');
                          setScreen('main');
                          setIsSidebarOpen(false);
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          activeTab === 'profile' && screen === 'main'
                            ? 'bg-[#478C5C] text-white shadow-sm'
                            : 'text-stone-700 hover:bg-stone-200/50'
                        }`}
                      >
                        <User size={18} />
                        <span>Chef Profile & Stats</span>
                      </button>
                    </nav>
                  </div>

                  {/* Drawer Footer Account Info */}
                  <div className="border-t border-stone-200/50 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E2EFE0] text-[#2E5A3A] font-bold flex items-center justify-center border border-[#478C5C]/30 text-sm">
                        {currentUser && currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'G'}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-stone-800 truncate max-w-[130px]">
                          {currentUser ? currentUser.name : 'Guest Chef'}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[130px]">
                          {currentUser ? currentUser.email : 'Local Account'}
                        </p>
                      </div>
                    </div>
                    {currentUser ? (
                      <button
                        onClick={() => {
                          setCurrentUser(null);
                          localStorage.removeItem('pantrypal_current_user');
                          setScreen('onboarding');
                          setIsSidebarOpen(false);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Log Out"
                      >
                        <LogOut size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setScreen('auth');
                          setIsSidebarOpen(false);
                        }}
                        className="p-2 text-[#478C5C] hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                        title="Sign In"
                      >
                        <User size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <main className="max-w-7xl mx-auto px-6 pt-6 space-y-8 flex-grow">
            
            {/* -------------------- TAB A: SEARCH RECIPES -------------------- */}
            {activeTab === 'search' && (
              <div className="space-y-8">
                {/* Search Bar section */}
                <section className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#478C5C] transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="Search recipes, cuisines, or ingredients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-[#F2EFE9] border-none rounded-xl font-sans text-sm focus:ring-2 focus:ring-[#478C5C] transition-all outline-none shadow-sm text-[#2D3436] placeholder-gray-400"
                    />
                  </div>

                  {/* Horizontal Scrollable Category Chips */}
                  <div className="flex gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin hide-scrollbar -mx-6 px-6">
                    {['All', 'Quick Meals', 'Vegetarian', 'Budget Friendly', 'Suggested', 'Indian', 'Italian', 'Mexican', 'Asian', 'Desserts'].map((chip) => {
                      const isSelected = selectedCategoryFilter === chip;
                      return (
                        <button
                          key={chip}
                          onClick={() => setSelectedCategoryFilter(chip)}
                          className={`flex-none px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                            isSelected 
                              ? 'bg-[#478C5C] border-[#478C5C] text-white shadow-sm' 
                              : 'bg-white border-stone-200 text-gray-500 hover:border-stone-400'
                          }`}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* What's in your fridge? Section */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif font-bold text-xl text-[#2D3436]">What's in your fridge?</h2>
                    <button 
                      onClick={() => setPantry(prev => prev.map(p => ({ ...p, isInFridge: false })))}
                      className="text-[#478C5C] text-sm font-semibold hover:underline"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="bg-[#F2EFE9] p-5 rounded-2xl border border-stone-200/50 space-y-4">
                    <div className="flex flex-wrap gap-2.5">
                      {/* List active chips */}
                      {pantry.filter(item => item.isInFridge).map((item) => (
                        <div 
                          key={item.id}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full border-2 border-[#478C5C] bg-[#f6fff4] shadow-sm text-sm"
                        >
                          <span className="font-medium text-[#22683c]">{item.name}</span>
                          <button 
                            onClick={() => handleTogglePantryItemPresence(item.id)}
                            className="text-[#478C5C] hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}

                      {/* Add button */}
                      <button 
                        onClick={() => setIsAddOpen(true)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#478C5C] hover:bg-[#3D8253] text-white rounded-full text-sm font-semibold active:scale-95 transition-all shadow-sm"
                      >
                        <Plus size={14} />
                        <span>Add Ingredient</span>
                      </button>
                    </div>

                    <p 
                      onClick={() => setScreen('suggested-recipes')}
                      className="text-[#478C5C] text-sm font-semibold italic cursor-pointer hover:underline flex items-center gap-1"
                    >
                      <span>Matching {matchingRecipesCount} recipes with your pantry...</span>
                      <ChevronRight size={14} />
                    </p>
                  </div>
                </section>

                {/* Render Search Query Results OR standard home categories */}
                {(searchQuery.trim() !== '' || selectedCategoryFilter !== 'All') ? (
                  <section className="space-y-4 pb-12">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-serif font-bold text-xl text-[#2D3436]">
                          {selectedCategoryFilter !== 'All' ? `${selectedCategoryFilter} Matches` : 'Search Results'}
                        </h2>
                        {searchQuery.trim() !== '' && (
                          <p className="text-xs text-gray-400 font-medium">for "{searchQuery}"</p>
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#22683c] bg-[#478C5C]/10 px-3 py-1.5 rounded-full">{searchedRecipes.length} found</span>
                    </div>

                    {searchedRecipes.length === 0 ? (
                      <div className="bg-white p-12 text-center rounded-3xl border border-stone-200/50 space-y-4">
                        <Search className="mx-auto mb-3 text-[#478C5C]/40" size={40} />
                        <div>
                          <p className="text-sm font-bold text-gray-700">No matching recipes found</p>
                          <p className="text-xs text-gray-400 mt-1">Try searching another term, checking your ingredients list, or clearing the filter.</p>
                        </div>
                        
                        <div className="pt-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Try one of these searches</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {['Pasta', 'Chicken', 'Tacos', 'Paneer', 'Desserts', 'Veggie'].map((s) => (
                              <button
                                key={s}
                                onClick={() => {
                                  if (s === 'Veggie') {
                                    setSelectedCategoryFilter('Vegetarian');
                                    setSearchQuery('');
                                  } else if (s === 'Desserts') {
                                    setSelectedCategoryFilter('Desserts');
                                    setSearchQuery('');
                                  } else {
                                    setSelectedCategoryFilter('All');
                                    setSearchQuery(s);
                                  }
                                }}
                                className="px-3 py-1.5 bg-[#F2EFE9] text-gray-600 hover:text-white hover:bg-[#478C5C] text-xs font-semibold rounded-lg border border-transparent transition-all"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {searchedRecipes.map((recipe) => (
                          <div 
                            key={recipe.id}
                            onClick={() => {
                              setSelectedRecipe(recipe);
                              setScreen('recipe-detail');
                              setDetailCheckedIngredients({});
                            }}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200/50 hover-bounce cursor-pointer flex flex-col justify-between"
                          >
                            <div className="relative h-44 w-full">
                              <img className="w-full h-full object-cover" src={recipe.image} alt={recipe.name} referrerPolicy="no-referrer" onError={handleImageError} />
                              <div className="absolute top-3 right-3 bg-[#22683c] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md">
                                {recipe.matchPercentage}% Match
                              </div>
                            </div>
                            <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                              <h3 className="font-serif font-bold text-base text-[#2D3436] leading-snug line-clamp-1">{recipe.name}</h3>
                              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{recipe.description}</p>
                              <div className="flex items-center justify-between border-t border-stone-50 pt-2 mt-2">
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                  <span className="flex items-center gap-1"><Clock size={12} /> {recipe.time}</span>
                                  <span className="flex items-center gap-1"><Utensils size={12} /> {recipe.difficulty}</span>
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleFavorite(recipe.id);
                                  }}
                                  className={`p-1.5 rounded-full ${savedRecipeIds.includes(recipe.id) ? 'text-red-500' : 'text-gray-400'}`}
                                >
                                  <Heart size={16} fill={savedRecipeIds.includes(recipe.id) ? 'currentColor' : 'none'} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ) : (
                  <>
                    {/* Category 1: Quick Meals */}
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-serif font-bold text-xl text-[#2D3436]">Quick Meals</h2>
                        <button 
                          onClick={() => setScreen('suggested-recipes')}
                          className="text-[#478C5C] hover:opacity-80 transition-opacity"
                        >
                          <ArrowRight size={20} />
                        </button>
                      </div>
                      <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar -mx-6 px-6">
                        {quickMeals.map((recipe) => (
                          <div 
                            key={recipe.id}
                            onClick={() => {
                              setSelectedRecipe(recipe);
                              setScreen('recipe-detail');
                              setDetailCheckedIngredients({});
                            }}
                            className="flex-none w-64 bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200/50 hover-bounce cursor-pointer"
                          >
                            <div className="relative h-40 w-full">
                              <img className="w-full h-full object-cover" src={recipe.image} alt={recipe.name} referrerPolicy="no-referrer" onError={handleImageError} />
                              <div className="absolute top-3 right-3 bg-[#22683c] text-white px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-md">
                                {recipe.matchPercentage}% Match
                              </div>
                            </div>
                            <div className="p-4 space-y-2">
                              <h3 className="font-serif font-bold text-sm text-[#2D3436] leading-tight line-clamp-1">{recipe.name}</h3>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Clock size={12} /> {recipe.time}</span>
                                <span className="flex items-center gap-1"><Utensils size={12} /> {recipe.difficulty}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Category 2: Vegetarian */}
                    <section className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-serif font-bold text-xl text-[#2D3436]">Vegetarian</h2>
                        <button 
                          onClick={() => setScreen('suggested-recipes')}
                          className="text-[#478C5C] hover:opacity-80 transition-opacity"
                        >
                          <ArrowRight size={20} />
                        </button>
                      </div>
                      <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar -mx-6 px-6">
                        {vegetarianMeals.map((recipe) => (
                          <div 
                            key={recipe.id}
                            onClick={() => {
                              setSelectedRecipe(recipe);
                              setScreen('recipe-detail');
                              setDetailCheckedIngredients({});
                            }}
                            className="flex-none w-64 bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200/50 hover-bounce cursor-pointer"
                          >
                            <div className="relative h-40 w-full">
                              <img className="w-full h-full object-cover" src={recipe.image} alt={recipe.name} referrerPolicy="no-referrer" onError={handleImageError} />
                              <div className="absolute top-3 right-3 bg-[#22683c] text-white px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-md">
                                {recipe.matchPercentage}% Match
                              </div>
                            </div>
                            <div className="p-4 space-y-2">
                              <h3 className="font-serif font-bold text-sm text-[#2D3436] leading-tight line-clamp-1">{recipe.name}</h3>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Clock size={12} /> {recipe.time}</span>
                                <span className="flex items-center gap-1"><Flame size={12} /> Veggie</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Category 3: Budget Friendly */}
                    <section className="space-y-4 pb-12">
                      <div className="flex items-center justify-between">
                        <h2 className="font-serif font-bold text-xl text-[#2D3436]">Budget Friendly</h2>
                        <button 
                          onClick={() => setScreen('suggested-recipes')}
                          className="text-[#478C5C] hover:opacity-80 transition-opacity"
                        >
                          <ArrowRight size={20} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {budgetMeals.map((recipe) => (
                          <div 
                            key={recipe.id}
                            onClick={() => {
                              setSelectedRecipe(recipe);
                              setScreen('recipe-detail');
                              setDetailCheckedIngredients({});
                            }}
                            className="group relative bg-[#F2EFE9] rounded-2xl p-5 flex gap-5 overflow-hidden border border-stone-200/30 hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                              <img className="w-full h-full object-cover" src={recipe.image} alt={recipe.name} referrerPolicy="no-referrer" onError={handleImageError} />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <span className="text-[#FF9F43] text-xs font-bold uppercase tracking-wider mb-1">{recipe.costCategory}</span>
                              <h3 className="font-serif font-bold text-base text-[#2D3436] leading-tight mb-1">{recipe.name}</h3>
                              <p className="text-gray-500 text-xs line-clamp-2">{recipe.description}</p>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(recipe.id);
                              }}
                              className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#22683c] shadow hover:bg-[#22683c] hover:text-white transition-colors active:scale-90"
                            >
                              <Heart size={14} fill={savedRecipeIds.includes(recipe.id) ? 'currentColor' : 'none'} className={savedRecipeIds.includes(recipe.id) ? 'text-red-500' : ''} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                )}

                {/* FAB scan camera */}
                <button 
                  onClick={() => setIsCameraOpen(true)}
                  className="fixed right-6 bottom-24 bg-[#FF9F43] hover:bg-[#e08933] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform z-40"
                >
                  <Camera size={24} />
                </button>
              </div>
            )}

            {/* -------------------- TAB B: PANTRY INVENTORY -------------------- */}
            {activeTab === 'pantry' && (
              <div className="space-y-8 pb-12">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif font-bold text-2xl text-[#2D3436]">Pantry & Fridge</h2>
                    <p className="text-xs text-gray-500">Track and manage your kitchen ingredients</p>
                  </div>
                  <button 
                    onClick={() => setIsAddOpen(true)}
                    className="bg-[#478C5C] hover:bg-[#3D8253] text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-wider flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                  >
                    <Plus size={14} />
                    <span>ADD ITEM</span>
                  </button>
                </div>

                {/* Simple List of PantryItems */}
                <div className="bg-white rounded-2xl border border-stone-200/60 shadow-sm overflow-hidden divide-y divide-stone-100">
                  {pantry.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <Database className="mx-auto mb-3 opacity-40" size={36} />
                      <p className="text-sm font-medium">Your pantry is currently empty.</p>
                      <button 
                        onClick={() => setPantry(DEFAULT_PANTRY)}
                        className="text-[#478C5C] text-xs font-semibold hover:underline mt-2"
                      >
                        Load demo ingredients
                      </button>
                    </div>
                  ) : (
                    pantry.map((item) => {
                      // Expiring warn colors
                      const isUrgent = item.expiryDate === 'Use today' || item.expiryDate === '2 days';
                      return (
                        <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleTogglePantryItemPresence(item.id)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                item.isInFridge 
                                  ? 'bg-[#478C5C]/10 border-[#478C5C] text-[#478C5C]' 
                                  : 'border-gray-300 text-transparent'
                              }`}
                            >
                              <Check size={12} />
                            </button>
                            <div className="flex flex-col">
                              <span className={`text-sm font-semibold ${item.isInFridge ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                                {item.name}
                              </span>
                              <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                                {item.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Quantity Adjusters */}
                            <div className="flex items-center gap-2 bg-[#F2EFE9] rounded-lg px-2 py-1">
                              <button 
                                onClick={() => handleAdjustQuantity(item.id, false)}
                                className="text-gray-500 hover:text-stone-800 transition-colors"
                              >
                                <MinusCircle size={14} />
                              </button>
                              <span className="font-mono text-xs font-bold text-gray-700 min-w-12 text-center select-none">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => handleAdjustQuantity(item.id, true)}
                                className="text-gray-500 hover:text-stone-800 transition-colors"
                              >
                                <PlusCircle size={14} />
                              </button>
                            </div>

                            {/* Expiry Label */}
                            <div className="hidden sm:block">
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                                isUrgent 
                                  ? 'bg-red-50 text-red-600 border border-red-100 animate-pulse' 
                                  : 'bg-stone-50 text-stone-500'
                              }`}>
                                {item.expiryDate ? `Exp: ${item.expiryDate}` : 'No Expiry'}
                              </span>
                            </div>

                            {/* Delete */}
                            <button 
                              onClick={() => handleRemovePantryItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* -------------------- TAB C: SAVED RECIPES -------------------- */}
            {activeTab === 'saved' && (
              <div className="space-y-8 pb-12">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-[#2D3436]">Saved Recipes</h2>
                  <p className="text-xs text-gray-500">Your curated collection of favorite dishes</p>
                </div>

                {savedRecipeIds.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-stone-200/50 text-gray-400">
                    <Heart className="mx-auto mb-3 opacity-30 text-gray-300" size={40} />
                    <p className="text-sm font-medium">No bookmarked recipes yet.</p>
                    <p className="text-xs mt-1">Bookmark recipes to easily cook them later.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipesWithMatches
                      .filter(recipe => savedRecipeIds.includes(recipe.id))
                      .map((recipe) => (
                        <div 
                          key={recipe.id}
                          onClick={() => {
                            setSelectedRecipe(recipe);
                            setScreen('recipe-detail');
                            setDetailCheckedIngredients({});
                          }}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200/50 hover-bounce cursor-pointer flex flex-col justify-between"
                        >
                          <div className="relative h-44 w-full">
                            <img className="w-full h-full object-cover" src={recipe.image} alt={recipe.name} referrerPolicy="no-referrer" onError={handleImageError} />
                            <div className="absolute top-3 right-3 bg-[#22683c] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md">
                              {recipe.matchPercentage}% Match
                            </div>
                          </div>
                          <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                            <div>
                              <h3 className="font-serif font-bold text-base text-[#2D3436] leading-snug line-clamp-1 mb-1">
                                {recipe.name}
                              </h3>
                              <p className="text-xs text-gray-500 line-clamp-2">{recipe.description}</p>
                            </div>

                            <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1"><Clock size={12} /> {recipe.time}</span>
                                <span className="flex items-center gap-1"><Utensils size={12} /> {recipe.difficulty}</span>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorite(recipe.id);
                                }}
                                className="text-red-500 hover:text-red-600 transition-colors"
                              >
                                <Heart size={16} fill="currentColor" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* -------------------- TAB D: USER PROFILE & STATS -------------------- */}
            {activeTab === 'profile' && (
              <div className="space-y-8 pb-12">
                {isEditingProfile ? (
                  /* Profile Edit Mode Form */
                  <section className="bg-white p-6 rounded-3xl border border-stone-200/50 shadow-sm space-y-6">
                    <div className="border-b border-stone-100 pb-4">
                      <h3 className="font-serif font-bold text-xl text-[#2D3436]">Edit Profile Details</h3>
                      <p className="text-xs text-gray-400 mt-1">Update your personal credentials and custom dietary choices</p>
                    </div>

                    <div className="space-y-4">
                      {/* Name field */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Display Name</label>
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          placeholder="e.g. Gayatri Ichake"
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#478C5C]/50 focus:border-[#478C5C] outline-none transition-all"
                        />
                      </div>

                      {/* Email field */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          value={editedEmail}
                          onChange={(e) => setEditedEmail(e.target.value)}
                          placeholder="e.g. ichakegayatri@gmail.com"
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#478C5C]/50 focus:border-[#478C5C] outline-none transition-all"
                        />
                      </div>

                      {/* Bio field */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Short Bio / Chef Motto</label>
                        <textarea
                          value={editedBio}
                          onChange={(e) => setEditedBio(e.target.value)}
                          placeholder="What is your culinary philosophy?"
                          rows={3}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-gray-700 focus:ring-2 focus:ring-[#478C5C]/50 focus:border-[#478C5C] outline-none transition-all resize-none"
                        />
                      </div>

                      {/* Interactive Dietary Preferences */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Dietary Preferences</label>
                        <div className="flex flex-wrap gap-2">
                          {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Low-Carb'].map((diet) => {
                            const isSelected = editedDiets.includes(diet);
                            return (
                              <button
                                key={diet}
                                type="button"
                                onClick={() => {
                                  setEditedDiets(prev =>
                                    prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
                                  );
                                }}
                                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                                  isSelected
                                    ? 'bg-[#478C5C]/10 border-[#478C5C] text-[#22683c] font-bold'
                                    : 'bg-stone-50 text-gray-400 border border-stone-200/40 hover:border-stone-400'
                                }`}
                              >
                                {diet}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Submit or cancel */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        className="px-6 py-2.5 bg-[#478C5C] hover:bg-[#3D8253] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </section>
                ) : (
                  <>
                    {/* User Intro Header */}
                    <section className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-stone-200/50 shadow-sm">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#478C5C] shadow-md flex-shrink-0 bg-[#E2EFE0] flex items-center justify-center text-[#2E5A3A] font-bold text-2xl">
                          {currentUser ? (
                            <span className="uppercase">{currentUser.name ? currentUser.name.charAt(0) : 'C'}</span>
                          ) : (
                            <ChefHat size={32} />
                          )}
                        </div>
                        <div className="text-center sm:text-left space-y-1.5">
                          <h3 className="font-serif font-bold text-2xl text-[#2E5A3A]">
                            {currentUser ? currentUser.name : "Guest Gourmet Chef"}
                          </h3>
                          <p className="text-xs text-gray-400 font-medium">
                            {currentUser ? currentUser.email : "Sign in to persist your stats across devices"}
                          </p>
                          {currentUser && (
                            <p className="text-xs text-stone-500 italic font-medium max-w-sm mt-1">
                              "{editedBio}"
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                            <span className="bg-[#478C5C] text-[#F9F6F0] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md">
                              Level 4 Gourmet Master
                            </span>
                            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2.5 py-1 rounded-md">
                              {currentUser ? 'Active Profile' : 'Guest Account'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions (Logout / Edit / Sign in) */}
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        {currentUser ? (
                          <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full justify-center">
                            <button
                              onClick={startEditingProfile}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                            >
                              <Edit3 size={14} />
                              <span>Edit Profile</span>
                            </button>
                            <button
                              onClick={() => {
                                setCurrentUser(null);
                                localStorage.removeItem('pantrypal_current_user');
                                setScreen('onboarding');
                              }}
                              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                            >
                              <LogOut size={14} />
                              <span>Log Out</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setScreen('auth')}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#478C5C] hover:bg-[#3D8253] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                          >
                            <User size={14} />
                            <span>Sign In / Register</span>
                          </button>
                        )}
                      </div>
                    </section>

                    {/* Level / Progress */}
                    <section className="bg-white p-6 rounded-2xl border border-stone-200/60 shadow-sm space-y-3">
                      <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                        <span>Level 4 Progress</span>
                        <span>880 / 1000 XP</span>
                      </div>
                      <div className="w-full bg-[#F2EFE9] h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#478C5C] h-full w-[88%]" />
                      </div>
                      <p className="text-xs text-gray-400">Next level unlocks high-fidelity smart composting tips!</p>
                    </section>

                    {/* Eco Metric cards */}
                    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm text-center space-y-1">
                        <Award className="mx-auto text-[#FF9F43] mb-1" size={24} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Cooked Count</span>
                        <span className="font-serif font-bold text-2xl text-stone-800">{userStats.recipesCooked} Meals</span>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm text-center space-y-1">
                        <Leaf className="mx-auto text-[#478C5C] mb-1" size={24} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Diverted Waste</span>
                        <span className="font-serif font-bold text-2xl text-[#478C5C]">{userStats.foodSavedLbs} lbs</span>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm text-center space-y-1">
                        <TrendingUp className="mx-auto text-[#22683c] mb-1" size={24} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Carbon Savings</span>
                        <span className="font-serif font-bold text-2xl text-[#22683c]">{userStats.co2SavedLbs} lbs CO2</span>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm text-center space-y-1">
                        <Flame className="mx-auto text-orange-500 mb-1" size={24} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Active Streak</span>
                        <span className="font-serif font-bold text-2xl text-orange-500">{userStats.activeStreak} Days</span>
                      </div>
                    </section>

                    {/* Personal Preferences */}
                    <section className="bg-white p-6 rounded-2xl border border-stone-200/60 shadow-sm space-y-4">
                      <h4 className="font-serif font-bold text-lg text-stone-800 border-b border-stone-100 pb-2">
                        Dietary Preferences
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Low-Carb'].map((diet) => {
                          const isSelected = currentUser ? currentUser.dietaryPreferences.includes(diet) : (diet === 'Vegetarian');
                          return (
                            <span 
                              key={diet}
                              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                                isSelected 
                                  ? 'bg-[#f6fff4] text-[#22683c] border-[#478C5C]/40 font-bold' 
                                  : 'bg-stone-50 text-gray-400 border border-stone-200/20'
                              }`}
                            >
                              {diet}
                            </span>
                          );
                        })}
                      </div>
                    </section>
                  </>
                )}
              </div>
            )}
          </main>

          {/* Bottom NavBar navigation */}
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#F2EFE9] shadow-[0_-4px_20px_rgba(45,52,54,0.05)]">
            <div className="max-w-md mx-auto flex justify-around items-center h-16 px-4">
              {/* Search Tab */}
              <button 
                onClick={() => {
                  setActiveTab('search');
                  setSearchQuery('');
                }}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 ${
                  activeTab === 'search' ? 'text-[#478C5C] font-semibold' : 'text-gray-400'
                }`}
              >
                <Search size={20} className={activeTab === 'search' ? 'scale-110 text-[#478C5C]' : ''} />
                <span className="text-[10px] uppercase tracking-wider">Search</span>
              </button>

              {/* Pantry Tab */}
              <button 
                onClick={() => setActiveTab('pantry')}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 ${
                  activeTab === 'pantry' ? 'text-[#478C5C] font-semibold' : 'text-gray-400'
                }`}
              >
                <Database size={20} className={activeTab === 'pantry' ? 'scale-110 text-[#478C5C]' : ''} />
                <span className="text-[10px] uppercase tracking-wider">Pantry</span>
              </button>

              {/* Saved Tab */}
              <button 
                onClick={() => setActiveTab('saved')}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 ${
                  activeTab === 'saved' ? 'text-[#478C5C] font-semibold' : 'text-gray-400'
                }`}
              >
                <Heart size={20} className={activeTab === 'saved' ? 'scale-110 text-[#478C5C]' : ''} />
                <span className="text-[10px] uppercase tracking-wider">Saved</span>
              </button>

              {/* Profile Tab */}
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 ${
                  activeTab === 'profile' ? 'text-[#478C5C] font-semibold' : 'text-gray-400'
                }`}
              >
                <User size={20} className={activeTab === 'profile' ? 'scale-110 text-[#478C5C]' : ''} />
                <span className="text-[10px] uppercase tracking-wider">Profile</span>
              </button>
            </div>
          </nav>
        </>
      )}

      {/* -------------------- VIEW 3: RECIPE DETAIL VIEW -------------------- */}
      {screen === 'recipe-detail' && selectedRecipe && (
        <div className="bg-[#F9F6F0] min-h-screen pb-28">
          {/* Header */}
          <header className="bg-white border-b border-[#F2EFE9] top-0 sticky z-50">
            <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setScreen('main')}
                  className="text-[#478C5C] hover:opacity-80 transition-opacity p-1 active:scale-95"
                >
                  <ArrowLeft size={22} />
                </button>
                <h1 className="font-serif font-bold text-lg text-[#2E5A3A]">PantryPal</h1>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-[#478C5C] p-2 hover:opacity-80 transition-opacity">
                  <Share2 size={20} />
                </button>
                <button 
                  onClick={() => handleToggleFavorite(selectedRecipe.id)}
                  className="text-[#478C5C] p-2 hover:opacity-80 transition-opacity active:scale-90"
                >
                  <Heart size={20} fill={savedRecipeIds.includes(selectedRecipe.id) ? '#478C5C' : 'none'} />
                </button>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto">
            {/* Hero Image Section */}
            <div className="relative w-full h-[250px] sm:h-[400px] overflow-hidden sm:rounded-b-3xl shadow-sm border-b border-stone-100">
              <img className="w-full h-full object-cover" src={selectedRecipe.image} alt={selectedRecipe.name} referrerPolicy="no-referrer" onError={handleImageError} />
              <div className="absolute top-4 right-4 bg-[#22683c] px-4 py-1 rounded-full text-white font-semibold text-xs tracking-wider shadow-lg uppercase">
                {selectedRecipe.matchPercentage}% Match
              </div>
            </div>

            {/* Text description details container */}
            <div className="px-6 mt-8 space-y-8">
              <div>
                <h2 className="font-serif font-bold text-2xl md:text-4xl text-[#2D3436] mb-2">{selectedRecipe.name}</h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4">{selectedRecipe.description}</p>
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#404941]">
                  <div className="flex items-center gap-1.5"><Clock size={14} /> {selectedRecipe.time}</div>
                  <div className="flex items-center gap-1.5"><Utensils size={14} /> {selectedRecipe.difficulty}</div>
                  <div className="flex items-center gap-1.5"><Flame size={14} /> {selectedRecipe.calories} Cal</div>
                </div>
              </div>

              {/* Grid split ingredients + instructions */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Ingredients side */}
                <section className="md:col-span-5 bg-[#F2EFE9] p-6 rounded-2xl border border-stone-200/40">
                  <div className="flex items-center justify-between mb-4 border-b border-stone-300/30 pb-2">
                    <h3 className="font-serif font-bold text-lg text-[#2E5A3A]">Ingredients</h3>
                    <span className="text-xs text-gray-500 font-semibold uppercase">4 Servings</span>
                  </div>
                  <ul className="space-y-3">
                    {selectedRecipe.ingredients.map((ing, idx) => {
                      const isChecked = detailCheckedIngredients[ing.name];
                      return (
                        <li 
                          key={idx}
                          onClick={() => setDetailCheckedIngredients(prev => ({ ...prev, [ing.name]: !isChecked }))}
                          className="flex items-center gap-3 py-1.5 cursor-pointer group select-none"
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                            isChecked ? 'bg-[#478C5C] border-[#478C5C]' : 'border-stone-400 group-hover:border-stone-600'
                          }`}>
                            {isChecked && <Check size={12} className="text-white" />}
                          </div>
                          <div className={`flex flex-1 justify-between items-center text-sm font-medium ${isChecked ? 'checked-item' : 'text-[#2D3436]'}`}>
                            <span>{ing.name}</span>
                            <span className="text-xs text-gray-400">{ing.amount}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>

                {/* Instructions side */}
                <section className="md:col-span-7 space-y-4">
                  <h3 className="font-serif font-bold text-lg text-[#2E5A3A]">Cooking Steps</h3>
                  <div className="space-y-6">
                    {selectedRecipe.instructions.map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3d8253] text-[#f6fff4] flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </span>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-700 leading-relaxed">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </main>

          {/* Fixed bottom launch bar */}
          <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md p-4 shadow-[0_-4px_20px_rgba(45,52,54,0.05)] border-t border-stone-200/50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3 justify-between">
              
              {/* Not Interested - Back button */}
              <button 
                onClick={() => setScreen('main')}
                className="w-full md:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 border border-stone-200 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Not Interested - Go Back</span>
              </button>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1 justify-end">
                {/* Save to Cookbook action */}
                <button 
                  onClick={() => handleToggleFavorite(selectedRecipe.id)}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
                    savedRecipeIds.includes(selectedRecipe.id)
                      ? 'bg-red-50 hover:bg-red-100 border border-red-200 text-red-600'
                      : 'bg-[#FF9F43]/10 hover:bg-[#FF9F43]/20 border border-[#FF9F43]/20 text-[#e08933]'
                  }`}
                >
                  <Heart size={14} fill={savedRecipeIds.includes(selectedRecipe.id) ? 'currentColor' : 'none'} />
                  <span>{savedRecipeIds.includes(selectedRecipe.id) ? 'Saved in Cookbook' : 'Save to Cookbook'}</span>
                </button>

                {/* Start Cooking action */}
                <button 
                  onClick={() => setIsCookingOpen(true)}
                  className="w-full sm:w-auto bg-[#478C5C] hover:bg-[#3D8253] text-white py-3.5 px-8 rounded-xl font-bold tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md text-xs uppercase cursor-pointer"
                >
                  <Play size={14} fill="currentColor" />
                  <span>Start Cooking</span>
                </button>
              </div>
              
            </div>
          </footer>
        </div>
      )}

      {/* -------------------- VIEW 4: SUGGESTED RECIPES VIEW -------------------- */}
      {screen === 'suggested-recipes' && (
        <div className="bg-[#F9F6F0] min-h-screen pb-20">
          <header className="bg-white border-b border-[#F2EFE9] sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setScreen('main')}
                  className="text-[#478C5C] hover:opacity-80 transition-opacity p-1 active:scale-95"
                >
                  <ArrowLeft size={22} />
                </button>
                <h1 className="font-serif font-bold text-lg text-[#2E5A3A]">PantryPal</h1>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#2D3436]">Suggested Recipes</h2>
                <p className="text-xs text-gray-500">Curated smart matches based on ingredients in your fridge</p>
              </div>

              {/* AI Recipe Generator Trigger */}
              <button
                onClick={handleGenerateAiRecipe}
                disabled={isGeneratingAiRecipe || activePantryNames.length === 0}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer ${
                  activePantryNames.length === 0
                    ? 'bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                    : isGeneratingAiRecipe
                    ? 'bg-gradient-to-r from-[#8e2de2] to-[#4a00e0]/80 text-white animate-pulse'
                    : 'bg-gradient-to-r from-[#4E65FF] to-[#92EFFD] text-white hover:shadow-lg'
                }`}
              >
                <Sparkles size={14} className={isGeneratingAiRecipe ? 'animate-spin' : ''} />
                <span>{isGeneratingAiRecipe ? 'AI Chef is Inventing...' : 'Ask AI to Invent a Recipe'}</span>
              </button>
            </div>

            {aiGenerationError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <X size={14} className="cursor-pointer" onClick={() => setAiGenerationError('')} />
                <span>{aiGenerationError}</span>
              </div>
            )}

            {/* AI Generated Chef Specials */}
            {(isGeneratingAiRecipe || aiGeneratedRecipes.length > 0) && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#4E65FF]" />
                  <h3 className="font-serif font-bold text-lg text-[#2E5A3A]">AI Chef's Creations</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                  {/* Loading Card placeholder */}
                  {isGeneratingAiRecipe && (
                    <div className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-dashed border-[#4E65FF]/40 p-6 flex flex-col items-center justify-center min-h-[300px] space-y-4 animate-pulse">
                      <div className="w-12 h-12 rounded-full bg-[#4E65FF]/10 flex items-center justify-center">
                        <Sparkles size={24} className="text-[#4E65FF] animate-spin" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="font-bold text-sm text-[#2D3436]">Inventing custom recipe...</p>
                        <p className="text-xs text-stone-400">Reviewing {activePantryNames.slice(0, 3).join(', ')}</p>
                      </div>
                    </div>
                  )}

                  {aiGeneratedRecipes.map((recipe) => (
                    <div 
                      key={recipe.id}
                      onClick={() => {
                        setSelectedRecipe(recipe);
                        setScreen('recipe-detail');
                        setDetailCheckedIngredients({});
                      }}
                      className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-[#4E65FF]/20 hover-bounce cursor-pointer flex flex-col justify-between relative group"
                    >
                      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-[#4E65FF] to-[#92EFFD] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1">
                        <Sparkles size={10} /> AI Creation
                      </div>
                      <div className="relative h-48 w-full">
                        <img className="w-full h-full object-cover" src={recipe.image} alt={recipe.name} referrerPolicy="no-referrer" onError={handleImageError} />
                      </div>
                      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="font-serif font-bold text-lg text-[#2D3436] mb-1 line-clamp-1 group-hover:text-[#4E65FF] transition-colors">{recipe.name}</h3>
                          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                            <span className="flex items-center gap-1"><Clock size={12} /> {recipe.time}</span>
                            <span className="flex items-center gap-1"><Utensils size={12} /> {recipe.difficulty}</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2">{recipe.description}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                          <p className="text-xs font-semibold text-[#4E65FF]">
                            Formulated from pantry!
                          </p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecipe(recipe);
                              setScreen('recipe-detail');
                            }}
                            className="bg-[#4E65FF] hover:bg-[#3b4ecc] text-white px-4 py-2 rounded-lg font-semibold text-xs tracking-wider uppercase active:scale-95 transition-all shadow-sm"
                          >
                            View Recipe
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="border-t border-[#F2EFE9] pt-4">
              <h3 className="font-serif font-bold text-lg text-[#2D3436] mb-4">Standard Smart Matches</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {suggestedMeals.map((recipe) => (
                <div 
                  key={recipe.id}
                  onClick={() => {
                    setSelectedRecipe(recipe);
                    setScreen('recipe-detail');
                    setDetailCheckedIngredients({});
                  }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200/50 hover-bounce cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full">
                    <img className="w-full h-full object-cover" src={recipe.image} alt={recipe.name} referrerPolicy="no-referrer" onError={handleImageError} />
                    <div className="absolute top-4 right-4 bg-[#22683c] text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-md">
                      {recipe.matchPercentage}% Match
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#2D3436] mb-1 line-clamp-1">{recipe.name}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                        <span className="flex items-center gap-1"><Clock size={12} /> {recipe.time}</span>
                        <span className="flex items-center gap-1"><Utensils size={12} /> {recipe.difficulty}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{recipe.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                      <p className="text-xs font-semibold text-[#478C5C]">
                        {recipe.matchPercentage && recipe.matchPercentage >= 90 ? 'Ideal Pantry Match!' : 'Great option!'}
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecipe(recipe);
                          setScreen('recipe-detail');
                        }}
                        className="bg-[#478C5C] hover:bg-[#3D8253] text-[#F9F6F0] px-4 py-2 rounded-lg font-semibold text-xs tracking-wider uppercase active:scale-95 transition-all shadow-sm"
                      >
                        View Recipe
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      )}

      {/* -------------------- SHARED INTERACTIVE MODALS -------------------- */}
      <AddIngredientModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onAdd={handleAddPantryItem} 
      />

      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onIngredientsDetected={handleIngredientsDetected} 
      />

      {selectedRecipe && (
        <CookingModeOverlay 
          recipe={selectedRecipe} 
          isOpen={isCookingOpen} 
          onClose={() => setIsCookingOpen(false)} 
          onComplete={handleCookingComplete} 
        />
      )}
    </div>
  );
}
