import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Volume2, X, ChevronRight, ChevronLeft, Check, Award, Flame, Sparkles } from 'lucide-react';
import { Recipe } from '../types';

interface CookingModeOverlayProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function CookingModeOverlay({ recipe, isOpen, onClose, onComplete }: CookingModeOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Parse estimated time string like "15m" or "20m" to seconds
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setSeconds(0);
      setIsActive(true);
      setCheckedIngredients({});
      setIsSpeaking(false);
      setShowCelebration(false);
    }
  }, [isOpen, recipe]);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isActive && isOpen && !showCelebration) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isOpen, showCelebration]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const speakStep = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const stepText = recipe.instructions[currentStep];
      const utterance = new SpeechSynthesisUtterance(`Step ${currentStep + 1}. ${stepText}`);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in this browser.");
    }
  };

  const handleNext = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finished all steps! Show celebratory overlay
      setShowCelebration(true);
    }
  };

  const handlePrev = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleIngredient = (name: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleFinish = () => {
    onComplete();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/95 text-stone-100 flex flex-col font-sans">
        
        {/* Confetti Celebration State */}
        {showCelebration ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto"
          >
            <div className="w-24 h-24 bg-[#478C5C]/20 border border-[#478C5C] rounded-full flex items-center justify-center mb-6 text-[#478C5C]">
              <Award size={64} className="animate-bounce" />
            </div>
            <h2 className="font-serif font-bold text-3xl text-[#8fd6a0] mb-2 flex items-center gap-2 justify-center">
              <Sparkles className="text-yellow-400" /> Cook Complete!
            </h2>
            <p className="text-stone-300 text-lg mb-6">
              You've successfully prepared the <strong className="text-white">{recipe.name}</strong>! 
            </p>
            
            {/* Environmental / Eco Impact Stats */}
            <div className="grid grid-cols-2 gap-4 w-full bg-stone-800 p-6 rounded-xl border border-stone-700 mb-8">
              <div className="text-center">
                <span className="text-stone-400 text-xs uppercase tracking-widest block mb-1">Waste Saved</span>
                <span className="text-[#8fd6a0] font-bold font-serif text-xl">~1.2 lbs</span>
              </div>
              <div className="text-center">
                <span className="text-stone-400 text-xs uppercase tracking-widest block mb-1">Streak</span>
                <span className="text-orange-400 font-bold font-serif text-xl flex items-center justify-center gap-1">
                  <Flame size={18} /> +1 Day
                </span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-[#478C5C] text-white py-4 rounded-xl font-semibold tracking-wider hover:bg-[#3D8253] active:scale-95 transition-all shadow-lg text-sm"
            >
              SAVE TO HISTORY & FINISH
            </button>
          </motion.div>
        ) : (
          /* Normal Step-by-Step Cooking View */
          <>
            {/* Top Bar */}
            <header className="px-6 py-4 flex justify-between items-center border-b border-stone-800">
              <div className="flex flex-col">
                <span className="text-xs text-[#8fd6a0] font-semibold tracking-widest uppercase">Cooking Mode</span>
                <span className="font-serif font-bold text-stone-200 line-clamp-1">{recipe.name}</span>
              </div>
              <button 
                onClick={() => {
                  window.speechSynthesis.cancel();
                  onClose();
                }}
                className="p-2 rounded-full hover:bg-stone-800 transition-colors text-stone-400 hover:text-stone-100"
              >
                <X size={20} />
              </button>
            </header>

            {/* Split layout: Recipe reference (ingredients) + Big Step Slide */}
            <div className="flex-grow flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-8 gap-8 items-stretch">
              
              {/* Left reference Panel (Ingredients checkable) */}
              <div className="w-full md:w-80 bg-stone-800/60 border border-stone-700/50 rounded-2xl p-6 flex flex-col justify-between max-h-[300px] md:max-h-none overflow-y-auto">
                <div>
                  <h4 className="font-serif font-bold text-lg text-stone-200 mb-4 border-b border-stone-700 pb-2">
                    Kitchen Prep Check
                  </h4>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ing, idx) => {
                      const isChecked = checkedIngredients[ing.name];
                      return (
                        <li 
                          key={idx}
                          onClick={() => toggleIngredient(ing.name)}
                          className="flex items-center gap-3 cursor-pointer group select-none py-1"
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                            isChecked 
                              ? 'bg-[#478C5C] border-[#478C5C]' 
                              : 'border-stone-500 group-hover:border-stone-300'
                          }`}>
                            {isChecked && <Check size={12} className="text-white" />}
                          </div>
                          <span className={`text-sm transition-all ${
                            isChecked ? 'line-through text-stone-500 opacity-60' : 'text-stone-300'
                          }`}>
                            <strong>{ing.amount}</strong> {ing.name}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-700 text-xs text-stone-400 italic">
                  Tip: check ingredients as you prep or measure them to stay organized.
                </div>
              </div>

              {/* Center Slide Panel */}
              <div className="flex-1 bg-stone-800 border border-stone-700/60 rounded-2xl p-6 md:p-10 flex flex-col justify-between items-stretch relative">
                
                {/* Step Indicators */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[#8fd6a0] text-sm font-semibold uppercase tracking-wider">
                    Step {currentStep + 1} of {recipe.instructions.length}
                  </span>
                  <button 
                    onClick={speakStep}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all border ${
                      isSpeaking 
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400 animate-pulse' 
                        : 'bg-stone-700 border-stone-600 hover:bg-stone-600 text-stone-300'
                    }`}
                  >
                    <Volume2 size={14} />
                    <span>{isSpeaking ? 'READING ALOUD...' : 'READ STEP'}</span>
                  </button>
                </div>

                {/* Big Step Instruction text */}
                <div className="flex-grow flex items-center py-6">
                  <motion.p 
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="font-serif text-xl md:text-3xl font-medium leading-relaxed text-stone-100"
                  >
                    {recipe.instructions[currentStep]}
                  </motion.p>
                </div>

                {/* Micro progress bar */}
                <div className="w-full bg-stone-700 h-2 rounded-full overflow-hidden mb-6">
                  <motion.div 
                    className="bg-[#478C5C] h-full"
                    animate={{ width: `${((currentStep + 1) / recipe.instructions.length) * 100}%` }}
                  />
                </div>

                {/* Step-by-Step Buttons */}
                <div className="flex justify-between items-center gap-4">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="flex-1 py-4 border border-stone-600 rounded-xl font-semibold hover:bg-stone-700 disabled:opacity-40 disabled:hover:bg-transparent transition-all flex items-center justify-center gap-1 text-sm text-stone-300"
                  >
                    <ChevronLeft size={18} />
                    <span>PREVIOUS STEP</span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex-2 bg-[#478C5C] text-stone-100 py-4 rounded-xl font-semibold tracking-wider hover:bg-[#3D8253] active:scale-95 transition-all flex items-center justify-center gap-1 text-sm shadow-md"
                  >
                    <span>{currentStep === recipe.instructions.length - 1 ? 'FINISH COOKING' : 'NEXT STEP'}</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom active timer bar */}
            <footer className="bg-stone-950 p-4 border-t border-stone-800 flex justify-center">
              <div className="max-w-md w-full flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-stone-500 text-[10px] uppercase tracking-widest font-bold">Active Timer</span>
                  <span className="font-mono text-xl text-stone-200 font-bold">{formatTime(seconds)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsActive(!isActive)}
                    className="p-3 bg-stone-800 rounded-full text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
                  >
                    {isActive ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button 
                    onClick={() => setSeconds(0)}
                    className="p-3 bg-stone-800 rounded-full text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
    </AnimatePresence>
  );
}
