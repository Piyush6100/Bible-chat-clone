import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShieldCheck, CheckCircle2, X, Flame, Bot, BookOpen, Volume2, Sparkles, Check } from 'lucide-react';

interface SubscriptionPaywallProps {
  onClose: () => void;
  onUpgradeComplete: () => void;
}

export default function SubscriptionPaywall({ onClose, onUpgradeComplete }: SubscriptionPaywallProps) {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const plans = {
    annual: { price: '$4.99/mo', billing: 'Billed annually ($59.99/yr) after 7-Day Free Trial', save: 'Save 58%' },
    monthly: { price: '$11.99/mo', billing: 'Billed monthly. Cancel anytime.', save: 'Standard tier' }
  };

  const handleUpgrade = () => {
    setIsUpgrading(true);
    // Simulate transaction delay
    setTimeout(() => {
      setIsUpgrading(false);
      onUpgradeComplete();
    }, 1500);
  };

  const premiumFeatures = [
    { text: "Unlimited AI Theological Counsels", desc: "No word limits, fully cited scripture guides" },
    { text: "Immersive Audio Meditations Room", desc: "Soothing audio narrations & sleep prayers" },
    { text: "Tailored Daily Devotional Topic Engines", desc: "Generate devotionals on any personal struggle instantly" },
    { text: "Exclusive Spiritual Growth Metrics", desc: "Deep study analyses, calendar tools & streak freeze protection" },
    { text: "Full Offline Reading Capabilities", desc: "Access standard reading plan books without internet" }
  ];

  return (
    <div className="fixed inset-0 bg-celestial-950/98 backdrop-blur-xl flex flex-col justify-between p-6 z-55 overflow-y-auto">
      {/* Decorative celestial background */}
      <div className="absolute top-[5%] right-[10%] w-72 h-72 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Top action header */}
      <div className="relative z-10 w-full flex justify-between items-center py-2">
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-100 border border-white/5 transition-all"
        >
          <X className="h-4.5 w-4.5" />
        </button>
        <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 font-bold flex items-center gap-1">
          <Star className="h-3 w-3 fill-gold-400" /> FaithFlow Max
        </span>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Content body layout */}
      <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full relative z-10 my-6">
        <div className="text-center space-y-4 mb-6">
          <div className="mx-auto p-4 w-16 h-16 rounded-3xl bg-gradient-to-br from-gold-500 to-gold-600 text-celestial-950 flex items-center justify-center border-2 border-gold-300 shadow-xl shadow-gold-500/10">
            <Sparkles className="h-8 w-8 text-celestial-950 animate-pulse" />
          </div>

          <h2 className="text-3xl font-serif font-bold text-slate-100 tracking-wide">
            Cultivate a richer faith, without boundaries.
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
            Join over 150,000 believers shepherding their spiritual habits with our high-end spiritual dashboard and AI Study Room.
          </p>
        </div>

        {/* Feature grid list */}
        <div className="space-y-3 mb-6">
          {premiumFeatures.map((feat, i) => (
            <div key={i} className="flex gap-3 items-start p-3 bg-celestial-900/60 rounded-2xl border border-white/5">
              <div className="mt-0.5 p-1 bg-gold-500/10 rounded-lg text-gold-400 border border-gold-500/20">
                <Check className="h-3.5 w-3.5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-200 block">{feat.text}</span>
                <span className="text-[10px] text-slate-400 leading-normal block">{feat.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing tier selects */}
        <div className="space-y-3">
          <div className="flex gap-1 bg-celestial-900 p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-gold-500 text-celestial-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual plan
              <span className="absolute -top-2.5 right-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[8px] uppercase tracking-wide px-2 py-0.5 rounded-full font-bold">
                PROMO INTRO
              </span>
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gold-500 text-celestial-950 font-extrabold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly billing
            </button>
          </div>

          {/* Plan invoice banner card */}
          <div className="bg-gradient-to-br from-celestial-900 to-celestial-850 p-4.5 rounded-2xl border border-gold-500/10 text-center relative overflow-hidden">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase text-gold-400 font-bold block">CURRENT ARRANGEMENT</span>
                <span className="text-2xl font-serif text-[#eedfbc] font-bold block mt-1">
                  {plans[billingCycle].price}
                </span>
                <span className="text-[10.5px] text-slate-400 leading-normal block mt-1">
                  {plans[billingCycle].billing}
                </span>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1.5 bg-gold-400/10 border border-gold-500/20 text-gold-400 rounded-xl">
                {plans[billingCycle].save}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary transactional CTAs */}
      <div className="relative z-10 w-full max-w-lg mx-auto pb-4 pt-2">
        <button
          onClick={handleUpgrade}
          disabled={isUpgrading}
          className="w-full bg-gold-500 hover:bg-gold-600 font-extrabold text-celestial-950 py-4 rounded-2xl text-[13px] tracking-wide transition-all shadow-lg hover:shadow-gold-500/15 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isUpgrading ? (
            <>
              <span className="w-2.5 h-2.5 bg-celestial-950 rounded-full animate-ping mr-1" />
              Verifying credentials...
            </>
          ) : (
            <>Activate 7-Day Free Trial</>
          )}
        </button>
        <span className="text-[10px] text-slate-500 text-center block mt-3 leading-relaxed max-w-sm mx-auto">
          Terms applied. Standard subscription applies automatic renewals unless cancelled 24 hrs prior to billing cycle dates.
        </span>
      </div>
    </div>
  );
}
