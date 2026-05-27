import React from 'react';
import { Award, Flame, Heart, BookOpen, Quote, ChevronRight, CheckCircle2, Bookmark, FlameKindling, Info, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Devotional, ReadingPlan } from '../types';

interface SoulDashboardProps {
  streak: number;
  completedPlanToday: boolean;
  bookmarkedDevotionals: Devotional[];
  readingPlans: ReadingPlan[];
  onTogglePlan: (planId: string) => void;
  onRemoveBookmark: (devotional: Devotional) => void;
  onSelectBookmarkedDevotional: (devotional: Devotional) => void;
}

export default function SoulDashboard({
  streak,
  completedPlanToday,
  bookmarkedDevotionals,
  readingPlans,
  onTogglePlan,
  onRemoveBookmark,
  onSelectBookmarkedDevotional
}: SoulDashboardProps) {

  const totalPlans = readingPlans.length;
  const completedPlans = readingPlans.filter(p => p.completed).length;
  const progressPercent = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0;

  // Encouraging Bible verse quotes based on streak milestones
  const getEncouragingQuote = () => {
    if (streak <= 1) {
      return {
        text: "The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.",
        ref: "Lamentations 3:22-23"
      };
    }
    if (streak <= 5) {
      return {
        text: "He gives power to the faint, and to him who has no might he increases strength.",
        ref: "Isaiah 40:29"
      };
    }
    return {
      text: "Commit your work to the Lord, and your plans will be established.",
      ref: "Proverbs 16:3"
    };
  };

  const spiritualAffirmation = getEncouragingQuote();

  return (
    <div className="space-y-6 select-none">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
        
        {/* Left Card Pane: Streak + Affirmation (5 cols) */}
        <div className="md:col-span-12 lg:col-span-5 space-y-6">
          
          {/* Main Habit/Streak circle panel */}
          <div className="bg-gradient-to-br from-celestial-850 to-celestial-900 text-white rounded-3xl p-6 shadow-2xl border border-gold-500/10 text-center flex flex-col items-center justify-between min-h-[300px] relative overflow-hidden">
            <div className="absolute top-[5%] left-[5%] opacity-20"><Star className="h-3 w-3 text-gold-400" /></div>
            
            <div className="relative z-10">
              <span className="text-[10px] font-mono text-gold-400 font-bold uppercase tracking-widest block mb-2">My Faith Streak</span>
              <h4 className="text-lg font-serif font-bold text-slate-100 tracking-wide">Consecutive Praying Days</h4>
            </div>

            {/* Simulated interactive active ring */}
            <div className="my-5 relative flex items-center justify-center z-10">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  className="stroke-celestial-950 fill-none"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="52"
                  className="stroke-gold-500 fill-none"
                  strokeWidth="8"
                  strokeDasharray="326.7" // 2 * pi * 52
                  initial={{ strokeDashoffset: 326.7 }}
                  animate={{ strokeDashoffset: 326.7 - (326.7 * (completedPlanToday ? 1 : 0.7)) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <motion.div
                  animate={completedPlanToday ? { scale: [1, 1.25, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                >
                  <Flame className={`h-8 w-8 ${completedPlanToday ? 'text-gold-400 fill-gold-500/20' : 'text-slate-500'}`} />
                </motion.div>
                <span className="text-xl font-mono font-extrabold text-gold-400 tracking-tight mt-1">{streak} Days</span>
              </div>
            </div>

            <div className="w-full relative z-10 pt-2">
              <p className="text-xs text-slate-300 px-2 leading-relaxed font-sans">
                {completedPlanToday 
                  ? "Praise God! You have finished today’s readings and answered your journal prompt. Speak up in the Prayer Wall for more encouragement." 
                  : "Today’s devotional is waiting. Open the daily bread tab to meditate on the Word and commit a personal prayer entry to maintain your streak."
                }
              </p>
            </div>
          </div>

          {/* Inspirational verse widget */}
          <div className="bg-gradient-to-br from-celestial-850 to-celestial-900 border border-gold-500/10 text-[#eedfbc] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-2 right-4">
              <Quote className="h-10 w-10 text-gold-500/10 pointer-events-none" />
            </div>
            <span className="text-[9px] font-mono font-bold text-gold-400 uppercase tracking-widest block">Scripture Encouragement</span>
            <p className="text-slate-200 text-xs md:text-sm font-serif leading-relaxed italic mt-3 font-medium">
              &ldquo;{spiritualAffirmation.text}&rdquo;
            </p>
            <span className="font-serif font-bold text-[11px] text-gold-400 block mt-3 text-right">
              — {spiritualAffirmation.ref}
            </span>
          </div>

        </div>

        {/* Right Card Pane: Plan Progress + Bookmarked List (7 cols) */}
        <div className="md:col-span-12 lg:col-span-7 space-y-6">
          
          {/* Active Reading Plan Progress Checkboxes */}
          <div className="bg-celestial-850 rounded-3xl p-6 shadow-2xl border border-white/5">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h4 className="text-sm font-bold font-serif text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
                  <BookOpen className="h-4.5 w-4.5 text-gold-400" />
                  Acts of Faith Reading Plan
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">Toggle completed scripture passages of the day.</p>
              </div>
              <span className="text-[11px] font-mono font-extrabold text-gold-400 bg-gold-400/10 px-3 py-1.5 rounded-xl border border-gold-500/20">
                {progressPercent}% Complete
              </span>
            </div>

            {/* Reading list tracker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {readingPlans.map((plan) => (
                <div 
                  key={plan.id}
                  onClick={() => onTogglePlan(plan.id)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    plan.completed 
                      ? 'bg-gold-500/5 border-gold-500/20 text-slate-400' 
                      : 'bg-celestial-900 border-white/5 hover:border-gold-500/30 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${plan.completed ? 'text-gold-400 fill-gold-500/10' : 'text-slate-600'}`} />
                    <div className="text-left min-w-0 pr-2">
                      <span className={`text-xs font-bold block truncate ${plan.completed ? 'line-through text-slate-500 font-normal' : ''}`}>
                        {plan.targetChapter}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-serif truncate">{plan.title}</span>
                    </div>
                  </div>
                  
                  {plan.completed && (
                    <span className="text-[8px] font-mono text-gold-400 bg-gold-500/10 font-bold px-1.5 py-0.5 rounded border border-gold-500/20 flex-shrink-0">
                      Done
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Saved bookmarks library list */}
          <div className="bg-celestial-850 rounded-3xl p-6 shadow-2xl border border-white/5 flex-1 flex flex-col h-[320px]">
            <h4 className="text-sm font-bold font-serif text-slate-200 flex items-center gap-1.5 mb-4 uppercase tracking-wide">
              <Heart className="h-4.5 w-4.5 text-rose-450 fill-rose-500/10" />
              Bookmarked Scriptures ({bookmarkedDevotionals.length})
            </h4>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 selection:bg-gold-500/20">
              {bookmarkedDevotionals.length === 0 ? (
                <div className="h-[95%] flex flex-col items-center justify-center text-center p-6 bg-celestial-900 rounded-2xl border border-dashed border-white/10">
                  <div className="p-3 bg-celestial-850 border border-white/5 rounded-full text-gold-400 mb-2">
                    <Heart className="h-5 w-5 text-gold-400/60" />
                  </div>
                  <h6 className="text-xs font-bold text-slate-300">No bookmarked scriptures yet</h6>
                  <p className="text-[10px] text-slate-400 mt-2 max-w-sm leading-relaxed">
                    Keep track of scriptures that spark a dynamic change in you! Click the heart icon on any daily devotional card to bookmark it here.
                  </p>
                </div>
              ) : (
                bookmarkedDevotionals.map((book) => (
                  <div 
                    key={book.id}
                    className="p-3 bg-celestial-900 hover:bg-celestial-800 rounded-xl border border-white/5 hover:border-gold-500/15 transition-all flex items-center justify-between gap-4 group"
                  >
                    <div 
                      onClick={() => onSelectBookmarkedDevotional(book)}
                      className="text-left flex-1 cursor-pointer min-w-0"
                    >
                      <span className="text-[11px] font-serif font-bold text-slate-200 group-hover:text-gold-400 block truncate">
                        {book.reference}
                      </span>
                      <p className="text-[10px] text-slate-400 truncate font-serif mt-0.5">
                        {book.verse}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRemoveBookmark(book)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1.5 text-[10px] font-mono font-bold uppercase"
                        title="Remove Bookmark"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
