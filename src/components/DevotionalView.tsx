import React, { useState, useEffect } from 'react';
import { BookOpen, Heart, Sparkles, Trophy, Volume2, ArrowRight, Star, Quote, Play, Pause, BookmarkCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Devotional } from '../types';

interface DevotionalViewProps {
  devotional: Devotional;
  onBookmark: (devotional: Devotional) => void;
  isBookmarked: boolean;
  onCompleteReading: () => void;
  hasCompletedReading: boolean;
  setDevotional: (devotional: Devotional) => void;
}

export default function DevotionalView({
  devotional,
  onBookmark,
  isBookmarked,
  onCompleteReading,
  hasCompletedReading,
  setDevotional
}: DevotionalViewProps) {
  const [translation, setTranslation] = useState<'ESV' | 'NIV' | 'KJV'>('ESV');
  const [customTopic, setCustomTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Audio reading progress simulator
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 2.5;
        });
      }, 300);
    } else {
      setAudioProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const translationTexts: Record<'ESV' | 'NIV' | 'KJV', string> = {
    ESV: devotional.verse,
    NIV: devotional.id === "d1" 
      ? "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters."
      : devotional.id === "d2"
      ? "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint."
      : devotional.id === "d3"
      ? "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."
      : devotional.verse,
    KJV: devotional.id === "d1"
      ? "The Lord is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters."
      : devotional.id === "d2"
      ? "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."
      : devotional.id === "d3"
      ? "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus."
      : devotional.verse
  };

  const loadingQuotes = [
    "Opening ancient biblical manuscripts...",
    "Summoning theological insights & perspectives...",
    "Formulating the perfect modern devotional commentary...",
    "Sourcing calming prayers to align with your heart..."
  ];

  useEffect(() => {
    let timer: any;
    if (isGenerating) {
      timer = setInterval(() => {
        setGenerationStep((p) => (p + 1) % loadingQuotes.length);
      }, 2000);
    } else {
      setGenerationStep(0);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  const handleCustomGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/devotional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: customTopic })
      });
      if (response.ok) {
        const data = await response.json();
        setDevotional(data);
        setCustomTopic('');
      } else {
        alert("Could not build. Please try standard preloaded scripture topics!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectSuggestedTopic = (topic: string) => {
    setCustomTopic(topic);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-celestial-850 text-white rounded-3xl p-8 shadow-2xl text-center border border-gold-500/10 flex flex-col items-center justify-center min-h-[380px] relative overflow-hidden"
          >
            {/* Glowing active orbits */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gold-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl" />

            <motion.div 
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="p-5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/25 mb-6 z-10"
            >
              <Sparkles className="h-10 w-10 text-gold-400 animate-pulse" />
            </motion.div>

            <h3 className="text-xl font-serif font-bold text-slate-100 z-10 tracking-wide">Inspired Custom Creation</h3>
            
            <p className="text-slate-300 text-sm max-w-sm mt-4 leading-relaxed z-10 font-sans italic min-h-[48px] px-2 text-center">
              &ldquo;{loadingQuotes[generationStep]}&rdquo;
            </p>

            <div className="w-40 bg-celestial-900 h-1.5 rounded-full overflow-hidden mt-8 relative z-10 border border-white/5">
              <motion.div 
                animate={{ left: ["-100%", "100%"] }} 
                transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                className="bg-gradient-to-r from-transparent via-gold-400 to-transparent w-full h-full absolute"
              />
            </div>
            
            <span className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mt-4 z-10">
              Generating Theological Commentary
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="devotional-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Premium Gold Scripture Card */}
            <div className="bg-gradient-to-br from-celestial-850 to-celestial-900 rounded-3xl p-6 shadow-2xl border border-gold-500/10 relative overflow-hidden gold-glow">
              {/* Background stars details */}
              <div className="absolute top-3 right-8 opacity-20">
                <Star className="h-2 w-2 text-gold-400" />
              </div>
              <div className="absolute bottom-4 left-6 opacity-30 animate-pulse">
                <Star className="h-2.5 w-2.5 text-gold-400" />
              </div>

              <div className="flex justify-between items-center mb-5 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gold-400 bg-gold-500/10 px-3 py-1.5 rounded-xl border border-gold-500/20">
                    SCRIPTURE OF THE DAY
                  </span>
                  {devotional.isCustom && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/15">
                      AI Custom
                    </span>
                  )}
                </div>

                {/* Bookmark click */}
                <button
                  onClick={() => onBookmark(devotional)}
                  className={`p-2.5 rounded-full transition-all border ${
                    isBookmarked 
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
                      : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:bg-white/10'
                  }`}
                  title="Bookmark devotional text"
                >
                  <Heart className={`h-4.5 w-4.5 ${isBookmarked ? 'fill-rose-400' : ''}`} />
                </button>
              </div>

              {/* Translation selects */}
              <div className="flex items-center gap-1.5 mb-5 bg-celestial-950 p-1 rounded-xl w-fit border border-white/5 relative z-10">
                {(['ESV', 'NIV', 'KJV'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTranslation(t)}
                    className={`text-[10px] px-3.5 py-1.5 rounded-lg font-mono font-bold transition-all ${
                      translation === t 
                        ? 'bg-gold-500 text-celestial-900 shadow-lg font-extrabold' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Main verse blocks quotes */}
              <div className="relative mb-5 z-10">
                <Quote className="absolute -top-3.5 -left-2 h-10 w-10 text-gold-500/10 pointer-events-none" />
                <p className="text-base md:text-lg font-serif text-[#f2edd8] leading-relaxed italic relative z-10 pl-5 pt-1">
                  &ldquo;{translationTexts[translation]}&rdquo;
                </p>
              </div>

              {/* Scripture verse citation block */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t border-white/5 mt-4 relative z-10">
                <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                  {devotional.reference} ({translation})
                </span>

                {/* Simulated high-quality interactive bible audio player */}
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className={`flex items-center gap-2 text-xs font-mono font-bold px-4 py-2 rounded-xl transition-all ${
                    isPlayingAudio 
                      ? 'bg-gold-500 text-celestial-950 font-extrabold' 
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  {isPlayingAudio ? 'Listening To Verse' : 'Listen To Passage'}
                </button>
              </div>

              {/* Audio visual player bar */}
              {isPlayingAudio && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-4 bg-celestial-950/80 rounded-2xl p-3 border border-gold-500/20 text-xs text-gold-100 flex flex-col gap-2 relative z-10"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping" />
                      PEACEFUL SPIRITUAL NARRATION ACTIVE
                    </span>
                    <button onClick={() => setIsPlayingAudio(false)} className="text-[10px] font-bold underline text-gold-400 hover:text-white uppercase">
                      Stop
                    </button>
                  </div>
                  {/* Reading line progress */}
                  <div className="w-full bg-celestial-850 h-1.5 rounded-full overflow-hidden border border-white/5">
                    <div className="bg-gold-400 h-full transition-all duration-300" style={{ width: `${audioProgress}%` }} />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Reflection paper */}
            <div className="bg-gradient-to-b from-celestial-850 to-celestial-900 rounded-3xl p-6 md:p-7 shadow-xl border border-white/5 space-y-4">
              <h3 className="text-sm font-mono font-bold text-slate-400 tracking-wider flex items-center gap-2 uppercase">
                <BookOpen className="h-4 w-4 text-gold-400" />
                Biblical Context & Reflection
              </h3>

              <div className="text-slate-200 text-sm md:text-base leading-relaxed font-sans space-y-4 font-light">
                {devotional.reflection.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Dynamic guided prayer desk styling */}
            <div className="bg-gradient-to-br from-celestial-850 to-celestial-900 rounded-3xl p-6 border border-gold-500/10 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <span className="text-[10px] text-gold-400 font-mono font-bold tracking-widest uppercase mb-2 block">
                ✙ DEVTIONAL GUIDED PRAYER
              </span>
              
              <p className="text-slate-100 font-serif leading-relaxed text-sm md:text-base italic pl-4 border-l-2 border-gold-500">
                &ldquo;{devotional.prayerPrompt}&rdquo;
              </p>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-celestial-950/70 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2.5">
                  <Trophy className={`h-5 w-5 ${hasCompletedReading ? 'text-gold-400 fill-gold-500/10' : 'text-slate-500'}`} />
                  <span className="text-xs font-semibold text-slate-300">
                    {hasCompletedReading ? 'Today’s prayer goal completed!' : 'Seal today’s devotional word'}
                  </span>
                </div>
                
                <button
                  onClick={onCompleteReading}
                  disabled={hasCompletedReading}
                  className={`text-xs px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${
                    hasCompletedReading 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-gold-500 hover:bg-gold-600 text-celestial-950 font-extrabold cursor-pointer hover:shadow-gold-500/10'
                  }`}
                >
                  {hasCompletedReading ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 text-emerald-300" /> Completed Today
                    </>
                  ) : (
                    <>Amen, Conclude Devotional</>
                  )}
                </button>
              </div>
            </div>

            {/* Custom generation panel layout */}
            <div className="bg-gradient-to-b from-celestial-850 to-celestial-900 rounded-3xl p-6 border border-white/5 shadow-xl">
              <div className="flex items-center gap-2 text-slate-200 mb-2">
                <Sparkles className="h-4 w-4 text-gold-400" />
                <h4 className="text-sm font-bold font-serif uppercase tracking-wider">Search Custom Scriptural Advice</h4>
              </div>
              <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                Type any faith concern, a Bible chapter, or mood (e.g., *&ldquo;trusting God through divorce&rdquo;*, *&ldquo;grief support&rdquo;*, *&ldquo;Colossians study notes&rdquo;*). Our central intelligence will parse coordinates to compile a custom devotional text.
              </p>

              <form onSubmit={handleCustomGenerate} className="flex gap-2">
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Ask for custom scripture guidance (e.g. Overcoming anxiety)"
                  className="bg-celestial-950 px-4 py-3 rounded-xl border border-white/5 text-xs flex-1 outline-none text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-gold-500 font-sans transition-all"
                />
                <button 
                  type="submit"
                  disabled={!customTopic.trim() || isGenerating}
                  className="px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-celestial-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg disabled:opacity-40 transition-all"
                >
                  Create <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>

              {/* Suggestions list */}
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-[9px] text-slate-400 uppercase font-mono font-bold tracking-widest mr-1">SUGGESTIONS:</span>
                {['Managing Worry', 'Spiritual Forgiveness', 'Courage in Trials', 'Patience with Family'].map((seed) => (
                  <button
                    key={seed}
                    onClick={() => selectSuggestedTopic(seed)}
                    className="text-[10px] font-sans font-medium text-slate-300 bg-celestial-950 hover:bg-gold-500/10 border border-white/5 hover:border-gold-500/30 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer"
                  >
                    {seed}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
