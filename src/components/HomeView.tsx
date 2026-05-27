import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Flame, 
  Bell, 
  Search, 
  Mic, 
  BookOpen, 
  Users, 
  Heart, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ArrowRight, 
  ShieldAlert, 
  UserCheck, 
  Clock, 
  Star 
} from 'lucide-react';
import { Devotional, ReadingPlan, Prayer } from '../types';

interface HomeViewProps {
  userName: string;
  streak: number;
  completedPlanToday: boolean;
  devotional: Devotional;
  readingPlans: ReadingPlan[];
  prayers: Prayer[];
  isPremium: boolean;
  onNavigate: (tabId: string) => void;
  onTogglePlan: (planId: string) => void;
  onTriggerPremiumPaywall: () => void;
  onSetExternalChatQuery: (query: string) => void;
}

export default function HomeView({
  userName,
  streak,
  completedPlanToday,
  devotional,
  readingPlans,
  prayers,
  isPremium,
  onNavigate,
  onTogglePlan,
  onTriggerPremiumPaywall,
  onSetExternalChatQuery
}: HomeViewProps) {
  const [searchInput, setSearchInput] = useState('');
  const [currentAudioPlayId, setCurrentAudioPlayId] = useState<string | null>(null);

  // Dynamic time-based greeting for premium feel
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const greetingMessage = `${getGreeting()}, ${userName}`;

  // Premium Spotify/Hallow style Audio Meditations Library
  const audioMeditations = [
    { id: 'm1', title: 'Whispering Sanctuary Sleep Prayer', tutor: 'Abbot Julian', duration: '12 min', category: 'Sleep' },
    { id: 'm2', title: 'Hushing Cognitive Storms', tutor: 'Sarah Jenkins', duration: '8 min', category: 'Anxiety' },
    { id: 'm3', title: 'Morning Focus: Genesis Creation Liturgy', tutor: 'Rev. Sterling', duration: '5 min', category: 'Faith' },
    { id: 'm4', title: 'Silent Tears Divine Comfort', tutor: 'Sister Maria', duration: '15 min', category: 'Healing' }
  ];

  const suggestedPrompts = [
    { text: "Explain Romans 8:28", icon: "📖" },
    { text: "Comfort for anxiety", icon: "🕊️" },
    { text: "Verses about healing", icon: "❤️" },
    { text: "Help me sleep peacefully", icon: "🌙" },
    { text: "Daily encouragement", icon: "✨" }
  ];

  const handleAudioToggle = (mId: string) => {
    if (currentAudioPlayId === mId) {
      setCurrentAudioPlayId(null);
    } else {
      setCurrentAudioPlayId(mId);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSetExternalChatQuery(searchInput.trim());
      onNavigate('companion');
    }
  };

  const handlePromptClick = (text: string) => {
    onSetExternalChatQuery(text);
    onNavigate('companion');
  };

  const completedCount = readingPlans.filter(p => p.completed).length;

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      
      {/* 1. Header Greetings Segment */}
      <div className="flex justify-between items-start animate-fade-in">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 font-bold flex items-center gap-1 leading-none">
            ✙ STEADFAST COMPANION
          </span>
          <h2 className="text-2xl font-serif font-bold text-slate-100 mt-2.5 tracking-wide leading-tight">
            {greetingMessage}
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
            &ldquo;Thy word is a lamp unto my feet, and a light unto my path.&rdquo; <span className="font-bold underline text-gold-400/80">Ps 119:105</span>
          </p>
        </div>

        {/* Premium Upgrade Actions + Notification controls */}
        <div className="flex items-center gap-2">
          {!isPremium ? (
            <button
              onClick={onTriggerPremiumPaywall}
              className="bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-celestial-950 text-[10px] font-mono font-extrabold px-3 py-2 rounded-xl flex items-center gap-1 shadow-lg shadow-gold-500/10 cursor-pointer animate-pulse"
            >
              <Star className="h-3 w-3 fill-celestial-950" />
              UPGRADE
            </button>
          ) : (
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> MAX MEMBER
            </span>
          )}

          {/* Simple dummy alerts bell */}
          <button 
            onClick={() => alert("Alert schedule aligns perfectly! Enjoy premium scriptural inputs.")}
            className="p-2.5 rounded-xl bg-celestial-950 border border-white/5 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
            title="Read Daily Bread Alerts"
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Hero Devotional Card With Glow */}
      <div className="bg-gradient-to-br from-celestial-850 to-celestial-950 p-6 rounded-3xl border border-gold-500/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-[-50px] right-[-55px] w-48 h-48 bg-gold-400/15 rounded-full blur-3xl pointer-events-none" />
        
        <span className="text-[9.5px] font-mono uppercase text-gold-400 font-bold bg-gold-400/10 px-2.5 py-1 rounded-lg border border-gold-500/20 tracking-wider">
          🌞 TODAY'S DAILY BREAD
        </span>

        <h3 className="text-[#eedfbc] font-serif font-bold text-base md:text-lg mt-4.5 leading-relaxed italic">
          &ldquo;{devotional.verse}&rdquo;
        </h3>
        
        <span className="font-serif font-bold text-xs text-gold-400/90 block mt-2 text-right">
          — {devotional.reference}
        </span>

        <p className="text-slate-300 text-xs md:text-sm mt-3.5 leading-relaxed line-clamp-2">
          {devotional.reflection}
        </p>

        <div className="pt-5 border-t border-white/5 flex justify-between items-center mt-4">
          <div className="flex items-center gap-1.5 text-xs text-[#eedfbc]">
            <Clock className="h-4 w-4 text-gold-400" />
            <span>5 Min Study Reflection</span>
          </div>

          <button
            onClick={() => onNavigate('devotional')}
            className="bg-gold-500 hover:bg-gold-600 text-celestial-950 text-xs font-bold font-mono px-4 py-2.5 rounded-xl border border-gold-500 transition-all cursor-pointer flex items-center gap-1"
          >
            Continue Reading <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Central AI Chat Shortcut with suggested quick tags */}
      <div className="bg-celestial-850 p-5 rounded-3xl border border-white/5 shadow-2xl relative space-y-4">
        <div>
          <span className="text-indigo-400 text-[9px] font-mono font-bold tracking-wider uppercase block">
            ⚡ THEOLOGICAL COUNSEL ACCESS
          </span>
          <h4 className="text-sm font-serif font-bold text-slate-200 mt-1 flex items-center gap-1.5">
            Discuss Anything with Scripture AI
          </h4>
        </div>

        {/* Large Centered Form Input fields */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Ask: 'Help me sleep...' or 'Anxiety prayers...'"
            className="w-full bg-celestial-900 border border-white/5 focus:border-gold-500/30 pl-4 pr-12 py-3.5 rounded-2xl text-xs outline-none text-slate-100 placeholder-slate-600 focus:bg-[#07080d] transition-all"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-3.5 transform -translate-y-1/2 text-gold-400 hover:text-gold-300 transition-all cursor-pointer"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
        </form>

        {/* Suggested Quick Prompt list */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(p.text)}
              className="px-3.5 py-2 hover:bg-gold-500/10 hover:text-gold-400 bg-celestial-900 border border-white/5 hover:border-gold-500/35 text-[11px] font-sans font-bold text-slate-400 rounded-xl transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
            >
              <span>{p.icon}</span>
              <span>{p.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Reading passages timeline + Meditations carousels splitter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: Act of faith pass tracking list */}
        <div className="bg-celestial-850 rounded-3xl p-5 border border-white/5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h5 className="text-xs font-serif font-bold text-slate-100 uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-gold-400" />
                Scripture Plans
              </h5>
              <span className="text-[10px] font-mono font-bold text-gold-400 bg-gold-400/10 px-2.5 py-1 rounded-lg">
                {completedCount}/{readingPlans.length} Chapters
              </span>
            </div>

            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {readingPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => onTogglePlan(plan.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    plan.completed
                      ? 'bg-gold-500/5 border-gold-500/10 text-slate-500'
                      : 'bg-[#0f111a] border-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`w-1.5 h-1.5 rounded-full ${plan.completed ? 'bg-slate-700' : 'bg-gold-500 animate-pulse'}`} />
                    <span className={`text-[11.5px] font-bold truncate ${plan.completed ? 'line-through' : ''}`}>
                      {plan.targetChapter}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono italic truncate">{plan.title}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('soul')}
            className="w-full text-center text-slate-400 hover:text-gold-400 font-mono text-[10px] uppercase font-bold tracking-widest pt-4 mt-2.5 border-t border-white/5 flex items-center justify-center gap-1"
          >
            Review Achievements metrics <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {/* Right Side: Calm/Hallow Audio meditations */}
        <div className="bg-celestial-850 rounded-3xl p-5 border border-white/5 shadow-2xl flex flex-col justify-between">
          <div>
            <h5 className="text-xs font-serif font-bold text-slate-100 uppercase tracking-widest flex items-center gap-1.5 mb-3.5">
              <Volume2 className="h-4 w-4 text-gold-400" />
              Spiritual Ambient Room
            </h5>

            <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
              {audioMeditations.map((a) => {
                const isPlaying = currentAudioPlayId === a.id;
                return (
                  <div 
                    key={a.id} 
                    className="p-3 bg-[#0f111a] border border-white/5 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold font-mono text-gold-400 uppercase tracking-wide bg-gold-400/5 px-2 py-0.5 rounded border border-gold-500/10">
                          {a.category}
                        </span>
                        <span className="text-[9.5px] text-slate-500 font-mono">{a.duration}</span>
                      </div>
                      <span className="text-[11.5px] font-serif font-bold text-slate-200 mt-1 block truncate">
                        {a.title}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAudioToggle(a.id)}
                      className={`p-2.5 rounded-full border transition-all cursor-pointer flex-shrink-0 ${
                        isPlaying
                          ? 'bg-gold-500 border-gold-400 text-celestial-950 shadow-md shadow-gold-500/10'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="h-3 w-3 stroke-[3]" />
                      ) : (
                        <Play className="h-3 w-3 stroke-[3]" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          
          {currentAudioPlayId && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gold-500/10 border border-gold-500/20 rounded-xl p-2.5 text-center text-[10.5px] text-[#eedfbc] mt-3 font-serif flex items-center justify-center gap-2 animate-pulse"
            >
              <Volume2 className="h-4.5 w-4.5 text-gold-400" />
              <span>Playing: {audioMeditations.find(a => a.id === currentAudioPlayId)?.title}</span>
            </motion.div>
          )}
        </div>

      </div>

      {/* 5. Brethren active prayers & Selah logs highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Live Brethren Board Preview */}
        <div className="bg-celestial-850 rounded-2xl p-4 border border-white/5 text-left flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-widest block mb-2">LIVE BRETHREN BOARD</span>
            {prayers.length > 0 ? (
              <div className="space-y-1.5 p-3 rounded-xl bg-celestial-900 border border-white/5">
                <span className="text-[10px] font-serif font-bold text-gold-400">{prayers[0].author}</span>
                <p className="text-[11px] text-slate-300 italic line-clamp-2 mt-0.5">&ldquo;{prayers[0].text}&rdquo;</p>
              </div>
            ) : (
              <p className="text-[10px] text-slate-500 p-2 text-center bg-celestial-900 border border-dashed border-white/10 rounded-xl leading-relaxed">No prayer wall active</p>
            )}
          </div>
          <button
            onClick={() => onNavigate('prayer_wall')}
            className="text-[10px] font-mono uppercase font-bold text-gold-400 flex items-center gap-1 hover:underline text-left mt-3.5"
          >
            Go to Brethren Wall <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Dynamic faith streak metrics checklist */}
        <div className="bg-celestial-850 rounded-2xl p-4 border border-white/5 text-left flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-1 right-1 opacity-10"><Star className="h-10 w-10 text-gold-400" /></div>
          <div>
            <span className="text-[9px] font-mono text-slate-505 uppercase font-bold tracking-widest block mb-2">FAITH METRICS HABITS</span>
            <div className="flex gap-3.5 items-center">
              <div className="p-3 rounded-xl bg-gold-400/10 text-gold-400 border border-gold-500/20 animate-pulse">
                <Flame className="h-5 w-5 fill-gold-500/10" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">Current Streak of {streak} Days</span>
                <span className="text-[10.5px] text-slate-400 leading-normal block">
                  {completedPlanToday 
                    ? "Habits complete for the day. Steady!" 
                    : "Devotional study required to lock daily milestone"
                  }
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => onNavigate('journal')}
            className="text-[10px] font-mono uppercase font-bold text-gold-400 flex items-center gap-1 hover:underline text-left mt-3.5"
          >
            Access Selah Diary <ArrowRight className="h-3 w-3" />
          </button>
        </div>

      </div>

    </div>
  );
}
