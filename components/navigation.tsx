'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Scan, BarChart3, Sparkles, Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';
import { languageNames, type Language } from '@/utils/translations';

export function Navigation() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const navItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/dashboard', label: t('dashboard'), icon: BarChart3 },
    { href: '/scan', label: t('scan'), icon: Scan },
    { href: '/insights', label: t('insights'), icon: Sparkles },
  ];

  const languages: Language[] = ['en', 'hi', 'kn', 'te'];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
    >
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green via-neon-blue to-neon-purple flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-background" />
            </div>
            <span className="font-semibold text-lg hidden sm:block">{t('nutrimind')}</span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'relative px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 transition-colors',
                      isActive
                        ? 'text-neon-green'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-neon-green/10 rounded-xl border border-neon-green/20"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="text-sm font-medium relative z-10 hidden sm:block">
                      {item.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}

            {/* Language Switcher */}
            <div className="relative ml-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:block">
                  {languageNames[language]}
                </span>
                <ChevronDown className={cn(
                  "w-3 h-3 transition-transform",
                  isLangOpen && "rotate-180"
                )} />
              </motion.button>

              <AnimatePresence>
                {isLangOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsLangOpen(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 z-50 glass rounded-xl py-2 min-w-[140px] border border-border"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguage(lang);
                            setIsLangOpen(false);
                          }}
                          className={cn(
                            "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/10",
                            language === lang 
                              ? "text-neon-green font-medium" 
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {languageNames[lang]}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
