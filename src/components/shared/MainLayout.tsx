import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Search, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import SearchModal from './SearchModal';
import SettingsModal from './SettingsModal';

export default function MainLayout({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // Parallax background glow effect based on scroll
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-indigo-500/30">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          style={{ y: y1 }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-purple-600/10 blur-[120px]"
        />
      </div>

      {/* Floating Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-5xl"
      >
        <div className="glass-panel rounded-2xl px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img src="/favicon.svg" alt="IdeaBox Logo" className="w-9 h-9 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] transition-shadow" />
            <div className="text-2xl font-bold font-display tracking-tight text-white group-hover:text-glow transition-all">
              IdeaBox
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm text-gray-400 group"
            >
              <Search size={16} className="group-hover:text-indigo-400 transition-colors" />
              <span className="hidden sm:inline">Search ideas...</span>
              <kbd className="px-2 py-0.5 bg-black/40 border border-white/10 rounded-md text-xs font-mono text-gray-300 shadow-inner">⌘K</kbd>
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white"
              title="Data Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content Space */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-36 pb-20 relative z-10">
        {children}
      </main>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
