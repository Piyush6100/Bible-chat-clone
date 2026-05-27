import React, { useState, useEffect } from 'react';
import { PenTool, Library, Trash2, ArrowRight, Sparkles, Smile, Frown, Coffee, Compass, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JournalEntry } from '../types';

interface PrayerJournalProps {
  onJournalComplete: () => void;
}

export default function PrayerJournal({ onJournalComplete }: PrayerJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeMood, setActiveMood] = useState('peaceful');
  const [promptText, setPromptText] = useState('Spend 5 minutes describing where you saw God’s light shining today, and write a humble prayer.');
  const [isPromptLoading, setIsPromptLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Load old entries on component mount
  useEffect(() => {
    const saved = localStorage.getItem('daily_bread_journal');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const fetchPrompt = async (mood: string) => {
    setIsPromptLoading(true);
    setActiveMood(mood);
    try {
      const response = await fetch(`/api/prayer-prompt?mood=${mood}`);
      if (response.ok) {
        const data = await response.json();
        setPromptText(data.prompt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPromptLoading(false);
    }
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      title: title.trim() || `Reflecting on my ${activeMood} heart`,
      content: content.trim(),
      promptText: promptText,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('daily_bread_journal', JSON.stringify(updated));

    // Reset Form
    setTitle('');
    setContent('');
    
    // Complete prayer event triggers streak check!
    onJournalComplete();
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Delete this intimate journal entry?")) {
      const filtered = entries.filter(e => e.id !== id);
      setEntries(filtered);
      localStorage.setItem('daily_bread_journal', JSON.stringify(filtered));
    }
  };

  const moods = [
    { id: 'peaceful', label: 'Peaceful', icon: Smile, color: 'hover:bg-gold-500/10 hover:text-gold-400 hover:border-gold-500/30' },
    { id: 'anxious', label: 'Anxious', icon: Frown, color: 'hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30' },
    { id: 'tired', label: 'Weary', icon: Coffee, color: 'hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30' },
    { id: 'confused', label: 'Confused', icon: Compass, color: 'hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Create Entry Column (7 columns) */}
        <div className="lg:col-span-7 bg-celestial-850 rounded-3xl p-6 shadow-2xl border border-white/5 space-y-5">
          <div>
            <span className="text-gold-400 text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1.5 bg-gold-400/10 rounded-xl border border-gold-500/20">
              ⚡ SELAH - SPIRITUAL DIARY
            </span>
            <h3 className="text-xl font-serif font-bold text-slate-100 mt-3 flex items-center gap-2">
              <PenTool className="h-5 w-5 text-gold-400" />
              Write Your Heart Out
            </h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Select your current spiritual state of mind. We will frame a scriptural query prompt to guide your pen.
            </p>
          </div>

          {/* Mood Selectors widget */}
          <div className="flex flex-wrap gap-2 pt-1">
            {moods.map((m) => {
              const Icon = m.icon;
              const isSelected = activeMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => fetchPrompt(m.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border text-xs font-bold cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-gold-500 text-celestial-950 border-gold-500 font-extrabold shadow-lg shadow-gold-500/15' 
                      : `bg-celestial-900 text-slate-400 border-white/5 ${m.color}`
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Prompt banner display */}
          <div className="bg-celestial-900 rounded-2xl p-4.5 border border-gold-500/10 relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Sparkles className="h-4 w-4 text-gold-400/30 animate-pulse" />
            </div>
            
            <span className="text-[9px] font-mono font-bold uppercase text-gold-400 tracking-widest block mb-1">GUIDED DEVOTIONAL REFLECTION</span>
            
            <AnimatePresence mode="wait">
              {isPromptLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-10 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-ping" />
                  <span className="text-xs text-slate-400 italic">Asking biblical advisor for a customized reflection entry...</span>
                </motion.div>
              ) : (
                <motion.p
                  key="text"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#eedfbc] text-xs md:text-sm font-serif leading-relaxed italic"
                >
                  &ldquo;{promptText}&rdquo;
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveEntry} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1.5 tracking-wider">Entry Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your heart session a short name..."
                className="w-full bg-celestial-900 border border-white/5 px-4 py-3 rounded-xl text-xs outline-none focus:ring-1 focus:ring-gold-500 text-slate-200 placeholder-slate-600 focus:bg-celestial-950 transition-all font-sans"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1.5 tracking-wider">Your Conversation with God</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={5}
                placeholder="Lord, today I approach You with..."
                className="w-full bg-celestial-900 border border-white/5 px-4 py-3.5 rounded-xl text-xs outline-none focus:ring-1 focus:ring-gold-500 text-slate-200 placeholder-slate-600 focus:bg-celestial-950 transition-all font-serif leading-relaxed resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!content.trim()}
              className="w-full bg-gold-500 hover:bg-gold-600 font-extrabold shadow-md shadow-gold-500/10 hover:shadow-gold-500/20 text-celestial-950 py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45 transition-all"
            >
              Commit Diary Entry & Burnish Streak <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Right Side: Log of Saved Entries (5 columns) */}
        <div className="lg:col-span-5 bg-celestial-850 rounded-3xl p-6 shadow-2xl border border-white/5 flex flex-col h-[540px]">
          <div className="mb-4 flex justify-between items-center">
            <h4 className="text-sm font-bold font-serif text-slate-200 flex items-center gap-1.5">
              <Library className="h-4 w-4 text-gold-400" />
              Journal Archives ({entries.length})
            </h4>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 selection:bg-gold-500/20">
            {entries.length === 0 ? (
              <div className="h-[95%] flex flex-col items-center justify-center text-center p-6 bg-celestial-900 rounded-2xl border border-dashed border-white/10">
                <div className="p-3 bg-celestial-850 rounded-xl text-gold-400 mb-3 border border-white/5">
                  <Library className="h-6 w-6" />
                </div>
                <h5 className="text-xs font-bold text-slate-300">Your journal is currently empty</h5>
                <p className="text-[10px] text-slate-400 mt-2 max-w-xs leading-relaxed">
                  Prayers and reflections are treasured keys of spiritual growth. Complete your first journal card on the left to start logging.
                </p>
              </div>
            ) : (
              entries.map((ent) => (
                <div key={ent.id} className="bg-celestial-900 hover:bg-celestial-800 rounded-2xl p-4 border border-white/5 hover:border-gold-500/20 transition-all space-y-2.5 group relative">
                  
                  {/* Delete button (displays on hover) */}
                  <button 
                    onClick={() => handleDeleteEntry(ent.id)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-celestial-950 rounded-lg border border-white/5"
                    title="Delete Entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono text-gold-400 font-bold block bg-gold-400/10 px-2 py-0.5 rounded-md">{ent.date}</span>
                  </div>

                  <h5 className="font-serif font-bold text-slate-100 text-sm leading-tight pr-5">{ent.title}</h5>
                  
                  {/* Small Prompt footnote */}
                  <div className="bg-celestial-950 px-2.5 py-1.5 rounded-xl border border-white/5 text-[10px] text-slate-400 italic">
                    Prompt was: &ldquo;{ent.promptText.substring(0, 75)}...&rdquo;
                  </div>

                  <p className="text-slate-200 font-serif text-xs leading-relaxed whitespace-pre-wrap mt-2">{ent.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
