'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import type { InsightData } from '@/utils/food-data';
import { GlassCard } from './glass-card';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  insight: InsightData;
  index?: number;
}

export function InsightCard({ insight, index = 0 }: InsightCardProps) {
  const severityConfig = {
    warning: {
      icon: AlertTriangle,
      glow: 'purple' as const,
      border: 'border-neon-purple/30',
      bg: 'bg-neon-purple/5',
      iconColor: 'text-neon-purple',
    },
    info: {
      icon: Info,
      glow: 'blue' as const,
      border: 'border-neon-blue/30',
      bg: 'bg-neon-blue/5',
      iconColor: 'text-neon-blue',
    },
    success: {
      icon: CheckCircle,
      glow: 'green' as const,
      border: 'border-neon-green/30',
      bg: 'bg-neon-green/5',
      iconColor: 'text-neon-green',
    },
  };

  const config = severityConfig[insight.severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
    >
      <GlassCard glow={config.glow} className={cn(config.border, config.bg)}>
        <div className="flex gap-4">
          <div className={cn('p-3 rounded-xl glass', config.iconColor)}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{insight.icon}</span>
              <h3 className="font-semibold text-lg">{insight.pattern}</h3>
            </div>
            <p className="text-foreground">{insight.prediction}</p>
            <p className="text-sm text-muted-foreground">{insight.suggestion}</p>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
