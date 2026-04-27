'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Scan, TrendingUp, Utensils, Target, ArrowRight } from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';
import { Navigation } from '@/components/navigation';
import { GlassCard } from '@/components/glass-card';
import { HealthScore } from '@/components/health-score';
import { FoodCard } from '@/components/food-card';
import { InsightCard } from '@/components/insight-card';
import { WarningBanner } from '@/components/warning-banner';
import { Skeleton } from '@/components/loading-skeleton';
import {
  getFoodEntries,
  calculateHealthScore,
  generateInsights,
  generatePredictionWarning,
  type FoodEntry,
  type InsightData,
} from '@/utils/food-data';
import { useLanguage } from '@/contexts/language-context';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [healthScore, setHealthScore] = useState(75);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const storedEntries = getFoodEntries();
      setEntries(storedEntries);
      setHealthScore(calculateHealthScore(storedEntries));
      setInsights(generateInsights(storedEntries));
      setWarning(generatePredictionWarning(storedEntries));
      setLoading(false);
    };

    // Small delay for loading animation
    const timeout = setTimeout(loadData, 500);
    return () => clearTimeout(timeout);
  }, []);

  const recentEntries = entries.slice(0, 5);
  const totalCalories = entries.slice(0, 10).reduce((sum, e) => sum + e.calories, 0);
  const avgProtein = entries.length > 0
    ? Math.round(entries.slice(0, 10).reduce((sum, e) => sum + e.protein, 0) / Math.min(entries.length, 10))
    : 0;

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
            <h1 className="text-3xl font-bold mb-2">{t('dashboard')}</h1>
            <p className="text-muted-foreground">{t('trackProgress')}</p>
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

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Health Score and Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Health Score Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard glow="green" className="flex flex-col items-center py-8">
                  <HealthScore score={healthScore} size="lg" />
                  <div className="mt-4 text-center">
<p className="text-sm text-muted-foreground">
                    {healthScore >= 70
                        ? t('greatJob')
                        : healthScore >= 40
                        ? t('roomForImprovement')
                        : t('healthierChoices')}
                  </p>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                <GlassCard className="text-center p-4">
                  <Utensils className="w-5 h-5 mx-auto mb-2 text-neon-blue" />
                  <p className="text-2xl font-bold">{entries.length}</p>
                  <p className="text-xs text-muted-foreground">{t('mealsLogged')}</p>
                </GlassCard>
                <GlassCard className="text-center p-4">
                  <Target className="w-5 h-5 mx-auto mb-2 text-neon-purple" />
                  <p className="text-2xl font-bold">{avgProtein}g</p>
                  <p className="text-xs text-muted-foreground">{t('avgProtein')}</p>
                </GlassCard>
              </motion.div>

              {/* Today's Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-neon-green" />
                    {t('recentSummary')}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t('totalCalories')}</span>
                      <span className="font-medium">{totalCalories} kcal</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((totalCalories / 2000) * 100, 100)}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-neon-green to-neon-blue"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {totalCalories < 1500
                        ? t('belowRecommended')
                        : totalCalories < 2500
                        ? t('withinHealthy')
                        : t('aboveRecommended')}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/scan">
                  <GlassCard
                    glow="blue"
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                        <Scan className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{t('scanFood')}</p>
                        <p className="text-xs text-muted-foreground">{t('addNewMeal')}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </GlassCard>
                </Link>
              </motion.div>
            </div>

            {/* Right Column - Insights and Recent Foods */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-4">{t('aiInsights')}</h2>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {insights.slice(0, 3).map((insight, index) => (
                      <InsightCard key={index} insight={insight} index={index} />
                    ))}
                  </div>
                )}
                {insights.length > 3 && (
                  <Link href="/insights">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 py-3 glass rounded-xl text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      {t('viewAllInsights')}
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                )}
              </motion.div>

              {/* Recent Food Logs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{t('recentFoodLogs')}</h2>
                  <span className="text-sm text-muted-foreground">{t('lastMeals')}</span>
                </div>

                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20" />
                    ))}
                  </div>
                ) : recentEntries.length > 0 ? (
                  <div className="space-y-3">
                    {recentEntries.map((entry, index) => (
                      <FoodCard key={entry.id} entry={entry} index={index} compact />
                    ))}
                  </div>
                ) : (
                  <GlassCard className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-bg flex items-center justify-center">
                      <Utensils className="w-8 h-8" />
                    </div>
                    <h3 className="font-semibold mb-2">{t('noMealsLogged')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('startScanning')}
                    </p>
                    <Link href="/scan">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 rounded-xl font-medium glow-green"
                        style={{
                          background: 'linear-gradient(135deg, oklch(0.75 0.25 150), oklch(0.65 0.2 180))',
                        }}
                      >
                        {t('scanFirstMeal')}
                      </motion.button>
                    </Link>
                  </GlassCard>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
