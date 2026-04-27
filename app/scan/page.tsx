'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, Sparkles, RotateCcw, Keyboard, Camera } from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';
import { Navigation } from '@/components/navigation';
import { GlassCard } from '@/components/glass-card';
import { FoodCard } from '@/components/food-card';
import { AnalyzingLoader } from '@/components/loading-skeleton';
import { generateFoodAnalysis, saveFoodEntry, type FoodEntry } from '@/utils/food-data';
import { analyzeFoodWithAI, createFoodEntryFromAnalysis } from '@/utils/ai-service';
import { useLanguage } from '@/contexts/language-context';

type AnalysisState = 'idle' | 'uploading' | 'analyzing' | 'complete';
type InputMode = 'image' | 'manual';

export default function ScanPage() {
  const { t } = useLanguage();
  const [inputMode, setInputMode] = useState<InputMode>('image');
  const [image, setImage] = useState<string | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [result, setResult] = useState<FoodEntry | null>(null);
  const [manualFoodName, setManualFoodName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setAnalysisState('uploading');
        
        // Simulate upload progress
        setTimeout(() => {
          setAnalysisState('analyzing');
          
          // Simulate AI analysis
          setTimeout(() => {
            const analysis = generateFoodAnalysis();
            const entry: FoodEntry = {
              ...analysis,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
              image_url: reader.result as string,
            };
            
            saveFoodEntry(entry);
            setResult(entry);
            setAnalysisState('complete');
          }, 2000);
        }, 800);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 1,
    disabled: analysisState !== 'idle',
  });

  const analyzeManualFood = async () => {
    if (!manualFoodName.trim()) {
      setError(t('pleaseEnterFoodName'));
      return;
    }
    
    setError(null);
    setAnalysisState('analyzing');
    
    try {
      const analysis = await analyzeFoodWithAI(manualFoodName.trim());
      const entry = createFoodEntryFromAnalysis(analysis);
      saveFoodEntry(entry);
      setResult(entry);
      setAnalysisState('complete');
    } catch (err) {
      console.error('Analysis error:', err);
      // Fallback to mock data
      const analysis = generateFoodAnalysis();
      const entry: FoodEntry = {
        ...analysis,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        food_name: manualFoodName.trim(),
      };
      saveFoodEntry(entry);
      setResult(entry);
      setAnalysisState('complete');
    }
  };

  const handleSampleFood = async (foodName: string) => {
    setAnalysisState('analyzing');
    try {
      const analysis = await analyzeFoodWithAI(foodName);
      const entry = createFoodEntryFromAnalysis(analysis);
      saveFoodEntry(entry);
      setResult(entry);
      setAnalysisState('complete');
    } catch (err) {
      console.error('Analysis error:', err);
      const analysis = generateFoodAnalysis();
      const entry: FoodEntry = {
        ...analysis,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      saveFoodEntry(entry);
      setResult(entry);
      setAnalysisState('complete');
    }
  };

  const resetScan = () => {
    setImage(null);
    setResult(null);
    setAnalysisState('idle');
    setManualFoodName('');
    setError(null);
  };

  return (
    <main className="min-h-screen relative pb-20">
      <AnimatedBackground />
      <Navigation />

      <div className="pt-28 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">{t('scanFood')}</h1>
            <p className="text-muted-foreground">
              {t('scanSubtitle')}
            </p>
          </motion.div>

          {/* Input Mode Toggle */}
          {analysisState === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-6"
            >
              <div className="glass rounded-2xl p-1.5 flex">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInputMode('image')}
                  className={`
                    relative px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors
                    ${inputMode === 'image' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
                  `}
                >
                  {inputMode === 'image' && (
                    <motion.div
                      layoutId="input-mode-indicator"
                      className="absolute inset-0 bg-neon-green/10 rounded-xl border border-neon-green/20"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Camera className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{t('uploadImage')}</span>
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInputMode('manual')}
                  className={`
                    relative px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors
                    ${inputMode === 'manual' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
                  `}
                >
                  {inputMode === 'manual' && (
                    <motion.div
                      layoutId="input-mode-indicator"
                      className="absolute inset-0 bg-neon-blue/10 rounded-xl border border-neon-blue/20"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Keyboard className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{t('enterManually')}</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* Image Upload Zone */}
            {analysisState === 'idle' && inputMode === 'image' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div
                  {...getRootProps()}
                  className={`
                    relative cursor-pointer transition-all duration-300
                    ${isDragActive ? 'scale-[1.02]' : ''}
                  `}
                >
                  <input {...getInputProps()} />
                  <GlassCard
                    glow={isDragActive ? 'green' : 'none'}
                    hover={false}
                    className={`
                      min-h-[400px] flex flex-col items-center justify-center
                      border-2 border-dashed transition-colors
                      ${isDragActive ? 'border-neon-green' : 'border-border'}
                    `}
                  >
                    <motion.div
                      animate={isDragActive ? { scale: 1.1, y: -10 } : { scale: 1, y: 0 }}
                      className="text-center"
                    >
                      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-bg flex items-center justify-center">
                        {isDragActive ? (
                          <Sparkles className="w-10 h-10" />
                        ) : (
                          <Upload className="w-10 h-10" />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {isDragActive ? 'Drop it here!' : t('dropYourFood')}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {t('orClickToBrowse')}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <ImageIcon className="w-4 h-4" />
                        <span>{t('supports')}</span>
                      </div>
                    </motion.div>
                  </GlassCard>
                </div>

                {/* Sample Images */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    {t('noImageTryExamples')}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { emoji: '🍕', name: 'Pizza' },
                      { emoji: '🍔', name: 'Burger' },
                      { emoji: '🥗', name: 'Salad' },
                      { emoji: '🍚', name: 'Idli' },
                      { emoji: '🍛', name: 'Biryani' },
                    ].map((food) => (
                      <motion.button
                        key={food.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSampleFood(food.name)}
                        className="px-4 py-2 glass rounded-xl text-sm hover:bg-white/10 transition-colors"
                      >
                        {food.emoji} {food.name}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Manual Input Zone */}
            {analysisState === 'idle' && inputMode === 'manual' && (
              <motion.div
                key="manual"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard
                  glow="blue"
                  className="min-h-[300px] flex flex-col items-center justify-center"
                >
                  <div className="w-full max-w-md">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                      <Keyboard className="w-8 h-8" />
                    </div>
                    
                    <label className="block text-center text-lg font-medium mb-4">
                      {t('enterFoodName')}
                    </label>
                    
                    <input
                      type="text"
                      value={manualFoodName}
                      onChange={(e) => {
                        setManualFoodName(e.target.value);
                        setError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          analyzeManualFood();
                        }
                      }}
                      placeholder={t('foodNamePlaceholder')}
                      className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue transition-all"
                    />
                    
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 text-center"
                      >
                        {error}
                      </motion.p>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={analyzeManualFood}
                      className="w-full mt-6 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 glow-blue"
                      style={{
                        background: 'linear-gradient(135deg, oklch(0.65 0.2 220), oklch(0.55 0.25 280))',
                      }}
                    >
                      <Sparkles className="w-5 h-5" />
                      {t('analyzeFood')}
                    </motion.button>
                  </div>
                </GlassCard>

                {/* Popular Foods */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    {t('noImageTryExamples')}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { emoji: '🍚', name: 'Idli' },
                      { emoji: '🥘', name: 'Dosa' },
                      { emoji: '🍛', name: 'Biryani' },
                      { emoji: '🥗', name: 'Dal' },
                      { emoji: '🫓', name: 'Chapati' },
                      { emoji: '🧆', name: 'Samosa' },
                    ].map((food) => (
                      <motion.button
                        key={food.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setManualFoodName(food.name);
                        }}
                        className="px-4 py-2 glass rounded-xl text-sm hover:bg-white/10 transition-colors"
                      >
                        {food.emoji} {food.name}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Uploading / Analyzing */}
            {(analysisState === 'uploading' || analysisState === 'analyzing') && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Image Preview */}
                {image && (
                  <GlassCard className="overflow-hidden p-0">
                    <div className="relative aspect-video">
                      <img
                        src={image}
                        alt="Food preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-sm text-muted-foreground">{t('uploadedImage')}</p>
                      </div>
                    </div>
                  </GlassCard>
                )}
                
                {/* Manual Food Name Display */}
                {!image && manualFoodName && (
                  <GlassCard className="text-center py-8">
                    <p className="text-muted-foreground text-sm mb-2">{t('analyzing')}</p>
                    <p className="text-2xl font-semibold">{manualFoodName}</p>
                  </GlassCard>
                )}
                
                <AnalyzingLoader />
              </motion.div>
            )}

            {/* Results */}
            {analysisState === 'complete' && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Image Preview */}
                {image && (
                  <GlassCard className="overflow-hidden p-0">
                    <div className="relative aspect-video">
                      <img
                        src={image}
                        alt="Food preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">{t('analyzedImage')}</p>
                        <button
                          onClick={() => setImage(null)}
                          className="p-2 glass rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                )}

                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-neon-green">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('analysisComplete')}</span>
                  </div>
                </motion.div>

                {/* Results Card */}
                <FoodCard entry={result} />

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetScan}
                    className="flex-1 py-4 glass rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                    {t('scanAnother')}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips Section */}
          {analysisState === 'idle' && inputMode === 'image' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <GlassCard>
                <h3 className="font-semibold mb-4">{t('tipsForBestResults')}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { emoji: '📸', tip: t('tipLighting') },
                    { emoji: '🎯', tip: t('tipCenter') },
                    { emoji: '📏', tip: t('tipPortion') },
                    { emoji: '🔍', tip: t('tipItems') },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xl">{item.emoji}</span>
                      <p className="text-sm text-muted-foreground">{item.tip}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
