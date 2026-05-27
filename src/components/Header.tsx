import React from 'react';
import { BookOpen, Flame, Heart, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  streak: number;
  completedPlanToday: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bookmarksCount: number;
}

export default function Header({ 
  streak, 
  completedPlanToday, 
  activeTab, 
  setActiveTab,
  bookmarksCount
}: HeaderProps) {
  return (
    <header className="bg-gradient-to-b from-celestial-850 to-celestial-900 text-white px-5 pt-7 pb-6 rounded-b-[2.5rem] shadow-2xl border-b border-gold-500/15 relative overflow-hidden">
      {/* Immersive background stars and halo light blobs */}
      <div className="absolute top-0 right-10 w-44 h-44 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      
      {/* Glistening little star patterns */}
      <div className="absolute top-4 left-1/4 opacity-30 animate-pulse">
        <Star className="h-2 w-2 text-gold-400 fill-gold-400" />
      </div>
      <div className="absolute top-8 right-1/3 opacity-25 animate-pulse" style={{ animationDelay: '1.5s' }}>
        <Star className="h-3 w-3 text-gold-400" />
      </div>

      <div className="flex justify-between items-center relative z-10">
        <div>
          <span className="text-[10px] text-gold-400 uppercase tracking-widest font-sans font-semibold block mb-1">
            ✙ FAITH COMPANION
          </span>
          <h1 className="text-2xl font-serif font-bold tracking-wide text-white flex items-center gap-1.5 matches-app-headline">
            Daily Bread <Sparkles className="h-4.5 w-4.5 text-gold-400 animate-spin-slow" />
          </h1>
        </div>

        {/* Dynamic Streak Tracker in Header */}
        <div className="flex items-center gap-2">
          {/* Main Bible Chat Streak styling */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('soul')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-all border ${
              completedPlanToday 
                ? 'bg-gold-500/10 border-gold-500/40 text-gold-400 shadow-sm shadow-gold-500/5' 
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
            title="Your daily connection streak with the Lord"
          >
            <motion.div
              animate={completedPlanToday ? {
                scale: [1, 1.25, 1],
                rotate: [0, 8, -8, 0]
              } : {}}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.5 }}
            >
              <Flame className={`h-4.5 w-4.5 ${completedPlanToday ? 'text-gold-400 fill-gold-500/20' : 'text-slate-400'}`} />
            </motion.div>
            <span className="text-xs font-mono font-bold tracking-tight">{streak}d Streak</span>
          </motion.div>

          {/* Bookmarked scriptures heart */}
          <button 
            onClick={() => setActiveTab('soul')}
            className="p-2.5 rounded-full bg-white/5 hover:bg-gold-500/10 border border-white/10 hover:border-gold-500/30 text-slate-300 hover:text-gold-400 transition-all relative"
            title="Saved Devotionals and Scripture"
          >
            <Heart className="h-4 w-4" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-celestial-900 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {bookmarksCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Embedded dynamic scriptures progression block (Exactly like top apps which highlights daily goal) */}
      <div className="mt-5 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs relative z-10 transition-all hover:bg-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-gold-500/25 to-gold-600/10 text-gold-400 border border-gold-500/20">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <div className="font-serif font-bold text-slate-200 text-sm tracking-wide">30-Day Spiritual Plan</div>
            <div className="text-slate-400 text-[10px] mt-0.5 tracking-tight">Active passage: Genesis & Psalms selection</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-gold-400 font-mono font-bold block text-[11px] tracking-wide">Day 4 of 30</span>
          <div className="w-20 bg-celestial-900 h-1.5 rounded-full overflow-hidden mt-1 border border-white/5">
            <div className="bg-gradient-to-r from-gold-500 to-gold-400 h-full w-[13.3%]" />
          </div>
        </div>
      </div>
    </header>
  );
}
