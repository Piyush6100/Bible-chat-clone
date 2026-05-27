import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Sparkles, Heart, Activity, User, Bookmark, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: (selections: {
    userName: string;
    focusAreas: string[];
    reminderTime: string;
  }) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState('08:00 AM');

  const focusOptions = [
    { id: 'anxiety', label: 'Overcoming Anxiety', icon: Heart, desc: 'Find peaceful, calming scriptural support in moments of distress' },
    { id: 'sleep', label: 'Sleeping Peacefully', icon: Compass, desc: 'Quiet your mind with nocturnal devotionals & audio liturgies' },
    { id: 'faith', label: 'Spiritual Growth', icon: Sparkles, desc: 'Read theological summaries & develop daily prayer habits' },
    { id: 'healing', label: 'Emotional Healing', icon: Activity, desc: 'Support for grief, heartache, and difficult life transitions' },
    { id: 'wisdom', label: 'Daily Wisdom', icon: Bookmark, desc: 'Unpack cultural context of biblical passages each morning' }
  ];

  const handleToggleFocus = (id: string) => {
    if (selectedFocus.includes(id)) {
      setSelectedFocus(selectedFocus.filter(item => item !== id));
    } else {
      setSelectedFocus([...selectedFocus, id]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !userName.trim()) {
      setUserName('John'); // fallback default
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        userName: userName.trim() || 'John',
        focusAreas: selectedFocus,
        reminderTime
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-celestial-950 flex flex-col justify-between p-6 z-50 overflow-y-auto">
      {/* Premium ambient light blobbies */}
      <div className="absolute top-[10%] left-[20%] w-60 h-60 bg-gold-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[20%] right-[10%] w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl" />

      {/* Top watermark progress */}
      <div className="relative z-10 w-full flex justify-between items-center py-4">
        <div className="flex items-center gap-1.5 font-serif text-sm font-bold tracking-widest text-[#eedfbc]">
          ✙ FAITHFLOW
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1 rounded-full transition-all duration-300 ${
                s === step ? 'w-6 bg-gold-500' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Core animation pages */}
      <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full relative z-10 my-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-gold-400 font-bold uppercase block">
                  CINEMATIC PROLOGUE
                </span>
                <h1 className="text-3xl font-serif font-bold text-slate-100 tracking-wide leading-tight">
                  Welcome your personal scripture guide.
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed">
                  FaithFlow acts as a wise, silent space designed to align your mind, lower fatigue, and sheperd your goals with custom theology. Let's begin with your name.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  How should we address your soul?
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full bg-celestial-900 border border-white/5 focus:border-gold-500/40 px-5 py-4 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-gold-500/30 transition-all font-sans text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNext();
                  }}
                />
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-slate-500 text-[11px]">
                <ShieldCheck className="h-4 w-4 text-gold-400/40" />
                Your private thoughts represent an intimate conversation with your Creator. We never sell your data.
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-gold-400 font-bold uppercase block">
                  PERSONALIZED FAITH
                </span>
                <h2 className="text-3xl font-serif font-bold text-slate-100 tracking-wide leading-tight">
                  What challenges are resting on your heart?
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Select any area. We will tailor your daily bread devotionals and AI prompt shortcuts accordingly.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {focusOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedFocus.includes(option.id);
                  return (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      key={option.id}
                      onClick={() => handleToggleFocus(option.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                        isSelected 
                          ? 'bg-gold-500/10 border-gold-500 text-slate-100 shadow-md shadow-gold-500/5' 
                          : 'bg-celestial-900 border-white/5 text-slate-400 hover:border-gold-500/20'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl border ${
                        isSelected 
                          ? 'bg-gold-500 text-celestial-950 border-gold-400' 
                          : 'bg-celestial-850 border-white/5 text-slate-400'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <span className={`text-xs font-bold block ${isSelected ? 'text-gold-400' : 'text-slate-200'}`}>
                          {option.label}
                        </span>
                        <span className="text-[10.5px] text-slate-400 leading-tight mt-0.5 block font-sans">
                          {option.desc}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="ml-auto p-1 bg-gold-500 rounded-full text-celestial-950 flex-shrink-0">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-gold-400 font-bold uppercase block">
                  DAILY LITURGY
                </span>
                <h2 className="text-3xl font-serif font-bold text-slate-100 tracking-wide leading-tight">
                  Designate a quiet moment with the Word.
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Establish consistency. We recommend choosing an early morning hour to formulate a spiritual anchor before your daily activities.
                </p>
              </div>

              <div className="bg-celestial-900 rounded-3xl p-6 border border-white/5 text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-serif text-[#eedfbc] tracking-widest font-bold">
                    {reminderTime}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {['06:00 AM', '08:00 AM', '12:00 PM', '06:00 PM', '09:00 PM', '10:30 PM'].map((time) => (
                    <button
                      key={time}
                      onClick={() => setReminderTime(time)}
                      className={`py-2 px-1 text-[11px] rounded-xl border transition-all font-mono font-bold ${
                        reminderTime === time
                          ? 'bg-gold-500 text-celestial-950 border-gold-500 font-extrabold'
                          : 'bg-celestial-850 hover:bg-celestial-800 text-slate-400 border-white/5'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>

                <p className="text-[10.5px] text-slate-400 font-sans italic pt-2">
                  You can modify daily bread alerts and schedule toggles anytime inside settings.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Button footer Navigation */}
      <div className="relative z-10 w-full max-w-lg mx-auto pb-4">
        <button
          onClick={handleNext}
          className="w-full bg-gold-500 hover:bg-gold-600 font-extrabold text-celestial-950 py-4.5 rounded-2xl flex items-center justify-center gap-1 text-[13px] tracking-wide transition-all shadow-lg hover:shadow-gold-500/10 cursor-pointer"
        >
          {step === 3 ? 'Reveal My Devotional Path' : 'Continue'} 
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
