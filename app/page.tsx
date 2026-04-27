'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Scan, Brain, BarChart3, Sparkles, Shield, Zap } from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';
import { GlassCard } from '@/components/glass-card';
import { Navigation } from '@/components/navigation';
import { useLanguage } from '@/contexts/language-context';

const features = [
  {
    icon: Scan,
    title: 'Smart Food Scanning',
    description: 'Upload any food image and get instant AI-powered nutritional analysis',
    glow: 'green' as const,
  },
  {
    icon: Brain,
    title: 'Behavior Prediction',
    description: 'AI detects your eating patterns and predicts unhealthy choices before they happen',
    glow: 'blue' as const,
  },
  {
    icon: BarChart3,
    title: 'Health Insights',
    description: 'Get personalized recommendations based on your food history',
    glow: 'purple' as const,
  },
];

const stats = [
  { value: '500+', label: 'Foods Analyzed' },
  { value: '95%', label: 'Accuracy Rate' },
  { value: '10K+', label: 'Active Users' },
];

export default function LandingPage() {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-neon-green" />
            <span className="text-sm">AI-Powered Food Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-balance"
          >
            Your AI{' '}
            <span className="text-gradient">Food Intelligence</span>
            <br />
            System
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty"
          >
            Understand what you eat. Improve how you live. NutriMind uses advanced AI
            to analyze your food choices and help you build healthier eating habits.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/scan">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 glow-green"
                style={{
                  background: 'linear-gradient(135deg, oklch(0.75 0.25 150), oklch(0.65 0.2 180))',
                }}
              >
                <Scan className="w-5 h-5" />
                {t('getStarted')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl font-semibold glass hover:bg-white/10 transition-colors"
              >
                {t('viewDashboard')}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8"
          >
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl sm:text-4xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Intelligent Features
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Powered by advanced AI to give you real-time insights about your eating habits
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard glow={feature.glow} className="h-full">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center">
                      <feature.icon className="w-7 h-7 text-neon-green" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to start your health journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Scan Your Food', desc: 'Take a photo or upload an image of your meal', icon: '📸' },
              { step: '02', title: 'Get Analysis', desc: 'AI instantly analyzes nutritional content and health impact', icon: '🔬' },
              { step: '03', title: 'Track Progress', desc: 'Build better habits with personalized insights', icon: '📈' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center text-4xl">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-neon-green text-background font-bold text-sm flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Why Choose{' '}
                <span className="text-gradient">NutriMind AI?</span>
              </h2>
              <div className="space-y-4">
                {[
                  { icon: Shield, text: 'Privacy-first: All data stored locally on your device' },
                  { icon: Zap, text: 'Instant analysis with no waiting time' },
                  { icon: Brain, text: 'Predictive AI learns your patterns over time' },
                  { icon: BarChart3, text: 'Detailed insights to optimize your diet' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-neon-green" />
                    </div>
                    <p>{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard glow="green" className="p-8">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full gradient-bg flex items-center justify-center">
                    <span className="text-6xl">🧠</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Smart AI Assistant</h3>
                  <p className="text-muted-foreground mb-6">
                    Our AI continuously learns from your eating patterns to provide
                    increasingly accurate predictions and recommendations.
                  </p>
                  <Link href="/scan">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 rounded-xl font-semibold glow-green"
                      style={{
                        background: 'linear-gradient(135deg, oklch(0.75 0.25 150), oklch(0.65 0.2 180))',
                      }}
                    >
                      Try It Now
                    </motion.button>
                  </Link>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard glow="purple" className="text-center p-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Transform Your Diet?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of users who are already making smarter food choices
                with NutriMind AI.
              </p>
              <Link href="/scan">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 rounded-2xl font-semibold text-lg flex items-center gap-3 mx-auto glow-green"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.75 0.25 150), oklch(0.65 0.2 180))',
                  }}
                >
                  <Scan className="w-6 h-6" />
                  Start Your Health Journey
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green via-neon-blue to-neon-purple flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="font-semibold">NutriMind AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 NutriMind AI. Your health, intelligently managed.
          </p>
        </div>
      </footer>
    </main>
  );
}
