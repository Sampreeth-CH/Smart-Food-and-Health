'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glow?: 'green' | 'blue' | 'purple' | 'none';
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = 'none',
  hover = true,
  ...props
}: GlassCardProps) {
  const glowClasses = {
    green: 'glow-green',
    blue: 'glow-blue',
    purple: 'glow-purple',
    none: '',
  };

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'glass rounded-2xl p-6',
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
