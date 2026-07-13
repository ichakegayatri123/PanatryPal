import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, Sparkles, ChefHat, ArrowLeft } from 'lucide-react';
import { apiRequest, setAuthToken } from '../apiClient';

interface AuthScreenProps {
  onBack: () => void;
  onSuccess: (user: { name: string; email: string; dietaryPreferences: string[] }) => void;
}

export default function AuthScreen({ onBack, onSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  
  // UX state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Google Auth Simulation State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState<'select' | 'custom' | 'loading'>('select');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const DIETARY_OPTIONS = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Low-Carb'
  ];

  const handleToggleDiet = (diet: string) => {
    setSelectedDiets(prev => 
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    );
  };

  const handleGoogleLogin = async (selectedEmail: string, selectedName: string) => {
    setGoogleStep('loading');
    setError('');
    try {
      const data = await apiRequest('auth/google', {
        method: 'POST',
        body: {
          email: selectedEmail,
          name: selectedName,
          dietaryPreferences: selectedDiets.length > 0 ? selectedDiets : ['Vegetarian']
        }
      });
      setAuthToken(data.token);
      localStorage.setItem('pantrypal_current_user', JSON.stringify(data.user));
      setSuccess(true);
      setShowGoogleModal(false);
      setTimeout(() => {
        onSuccess(data.user);
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Google login failed');
      setGoogleStep('select');
      setShowGoogleModal(false);
    }
  };

  const handleDemoLogin = () => {
    handleDemoLoginFixed();
  };

  const handleDemoLoginFixed = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('auth/login', {
        method: 'POST',
        body: {
          email: 'ichakegayatri@gmail.com',
          password: 'password123'
        }
      });
      setAuthToken(data.token);
      localStorage.setItem('pantrypal_current_user', JSON.stringify(data.user));
      setSuccess(true);
      setTimeout(() => {
        onSuccess(data.user);
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Guest Login failed. Please register a new account.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple frontend validations
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const data = await apiRequest('auth/signup', {
          method: 'POST',
          body: {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            dietaryPreferences: selectedDiets
          }
        });
        setAuthToken(data.token);
        localStorage.setItem('pantrypal_current_user', JSON.stringify(data.user));
        setSuccess(true);
        setTimeout(() => {
          onSuccess(data.user);
        }, 800);
      } else {
        const data = await apiRequest('auth/login', {
          method: 'POST',
          body: {
            email: email.toLowerCase().trim(),
            password
          }
        });
        setAuthToken(data.token);
        localStorage.setItem('pantrypal_current_user', JSON.stringify(data.user));
        setSuccess(true);
        setTimeout(() => {
          onSuccess(data.user);
        }, 800);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] flex flex-col items-center justify-center p-6 relative overflow-y-auto">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#478C5C]/10 to-transparent z-0 pointer-events-none" />
      
      {/* Back button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-[#478C5C] hover:opacity-80 transition-opacity p-2 flex items-center gap-1.5 font-semibold text-sm z-10"
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200/40 p-8 relative z-10 mt-10 mb-10">
        
        {/* Header Icon / Branding */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 bg-[#478C5C]/10 text-[#478C5C] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ChefHat size={26} />
          </div>
          <h2 className="font-serif font-bold text-3xl text-[#2E5A3A] tracking-tight">PantryPal</h2>
          <p className="text-xs text-gray-400">
            {mode === 'login' ? 'Welcome back! Sign in to access your kitchen.' : 'Create an account to start tracking waste.'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#F2EFE9] p-1.5 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold tracking-wider uppercase rounded-lg transition-all ${
              mode === 'login' 
                ? 'bg-[#478C5C] text-white shadow' 
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold tracking-wider uppercase rounded-lg transition-all ${
              mode === 'signup' 
                ? 'bg-[#478C5C] text-white shadow' 
                : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-semibold mb-4 text-center"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-[#f6fff4] border border-[#478C5C]/20 text-[#22683c] rounded-xl text-xs font-semibold mb-6 flex items-center justify-center gap-2"
          >
            <Check size={16} className="text-[#478C5C] animate-bounce" />
            <span>Success! Authenticating your profile...</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Ichake"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#F2EFE9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#478C5C] transition-all outline-none text-[#2D3436] placeholder-gray-400 font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                required
                placeholder="e.g. ichakegayatri@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#F2EFE9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#478C5C] transition-all outline-none text-[#2D3436] placeholder-gray-400 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-[#F2EFE9] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#478C5C] transition-all outline-none text-[#2D3436] placeholder-gray-400 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Dietary Preferences Selector for Sign-up */}
          {mode === 'signup' && (
            <div className="space-y-2 pt-2 border-t border-stone-100 mt-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#FF9F43]" />
                <span>Dietary Preferences (Optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((diet) => {
                  const isSelected = selectedDiets.includes(diet);
                  return (
                    <button
                      key={diet}
                      type="button"
                      onClick={() => handleToggleDiet(diet)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        isSelected 
                          ? 'bg-[#478C5C]/10 border-[#478C5C] text-[#22683c]' 
                          : 'bg-white border-stone-200 text-gray-500 hover:border-stone-400'
                      }`}
                    >
                      {diet}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#478C5C] hover:bg-[#3D8253] disabled:opacity-50 text-white py-3.5 rounded-xl font-bold tracking-wider text-xs uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all mt-4"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Log In to Account' : 'Register Account'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={() => {
            setGoogleStep('select');
            setShowGoogleModal(true);
          }}
          disabled={loading || success}
          className="w-full bg-white hover:bg-stone-50 text-stone-700 py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 border border-stone-200/80 shadow-sm active:scale-95 transition-all mt-3"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Extra Actions separator */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100" /></div>
          <span className="relative bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or test quickly</span>
        </div>

        {/* Guest login action */}
        <button
          onClick={handleDemoLoginFixed}
          disabled={loading || success}
          className="w-full bg-[#FF9F43]/10 hover:bg-[#FF9F43]/20 text-[#e08933] py-3.5 rounded-xl font-bold tracking-wider text-xs uppercase flex items-center justify-center gap-2 border border-[#FF9F43]/20 active:scale-95 transition-all"
        >
          <Sparkles size={14} />
          <span>One-Click Guest Login</span>
        </button>

        {mode === 'login' && (
          <p className="text-center text-xs text-gray-400 mt-6 font-medium">
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={() => setMode('signup')} 
              className="text-[#478C5C] font-bold hover:underline"
            >
              Sign Up
            </button>
          </p>
        )}

        {mode === 'signup' && (
          <p className="text-center text-xs text-gray-400 mt-6 font-medium">
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={() => setMode('login')} 
              className="text-[#478C5C] font-bold hover:underline"
            >
              Log In
            </button>
          </p>
        )}

      </div>

      {/* Google Sign-In Dialog Overlay */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-stone-200/60 p-6 space-y-5 overflow-hidden"
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center space-y-2">
              {/* Google stylized G Logo */}
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <h3 className="font-sans font-bold text-lg text-gray-800">Sign in with Google</h3>
              <p className="text-xs text-gray-500">to continue to <span className="font-serif font-bold text-[#478C5C]">PantryPal</span></p>
            </div>

            {googleStep === 'select' && (
              <div className="space-y-3">
                {/* Simulated Google account button for the current user */}
                <button
                  type="button"
                  onClick={() => handleGoogleLogin('ichakegayatri@gmail.com', 'Gayatri Ichake')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 border border-stone-100 transition-all text-left group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#478C5C] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    G
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700 group-hover:text-black">Gayatri Ichake</p>
                    <p className="text-[10px] text-gray-400 truncate">ichakegayatri@gmail.com</p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-500 hover:underline">Select</span>
                </button>

                {/* Simulated other Google account button */}
                <button
                  type="button"
                  onClick={() => setGoogleStep('custom')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 border border-stone-100 transition-all text-left text-xs font-semibold text-gray-500"
                >
                  <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center shadow-inner">
                    <User size={16} />
                  </div>
                  <span>Use another Google account</span>
                </button>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(false)}
                    className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-3 py-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {googleStep === 'custom' && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (customGoogleEmail && customGoogleName) {
                    handleGoogleLogin(customGoogleEmail, customGoogleName);
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. delicious.chef@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Chef"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setGoogleStep('select')}
                    className="text-xs font-semibold text-gray-400 hover:text-gray-600"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            {googleStep === 'loading' && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-xs font-bold text-stone-500 animate-pulse">Establishing Google session...</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

    </div>
  );
}
