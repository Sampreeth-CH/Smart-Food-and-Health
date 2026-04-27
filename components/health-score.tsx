'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface HealthScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function HealthScore({ score, size = 'md' }: HealthScoreProps) {
  const [mounted, setMounted] = useState(false);
  
  const sizes = {
    sm: { container: 120, stroke: 8, text: 'text-2xl' },
    md: { container: 180, stroke: 12, text: 'text-4xl' },
    lg: { container: 240, stroke: 16, text: 'text-5xl' },
  };

  const { container, stroke, text } = sizes[size];
  const radius = (container - stroke) / 2;
  const circumference = radius * 2 * Math.PI;

  const springScore = useSpring(0, { stiffness: 50, damping: 20 });
  const displayScore = useTransform(springScore, (val) => Math.round(val));
  const strokeDashoffset = useTransform(
    springScore,
    (val) => circumference - (val / 100) * circumference
  );

  useEffect(() => {
    setMounted(true);
    springScore.set(score);
  }, [score, springScore]);

  const getScoreColor = (s: number) => {
    if (s >= 70) return { gradient: 'url(#greenGradient)', glow: 'oklch(0.75 0.25 150)' };
    if (s >= 40) return { gradient: 'url(#blueGradient)', glow: 'oklch(0.65 0.2 220)' };
    return { gradient: 'url(#purpleGradient)', glow: 'oklch(0.6 0.25 280)' };
  };

  const scoreColor = getScoreColor(score);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    return displayScore.on('change', (v) => setDisplayValue(v));
  }, [displayScore]);

  if (!mounted) {
    return (
      <div 
        className="relative flex items-center justify-center" 
        style={{ width: container, height: container }}
      >
        <div className="animate-pulse bg-secondary rounded-full" style={{ width: container, height: container }} />
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: container, height: container }}>
      <svg
        width={container}
        height={container}
        className="transform -rotate-90"
        style={{ filter: `drop-shadow(0 0 20px ${scoreColor.glow})` }}
      >
        <defs>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.75 0.25 150)" />
            <stop offset="100%" stopColor="oklch(0.65 0.2 180)" />
          </linearGradient>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.65 0.2 220)" />
            <stop offset="100%" stopColor="oklch(0.6 0.25 250)" />
          </linearGradient>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.6 0.25 280)" />
            <stop offset="100%" stopColor="oklch(0.55 0.2 300)" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={container / 2}
          cy={container / 2}
          r={radius}
          stroke="oklch(0.2 0.02 270)"
          strokeWidth={stroke}
          fill="none"
        />
        
        {/* Animated progress circle */}
        <motion.circle
          cx={container / 2}
          cy={container / 2}
          r={radius}
          stroke={scoreColor.gradient}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`font-bold ${text}`}
          style={{
            background: 'linear-gradient(135deg, oklch(0.75 0.25 150), oklch(0.65 0.2 220))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {displayValue}
        </motion.span>
        <span className="text-muted-foreground text-sm">Health Score</span>
      </div>
    </div>
  );
}
