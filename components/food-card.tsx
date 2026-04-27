'use client';

import { motion } from 'framer-motion';
import { Flame, Beef, Wheat, Droplet, Clock } from 'lucide-react';
import type { FoodEntry } from '@/utils/food-data';
import { GlassCard } from './glass-card';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';

interface FoodCardProps {
  entry: FoodEntry;
  index?: number;
  compact?: boolean;
}

export function FoodCard({ entry, index = 0, compact = false }: FoodCardProps) {
  const { t } = useLanguage();
  
  const verdictColors = {
    Healthy: 'text-neon-green border-neon-green/30 bg-neon-green/10',
    Moderate: 'text-neon-blue border-neon-blue/30 bg-neon-blue/10',
    Unhealthy: 'text-neon-purple border-neon-purple/30 bg-neon-purple/10',
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <GlassCard className="p-4" hover={true}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <span className="text-lg">🍽️</span>
              </div>
              <div>
                <h4 className="font-medium">{entry.food_name}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTime(entry.timestamp)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{entry.calories} kcal</span>
              <span className={cn('text-xs px-2 py-1 rounded-full border', verdictColors[entry.verdict])}>
                {entry.verdict}
              </span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard className="overflow-hidden" hover={true}>
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{entry.food_name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTime(entry.timestamp)}
                </div>
              </div>
            </div>
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium border', verdictColors[entry.verdict])}>
              {entry.verdict}
            </span>
          </div>

          {/* Nutrition Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="glass rounded-xl p-3 text-center">
              <Flame className="w-4 h-4 mx-auto mb-1 text-orange-400" />
              <span className="text-lg font-semibold">{entry.calories}</span>
              <p className="text-xs text-muted-foreground">kcal</p>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <Beef className="w-4 h-4 mx-auto mb-1 text-red-400" />
              <span className="text-lg font-semibold">{entry.protein}g</span>
              <p className="text-xs text-muted-foreground">{t('protein')}</p>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <Wheat className="w-4 h-4 mx-auto mb-1 text-yellow-400" />
              <span className="text-lg font-semibold">{entry.carbs}g</span>
              <p className="text-xs text-muted-foreground">{t('carbs')}</p>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <Droplet className="w-4 h-4 mx-auto mb-1 text-blue-400" />
              <span className="text-lg font-semibold">{entry.fat}g</span>
              <p className="text-xs text-muted-foreground">{t('fat')}</p>
            </div>
          </div>

          {/* Health Score */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${entry.health_score}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full rounded-full"
                style={{
                  background: entry.health_score >= 70
                    ? 'linear-gradient(90deg, oklch(0.75 0.25 150), oklch(0.65 0.2 180))'
                    : entry.health_score >= 40
                    ? 'linear-gradient(90deg, oklch(0.65 0.2 220), oklch(0.6 0.25 250))'
                    : 'linear-gradient(90deg, oklch(0.6 0.25 280), oklch(0.55 0.2 300))',
                }}
              />
            </div>
            <span className="text-sm font-medium">{entry.health_score}/100</span>
          </div>

          {/* Explanation */}
          <p className="text-sm text-muted-foreground">{entry.explanation}</p>

          {/* Alternative */}
          <div className="glass rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">{t('betterAlternative')}</p>
            <p className="text-sm text-neon-green">{entry.better_alternative}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
