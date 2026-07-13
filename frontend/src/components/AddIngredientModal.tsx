import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Search, Tag, ShoppingBag } from 'lucide-react';

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, category: string, quantity: string) => void;
}

const CATEGORIES = [
  { name: 'Vegetables', color: 'bg-green-100 text-green-700 border-green-200' },
  { name: 'Proteins', color: 'bg-red-100 text-red-700 border-red-200' },
  { name: 'Grains', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { name: 'Dairy', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { name: 'Pantry/Sauce', color: 'bg-purple-100 text-purple-700 border-purple-200' }
];

const SUGGESTIONS: Record<string, string[]> = {
  'Vegetables': ['Spinach', 'Tomato', 'Broccoli', 'Garlic', 'Bell Pepper', 'Onion', 'Potato', 'Cauliflower', 'Ginger', 'Basil', 'Asparagus', 'Cilantro'],
  'Proteins': ['Chicken', 'Salmon', 'Eggs', 'Beef', 'Pork', 'Tofu'],
  'Grains': ['Spaghetti', 'Rice', 'Pasta', 'Lentils', 'Black Beans', 'Quinoa'],
  'Dairy': ['Parmesan Cheese', 'Mozzarella', 'Feta Cheese', 'Heavy Cream', 'Butter', 'Yogurt'],
  'Pantry/Sauce': ['Olive Oil', 'Honey', 'Soy Sauce', 'Hummus', 'Cumin', 'Salt']
};

export default function AddIngredientModal({ isOpen, onClose, onAdd }: AddIngredientModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Vegetables');
  const [quantity, setQuantity] = useState('1 unit');

  const handleAddCustom = (name: string) => {
    if (name.trim()) {
      onAdd(name.trim(), selectedCategory, quantity || '1 unit');
      setSearchTerm('');
      setQuantity('1 unit');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#F9F6F0] rounded-2xl shadow-2xl border border-[#F2EFE9] flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2EFE9] bg-[#F2EFE9]">
            <div className="flex items-center gap-2 text-[#2E5A3A]">
              <ShoppingBag size={20} />
              <h3 className="font-serif font-bold text-lg">Add Fridge Ingredient</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Search Input for custom */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Custom Name</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Type an ingredient (e.g. Avocado, Lemon)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustom(searchTerm)}
                  className="w-full pl-11 pr-4 py-3 bg-[#F2EFE9] border-none rounded-xl font-sans text-sm focus:ring-2 focus:ring-[#478C5C] outline-none"
                />
              </div>
            </div>

            {/* Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F2EFE9] border-none rounded-xl font-sans text-sm focus:ring-2 focus:ring-[#478C5C] outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Quantity / Size</label>
                <input
                  type="text"
                  placeholder="e.g. 2 units, 200g"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F2EFE9] border-none rounded-xl font-sans text-sm focus:ring-2 focus:ring-[#478C5C] outline-none"
                />
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Quick Add ({selectedCategory})
              </label>
              <div className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-1">
                {SUGGESTIONS[selectedCategory]?.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleAddCustom(item)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-full border border-gray-200 text-xs font-medium text-[#2D3436] hover:bg-[#f6fff4] hover:border-[#478C5C] hover:text-[#22683c] active:scale-95 transition-all"
                  >
                    <Plus size={12} className="text-[#478C5C]" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-[#F2EFE9] bg-stone-50 flex gap-3 rounded-b-2xl">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 active:scale-95 transition-all text-xs tracking-wider"
            >
              CANCEL
            </button>
            <button
              onClick={() => handleAddCustom(searchTerm)}
              disabled={!searchTerm.trim()}
              className="flex-1 bg-[#478C5C] text-white py-3 rounded-xl font-semibold hover:bg-[#3D8253] disabled:opacity-50 disabled:hover:bg-[#478C5C] active:scale-95 transition-all text-xs tracking-wider shadow-md"
            >
              ADD INGREDIENT
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
