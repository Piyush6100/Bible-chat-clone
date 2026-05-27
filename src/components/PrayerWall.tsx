import React, { useState, useEffect } from 'react';
import { Heart, Plus, Users, ShieldAlert, CheckCircle, MessagesSquare, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Prayer } from '../types';

export default function PrayerWall() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [newPrayerText, setNewPrayerText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [newPrayerTag, setNewPrayerTag] = useState<string>('General');
  const [postSuccess, setPostSuccess] = useState(false);

  const TAGS = ['All', 'Healing', 'Family', 'Guidance', 'Anxiety', 'Financial', 'Faith Growth'];
  const FORM_TAGS = ['General', 'Healing', 'Family', 'Guidance', 'Anxiety', 'Financial', 'Faith Growth'];

  const PRELOADED_PRAYERS: Prayer[] = [
    {
      id: "p1",
      author: "Hannah K. (Dallas, TX)",
      text: "Please join me in praying for my mother, Sarah. She is undergoing cancer surgery tomorrow morning. We are asking the Great Physician for total restoration and steady hands for the surgeons.",
      timestamp: "2 hours ago",
      amenCount: 42,
      isLikedByUser: false,
      tags: ["Healing"]
    },
    {
      id: "p2",
      author: "Jonathan Miller",
      text: "Struggling with a severe season of career burnout. I feel isolated and constantly worried about providing for my three young children. Praying for Job guidance and quiet restoration.",
      timestamp: "5 hours ago",
      amenCount: 28,
      isLikedByUser: false,
      tags: ["Guidance", "Financial"]
    },
    {
      id: "p3",
      author: "Anonymous Sister",
      text: "Praying for school anxiety. My teenage son is refusing to go to classes due to heavy pressure and bullying. Praying the Lord surrounds him with loving friends and a peaceful shield.",
      timestamp: "1 day ago",
      amenCount: 56,
      isLikedByUser: false,
      tags: ["Family", "Anxiety"]
    },
    {
      id: "p4",
      author: "David R.",
      text: "I am feeling thankful today! My heart had wandered away from reading scriptures and studying for years, but the Lord in His kindness drew me back this week. Praying for active spiritual growth.",
      timestamp: "2 days ago",
      amenCount: 19,
      isLikedByUser: false,
      tags: ["Faith Growth"]
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('daily_bread_prayer_wall');
    if (saved) {
      try {
        setPrayers(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    } else {
      setPrayers(PRELOADED_PRAYERS);
      localStorage.setItem('daily_bread_prayer_wall', JSON.stringify(PRELOADED_PRAYERS));
    }
  }, []);

  const handleAmen = (id: string) => {
    const updated = prayers.map(p => {
      if (p.id === id) {
        const liked = !p.isLikedByUser;
        return {
          ...p,
          amenCount: liked ? p.amenCount + 1 : p.amenCount - 1,
          isLikedByUser: liked
        };
      }
      return p;
    });
    setPrayers(updated);
    localStorage.setItem('daily_bread_prayer_wall', JSON.stringify(updated));
  };

  const handlePostPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayerText.trim()) return;

    const freshPrayer: Prayer = {
      id: `p-${Date.now()}`,
      author: isAnonymous ? 'Anonymous Companion' : (authorName.trim() || 'Faith Companion'),
      text: newPrayerText.trim(),
      timestamp: 'Just now',
      amenCount: 1,
      isLikedByUser: true,
      tags: [newPrayerTag]
    };

    const updated = [freshPrayer, ...prayers];
    setPrayers(updated);
    localStorage.setItem('daily_bread_prayer_wall', JSON.stringify(updated));

    // Clear Inputs
    setNewPrayerText('');
    setAuthorName('');
    setIsAnonymous(false);

    // Success Banner Toggle
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
    }, 3500);
  };

  // Filter prayers list
  const filteredPrayers = selectedTag === 'All' 
    ? prayers 
    : prayers.filter(p => p.tags?.includes(selectedTag));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Post a request module (5 columns) */}
        <div className="lg:col-span-5 bg-celestial-850 rounded-3xl p-6 shadow-2xl border border-white/5 flex flex-col justify-between">
          <div>
            <span className="text-gold-400 text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1.5 bg-gold-400/10 rounded-xl border border-gold-500/20">
              ✙ COMMUNAL FELLOWSHIP
            </span>
            <h3 className="text-xl font-serif font-bold text-slate-100 mt-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-gold-400" />
              Prayer Requests
            </h3>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              &ldquo;Carry each other's burdens, and in this way you will fulfill the law of Christ.&rdquo; <span className="font-bold underline text-gold-400">Galatians 6:2</span>
            </p>

            <form onSubmit={handlePostPrayer} className="space-y-4 mt-5">
              
              {postSuccess && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/15 text-emerald-300 text-xs px-3.5 py-2.5 rounded-xl border border-emerald-500/30 flex items-center gap-2"
                >
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-400 flex-shrink-0" />
                  Your request has been posted on the prayer wall.
                </motion.div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1.5 tracking-wider">Your Name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  disabled={isAnonymous}
                  placeholder="e.g. Rachel S."
                  className="w-full bg-celestial-900 border border-white/5 px-4 py-2.5 rounded-xl text-xs outline-none focus:ring-1 focus:ring-gold-500 text-slate-200 placeholder-slate-600 focus:bg-celestial-950 transition-all font-sans"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 bg-celestial-900 rounded border-white/10 text-gold-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="anon" className="text-xs text-slate-300 select-none cursor-pointer font-sans">Post anonymously to protect privacy</label>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1.5 tracking-wider">Themes Category</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {FORM_TAGS.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setNewPrayerTag(t)}
                      className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-mono font-bold transition-all ${
                        newPrayerTag === t 
                          ? 'bg-gold-500 text-celestial-950 border-gold-500 font-extrabold' 
                          : 'bg-celestial-900 text-slate-400 border-white/5 hover:border-gold-500/20'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1.5 tracking-wider">Prayer Request Details</label>
                <textarea
                  value={newPrayerText}
                  onChange={(e) => setNewPrayerText(e.target.value)}
                  required
                  rows={4}
                  placeholder="Share a struggle or victory you would like brethren to pray with you for..."
                  className="w-full bg-celestial-900 border border-white/5 px-4 py-3 rounded-xl text-xs outline-none focus:ring-1 focus:ring-gold-500 text-slate-200 placeholder-slate-600 focus:bg-celestial-950 transition-all font-serif leading-relaxed resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!newPrayerText.trim()}
                className="w-full bg-gold-500 hover:bg-gold-600 font-extrabold shadow-md shadow-gold-500/10 text-celestial-950 py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45 transition-all"
              >
                Hang Request on Board <Plus className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Interactive Card Board Wall (7 columns) */}
        <div className="lg:col-span-7 bg-celestial-850 rounded-3xl p-6 border border-white/5 flex flex-col h-[580px]">
          
          {/* Tags list filter */}
          <div className="mb-4">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-widest block mb-2 font-bold">Filter prayer tags:</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  className={`text-[10px] px-3.5 py-1.5 rounded-xl font-mono border flex-shrink-0 transition-all cursor-pointer ${
                    selectedTag === t 
                      ? 'bg-gold-500 text-celestial-950 border-gold-500 font-extrabold shadow-md' 
                      : 'bg-celestial-900 text-slate-400 border-white/5 hover:border-gold-500/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* List Wall */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 selection:bg-gold-500/20">
            <AnimatePresence mode="popLayout">
              {filteredPrayers.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center p-6 bg-celestial-900 border border-dashed border-white/10 rounded-2xl text-center"
                >
                  <div className="p-3 bg-celestial-850 border border-white/5 rounded-full text-gold-400 mb-2">
                    <MessagesSquare className="h-6 w-6" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-300">No requests in &ldquo;{selectedTag}&rdquo; yet</h5>
                  <p className="text-[10px] text-slate-400 mt-2 max-w-xs leading-relaxed">
                    Be the first to submit a custom request for this theme in the post desk on the left!
                  </p>
                </motion.div>
              ) : (
                filteredPrayers.map((pray) => (
                  <motion.div
                    key={pray.id}
                    layout
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-celestial-900 rounded-2xl p-4 md:p-5 border border-white/5 hover:border-gold-500/10 transition-all relative flex flex-col justify-between"
                  >
                    
                    {/* Header: Author + Timestamp */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-serif font-bold text-[#eedfbc] text-sm block tracking-wide">
                          {pray.author}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 font-bold block">{pray.timestamp}</span>
                      </div>

                      {/* Prayer category tags */}
                      <div className="flex gap-1">
                        {pray.tags?.map(t => (
                          <span key={t} className="text-[9px] font-mono font-bold bg-gold-500/10 text-gold-400 px-2.5 py-0.5 rounded-lg border border-gold-500/20">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* text */}
                    <p className="text-slate-200 font-serif text-xs md:text-sm leading-relaxed mb-4 whitespace-pre-line italic">
                      &ldquo;{pray.text}&rdquo;
                    </p>

                    {/* Footer: Amen click interactions */}
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                        <Users className="h-3.5 w-3.5 text-gold-400/60" />
                        <span>{pray.amenCount} praying along</span>
                      </div>

                      <button
                        onClick={() => handleAmen(pray.id)}
                        className={`flex items-center gap-1.5 text-xs font-bold font-mono px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                          pray.isLikedByUser 
                            ? 'bg-gold-500 border-gold-500 text-celestial-950 font-extrabold shadow-md scale-105' 
                            : 'bg-celestial-950 border-white/5 text-slate-300 hover:text-gold-400 hover:border-gold-500/20'
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${pray.isLikedByUser ? 'text-celestial-950 fill-celestial-950' : 'text-slate-500'}`} />
                        {pray.isLikedByUser ? 'Amen Sent!' : 'Say Amen'}
                      </button>
                    </div>

                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
