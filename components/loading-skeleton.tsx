'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={cn('bg-secondary rounded-xl', className)}
    />
  );
}

export function FoodCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="w-32 h-5" />
          <Skeleton className="w-20 h-3" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="w-full h-2 rounded-full" />
      <Skeleton className="w-full h-16 rounded-xl" />
    </div>
  );
}

export function AnalyzingLoader() {
  return (
    <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: 'oklch(0.75 0.25 150)',
            borderRightColor: 'oklch(0.65 0.2 220)',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-4 border-transparent"
          style={{
            borderBottomColor: 'oklch(0.6 0.25 280)',
            borderLeftColor: 'oklch(0.7 0.2 150)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🔍</span>
        </div>
      </div>
      <div className="text-center space-y-2">
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-semibold text-lg"
        >
          Analyzing Food...
        </motion.p>
        <p className="text-sm text-muted-foreground">
          Our AI is identifying nutrients and health impacts
        </p>
      </div>
    </div>
  );
}
