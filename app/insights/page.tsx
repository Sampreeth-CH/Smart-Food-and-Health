'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Scan, ArrowRight, Calendar, Flame, Beef } from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';
import { Navigation } from '@/components/navigation';
import { GlassCard } from '@/components/glass-card';
import { InsightCard } from '@/components/insight-card';
import { WarningBanner } from '@/components/warning-banner';
import { Skeleton } from '@/components/loading-skeleton';
import {
  getFoodEntries,
  generateInsights,
  generatePredictionWarning,
  type FoodEntry,
  type InsightData,
} from '@/utils/food-data';
import { useLanguage } from '@/contexts/language-context';

export default function InsightsPage() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const storedEntries = getFoodEntries();
      setEntries(storedEntries);
      setInsights(generateInsights(storedEntries));
      setWarning(generatePredictionWarning(storedEntries));
      setLoading(false);
    };

    const timeout = setTimeout(loadData, 500);
    return () => clearTimeout(timeout);
  }, []);

  // Calculate statistics
  const totalMeals = entries.length;
  const healthyMeals = entries.filter(e => e.verdict === 'Healthy').length;
  const unhealthyMeals = entries.filter(e => e.verdict === 'Unhealthy').length;
  const avgCalories = entries.length > 0
    ? Math.round(entries.reduce((sum, e) => sum + e.calories, 0) / entries.length)
    : 0;
  const avgProtein = entries.length > 0
    ? Math.round(entries.reduce((sum, e) => sum + e.protein, 0) / entries.length)
    : 0;
  const healthyPercentage = totalMeals > 0 ? Math.round((healthyMeals / totalMeals) * 100) : 0;

  // Get recent week data
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekEntries = entries.filter(e => e.timestamp > oneWeekAgo);

  return (
    <main className="min-h-screen relative pb-20">
      <AnimatedBackground />
      <Navigation />

      <div className="pt-28 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h1 className="text-3xl font-bold">{t('aiInsights')}</h1>
            </div>
            <p className="text-muted-foreground">
              {t('personalizedAnalysis')}
            </p>
          </motion.div>

          {/* Warning Banner */}
          {warning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <WarningBanner message={warning} />
            </motion.div>
          )}

          {entries.length < 3 ? (
            // Not enough data
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard glow="blue" className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl gradient-bg flex items-center justify-center">
                  <Lightbulb className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold mb-3">{t('unlockInsights')}</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  {t('unlockDescription')}
                </p>
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="glass rounded-xl px-4 py-3 text-center">
                    <p className="text-3xl font-bold text-neon-green">{entries.length}</p>
                    <p className="text-xs text-muted-foreground">{t('mealsLogged')}</p>
                  </div>
                  <div className="text-muted-foreground">→</div>
                  <div className="glass rounded-xl px-4 py-3 text-center">
                    <p className="text-3xl font-bold text-muted-foreground">5</p>
                    <p className="text-xs text-muted-foreground">{t('required')}</p>
                  </div>
                </div>
                <Link href="/scan">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 mx-auto glow-green"
                    style={{
                      background: 'linear-gradient(135deg, oklch(0.75 0.25 150), oklch(0.65 0.2 180))',
                    }}
                  >
                    <Scan className="w-5 h-5" />
                    {t('startLoggingMeals')}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </GlassCard>
            </motion.div>
          ) : (
            <>
              {/* Stats Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              >
                <GlassCard className="text-center">
                  <Calendar className="w-5 h-5 mx-auto mb-2 text-neon-blue" />
                  <p className="text-2xl font-bold">{totalMeals}</p>
                  <p className="text-xs text-muted-foreground">{t('totalMeals')}</p>
                </GlassCard>
                <GlassCard className="text-center">
                  <TrendingUp className="w-5 h-5 mx-auto mb-2 text-neon-green" />
                  <p className="text-2xl font-bold">{healthyPercentage}%</p>
                  <p className="text-xs text-muted-foreground">{t('healthyChoices')}</p>
                </GlassCard>
                <GlassCard className="text-center">
                  <Flame className="w-5 h-5 mx-auto mb-2 text-orange-400" />
                  <p className="text-2xl font-bold">{avgCalories}</p>
                  <p className="text-xs text-muted-foreground">{t('avgCalories')}</p>
                </GlassCard>
                <GlassCard className="text-center">
                  <Beef className="w-5 h-5 mx-auto mb-2 text-red-400" />
                  <p className="text-2xl font-bold">{avgProtein}g</p>
                  <p className="text-xs text-muted-foreground">{t('avgProtein')}</p>
                </GlassCard>
              </motion.div>

              {/* Main Insights Grid */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Insights Column */}
                <div className="lg:col-span-2 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Brain className="w-5 h-5 text-neon-purple" />
                      {t('patternAnalysis')}
                    </h2>
                    {loading ? (
                      <div className="space-y-4">
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {insights.map((insight, index) => (
                          <InsightCard key={index} insight={insight} index={index} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Weekly Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <GlassCard glow="green">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neon-green" />
                        {t('thisWeek')}
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{t('mealsLogged')}</span>
                            <span className="font-medium">{weekEntries.length}</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((weekEntries.length / 21) * 100, 100)}%` }}
                              transition={{ delay: 0.5, duration: 0.8 }}
                              className="h-full rounded-full bg-gradient-to-r from-neon-green to-neon-blue"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{t('goal')}</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="glass rounded-lg p-2">
                            <p className="text-lg font-bold text-neon-green">
                              {weekEntries.filter(e => e.verdict === 'Healthy').length}
                            </p>
                            <p className="text-xs text-muted-foreground">{t('healthy')}</p>
                          </div>
                          <div className="glass rounded-lg p-2">
                            <p className="text-lg font-bold text-neon-blue">
                              {weekEntries.filter(e => e.verdict === 'Moderate').length}
                            </p>
                            <p className="text-xs text-muted-foreground">{t('moderate')}</p>
                          </div>
                          <div className="glass rounded-lg p-2">
                            <p className="text-lg font-bold text-neon-purple">
                              {weekEntries.filter(e => e.verdict === 'Unhealthy').length}
                            </p>
                            <p className="text-xs text-muted-foreground">{t('unhealthy')}</p>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Health Breakdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <GlassCard>
                      <h3 className="font-semibold mb-4">{t('foodQualityBreakdown')}</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Healthy', count: healthyMeals, color: 'bg-neon-green', percent: totalMeals > 0 ? (healthyMeals / totalMeals) * 100 : 0 },
                          { label: 'Moderate', count: entries.filter(e => e.verdict === 'Moderate').length, color: 'bg-neon-blue', percent: totalMeals > 0 ? (entries.filter(e => e.verdict === 'Moderate').length / totalMeals) * 100 : 0 },
                          { label: 'Unhealthy', count: unhealthyMeals, color: 'bg-neon-purple', percent: totalMeals > 0 ? (unhealthyMeals / totalMeals) * 100 : 0 },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{item.label}</span>
                              <span className="text-muted-foreground">{item.count}</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percent}%` }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className={`h-full rounded-full ${item.color}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Tips */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <GlassCard glow="blue">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-neon-blue" />
                        {t('quickTips')}
                      </h3>
                      <ul className="space-y-3 text-sm">
                        <li className="flex gap-2">
                          <span>🥤</span>
                          <span className="text-muted-foreground">{t('tipWater')}</span>
                        </li>
                        <li className="flex gap-2">
                          <span>🥬</span>
                          <span className="text-muted-foreground">{t('tipVegetables')}</span>
                        </li>
                        <li className="flex gap-2">
                          <span>⏰</span>
                          <span className="text-muted-foreground">{t('tipEvening')}</span>
                        </li>
                        <li className="flex gap-2">
                          <span>🍎</span>
                          <span className="text-muted-foreground">{t('tipWhole')}</span>
                        </li>
                      </ul>
                    </GlassCard>
                  </motion.div>

                  {/* Prediction Alert */}
                  {unhealthyMeals > healthyMeals && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <GlassCard glow="purple" className="border border-neon-purple/30">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-neon-purple mt-0.5" />
                          <div>
                            <h4 className="font-semibold mb-1">{t('attentionNeeded')}</h4>
                            <p className="text-sm text-muted-foreground">
                              {t('attentionDescription')}
                            </p>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
