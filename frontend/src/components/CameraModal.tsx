import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, RefreshCw, Check, Sparkles, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngredientsDetected: (ingredients: string[]) => void;
}

export default function CameraModal({ isOpen, onClose, onIngredientsDetected }: CameraModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start webcam if allowed, otherwise fall back to scanning mockup
  useEffect(() => {
    if (isOpen) {
      setIsScanning(false);
      setScanComplete(false);
      setDetectedItems([]);
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.warn('Webcam not accessible, using mock camera placeholder:', err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleScan = () => {
    setIsScanning(true);
    // Simulate smart AI object detection scanning after 2.5 seconds
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      // Prefill some fun matching items found in the fridge
      const mockDetected = ['Spinach', 'Tomato', 'Basil', 'Parmesan Cheese'];
      setDetectedItems(mockDetected);
    }, 2500);
  };

  const handleApply = () => {
    onIngredientsDetected(detectedItems);
    onClose();
  };

  const toggleDetectedItem = (item: string) => {
    if (detectedItems.includes(item)) {
      setDetectedItems(detectedItems.filter(i => i !== item));
    } else {
      setDetectedItems([...detectedItems, item]);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden bg-[#F9F6F0] rounded-2xl shadow-2xl border border-[#F2EFE9]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2EFE9] bg-[#F2EFE9]">
            <div className="flex items-center gap-2 text-[#2E5A3A]">
              <Camera size={20} />
              <h3 className="font-serif font-bold text-lg">AI Pantry Scanner</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scanner Viewfinder */}
          <div className="relative aspect-square w-full bg-black flex flex-col items-center justify-center overflow-hidden">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              // Mock camera feed with organic fresh vegetables styling
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2SmngR2H8KXRQgZNAQUgihcE1qNe4vVhTmMeXeG4ULlnUYAsEwASVxyVaY8gaYtXz3dS7UX1O4TZU2eASqITTtyjTevGgTgje59Rd0lZrUdlt88wVswaOON5elN3dE8urxXXiLgqtthFSX1IeKp-ZTz1JV7a0UQhuK3Pkcoc20QX7SJ6fidCXt3DmnngE9yePyHckBsfIIKMEdXP8KP-29ksnSdhA3SeA9PnaeBhSCHWHhcLmgSA-')`
                }}
              >
                <div className="absolute inset-0 bg-black/20" />
              </div>
            )}

            {/* Viewfinder brackets */}
            <div className="absolute inset-8 border-2 border-white/30 rounded-xl pointer-events-none flex items-center justify-center">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#478C5C] -mt-1 -ml-1 rounded-tl-md" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#478C5C] -mt-1 -mr-1 rounded-tr-md" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#478C5C] -mb-1 -ml-1 rounded-bl-md" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#478C5C] -mb-1 -mr-1 rounded-br-md" />

              {/* Laser scan line animation */}
              {isScanning && (
                <motion.div
                  initial={{ top: '5%' }}
                  animate={{ top: '95%' }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#478C5C] to-transparent shadow-[0_0_10px_#478C5C]"
                />
              )}
            </div>

            {/* Overlay Status */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-center text-white text-xs">
              {isScanning ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin text-[#478C5C]" size={14} />
                  <span>Analyzing fridge items...</span>
                </div>
              ) : scanComplete ? (
                <div className="flex items-center justify-center gap-1.5 text-green-400">
                  <Sparkles size={14} />
                  <span>AI Ingredients detected!</span>
                </div>
              ) : !cameraActive ? (
                <div className="flex items-center justify-center gap-1.5 text-orange-400">
                  <AlertCircle size={14} />
                  <span>Demo Mode (Active Table Feed)</span>
                </div>
              ) : (
                <span>Position ingredients in the frame and scan</span>
              )}
            </div>
          </div>

          {/* Controls & Results */}
          <div className="p-6">
            {!isScanning && !scanComplete ? (
              <button
                onClick={handleScan}
                className="w-full bg-[#478C5C] text-white py-4 rounded-xl font-semibold tracking-wider hover:bg-[#3D8253] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Camera size={18} />
                <span>SCAN FRIDGE</span>
              </button>
            ) : isScanning ? (
              <div className="flex flex-col items-center justify-center py-4 space-y-2">
                <div className="flex gap-1.5 justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#478C5C] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#478C5C] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#478C5C] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-sm text-gray-500 italic">Identifying organic structures...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Detected Ingredients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Spinach', 'Tomato', 'Basil', 'Parmesan Cheese', 'Chicken', 'Garlic'].map((item) => {
                      const isSelected = detectedItems.includes(item);
                      return (
                        <button
                          key={item}
                          onClick={() => toggleDetectedItem(item)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-[#f6fff4] border-[#478C5C] text-[#22683c] font-semibold'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {isSelected && <Check size={12} className="text-[#478C5C]" />}
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setScanComplete(false);
                      setDetectedItems([]);
                    }}
                    className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 active:scale-95 transition-all text-xs tracking-wider"
                  >
                    SCAN AGAIN
                  </button>
                  <button
                    onClick={handleApply}
                    className="flex-1 bg-[#478C5C] text-white py-3 rounded-xl font-semibold hover:bg-[#3D8253] active:scale-95 transition-all text-xs tracking-wider shadow-md"
                  >
                    ADD TO PANTRY
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
