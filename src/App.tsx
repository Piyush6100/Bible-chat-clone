import { useState, useEffect } from 'react';
import { BookOpen, Bot, PenTool, Users, Heart, Sparkles, Flame, Star, Home, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import DevotionalView from './components/DevotionalView';
import AIStudyCompanion from './components/AIStudyCompanion';
import PrayerJournal from './components/PrayerJournal';
import PrayerWall from './components/PrayerWall';
import SoulDashboard from './components/SoulDashboard';
import Onboarding from './components/Onboarding';
import SubscriptionPaywall from './components/SubscriptionPaywall';
import { Devotional, ReadingPlan, Prayer } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isGeminiConfigured, setIsGeminiConfigured] = useState(false);
  
  // Custom user profile and onboarding states
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('faithflow_is_onboarded') === 'true';
  });
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('faithflow_user_name') || 'John';
  });
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem('faithflow_is_premium') === 'true';
  });
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [externalChatQuery, setExternalChatQuery] = useState('');

  // Daily Devotional Data Engine
  const [currentDevotional, setCurrentDevotional] = useState<Devotional>({
    id: "d1",
    verse: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters.",
    reference: "Psalm 23:1-2",
    translation: "ESV",
    reflection: "In our fast-paced world, stress and exhaustion are often worn as badges of honor. Yet here, the Psalmist reminds us that our primary Shepherd invites us into resting spaces. He does not just permit rest; He *makes* us lie down. He knows our souls need the green pastures and the still, undisturbed waters to reflect His posture of quiet peace. When we let go of control and allow the Lord to shepherd our desires, we find that we truly 'shall not want' because our deepest spiritual appetites are perfectly satisfied in Him.",
    prayerPrompt: "Lord, I hand over my list of worries and my busy schedules to You. Guide me to Your still waters today. Teach my soul to sit in quiet surrender, recognizing that You are my ultimate provider. Amen.",
    date: new Date().toISOString().split('T')[0]
  });

  // Retention and community details
  const [streak, setStreak] = useState(3); 
  const [completedPlanToday, setCompletedPlanToday] = useState(false);
  const [bookmarkedDevotionals, setBookmarkedDevotionals] = useState<Devotional[]>([]);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  
  // High-fidelity active chapters
  const [readingPlans, setReadingPlans] = useState<ReadingPlan[]>([
    { id: 'rp1', title: 'Genesis 1: Creation Story', targetChapter: 'Genesis 1', completed: false },
    { id: 'rp2', title: 'Psalm 23: The Shepherd’s Song', targetChapter: 'Psalm 23', completed: true },
    { id: 'rp3', title: 'Proverbs 3: Wisdom and Trust', targetChapter: 'Proverbs 3', completed: false },
    { id: 'rp4', title: 'John 1: The Word Made Flesh', targetChapter: 'John 1', completed: false }
  ]);

  // Load configuration & data states on boot
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setIsGeminiConfigured(!!data.isGeminiConfigured))
      .catch(err => console.error("Error loaded API config status", err));

    const savedBookmarks = localStorage.getItem('daily_bread_bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarkedDevotionals(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error(e);
      }
    }

    const savedStreak = localStorage.getItem('daily_bread_streak');
    const savedCompletedToday = localStorage.getItem('daily_bread_completed_today');
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    }
    if (savedCompletedToday === 'true') {
      setCompletedPlanToday(true);
    }

    const savedPlans = localStorage.getItem('daily_bread_reading_plans');
    if (savedPlans) {
      try {
        setReadingPlans(JSON.parse(savedPlans));
      } catch (e) {
        console.error(e);
      }
    }

    // Load prayers from wall
    const savedPrayers = localStorage.getItem('daily_bread_prayer_wall');
    if (savedPrayers) {
      try {
        setPrayers(JSON.parse(savedPrayers));
      } catch (e) {
        console.error(e);
      }
    }

    fetch('/api/devotionals')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCurrentDevotional(prev => prev.isCustom ? prev : data[0]);
        }
      })
      .catch(err => console.warn("Notice: Operating on fallback scriptures. API offline."));
  }, []);

  const handleOnboardingComplete = (selections: { userName: string; focusAreas: string[]; reminderTime: string }) => {
    setUserName(selections.userName);
    setIsOnboarded(true);
    localStorage.setItem('faithflow_user_name', selections.userName);
    localStorage.setItem('faithflow_is_onboarded', 'true');
    setActiveTab('home');
  };

  const handleUpgradeComplete = () => {
    setIsPremium(true);
    setIsPaywallOpen(false);
    localStorage.setItem('faithflow_is_premium', 'true');
  };

  const handleCompleteReading = () => {
    if (completedPlanToday) return;
    const nextStreak = streak + 1;
    setStreak(nextStreak);
    setCompletedPlanToday(true);
    localStorage.setItem('daily_bread_streak', nextStreak.toString());
    localStorage.setItem('daily_bread_completed_today', 'true');
  };

  const handleBookmarkDevotional = (devo: Devotional) => {
    const exists = bookmarkedDevotionals.find(b => b.id === devo.id);
    let updated: Devotional[] = [];
    if (exists) {
      updated = bookmarkedDevotionals.filter(b => b.id !== devo.id);
    } else {
      updated = [...bookmarkedDevotionals, devo];
    }
    setBookmarkedDevotionals(updated);
    localStorage.setItem('daily_bread_bookmarks', JSON.stringify(updated));
  };

  const handleRemoveBookmark = (devo: Devotional) => {
    const updated = bookmarkedDevotionals.filter(b => b.id !== devo.id);
    setBookmarkedDevotionals(updated);
    localStorage.setItem('daily_bread_bookmarks', JSON.stringify(updated));
  };

  const handleSelectBookmarkedDevotional = (devo: Devotional) => {
    setCurrentDevotional(devo);
    setActiveTab('devotional');
  };

  const handleTogglePlan = (planId: string) => {
    const updated = readingPlans.map(p => {
      if (p.id === planId) {
        return { ...p, completed: !p.completed };
      }
      return p;
    });
    setReadingPlans(updated);
    localStorage.setItem('daily_bread_reading_plans', JSON.stringify(updated));
  };

  const handleSaveAIReflection = (devo: Devotional) => {
    // Add dynamically saved AI study counsels into bookmarks list
    const updated = [devo, ...bookmarkedDevotionals];
    setBookmarkedDevotionals(updated);
    localStorage.setItem('daily_bread_bookmarks', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-celestial-900 flex justify-center items-start sm:p-4 md:py-8 font-sans overflow-x-hidden select-none relative selection:bg-gold-500/25">
      
      {/* Decorative celestial background glows */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[8%] left-[7%] w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        <div className="absolute top-[35%] right-[12%] w-2 h-2 bg-gold-400 rounded-full animate-ping" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[22%] left-[10%] w-1 h-1 bg-white rounded-full" />
        <div className="absolute bottom-[48%] right-[28%] w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse" />
      </div>

      {/* Interactive Cinematic Onboarding Screen */}
      <AnimatePresence>
        {!isOnboarded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-celestial-950 flex justify-center items-center sm:p-4"
          >
            <div className="w-full sm:max-w-md md:max-w-3xl bg-[#07080d] sm:rounded-[3rem] h-full sm:h-[800px] relative overflow-hidden flex flex-col sm:border-8 border-celestial-950">
              <Onboarding onComplete={handleOnboardingComplete} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Luxury Premium Paywall Dialog */}
      <AnimatePresence>
        {isPaywallOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-55 bg-celestial-950/70 backdrop-blur-md flex justify-center items-center sm:p-4"
          >
            <div className="w-full sm:max-w-md md:max-w-2xl bg-[#090a10] sm:rounded-[3rem] h-full sm:h-[750px] relative overflow-hidden flex flex-col sm:border-8 border-celestial-950 shadow-2xl">
              <SubscriptionPaywall 
                onClose={() => setIsPaywallOpen(false)} 
                onUpgradeComplete={handleUpgradeComplete} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Premium Phone/Tablet Mockup frame */}
      <div className="w-full sm:max-w-md md:max-w-3xl bg-celestial-950 sm:rounded-[3rem] shadow-3xl relative overflow-hidden sm:border-8 border-celestial-950 flex flex-col min-h-screen sm:min-h-[850px] border-b border-white/5">
        
        {/* Dynamic faith header with upgrade reminders */}
        <Header 
          streak={streak} 
          completedPlanToday={completedPlanToday} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          bookmarksCount={bookmarkedDevotionals.length}
        />

        {/* Dynamic content panel body */}
        <main className="flex-1 bg-celestial-900 p-5 pb-24 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === 'home' && (
                <HomeView
                  userName={userName}
                  streak={streak}
                  completedPlanToday={completedPlanToday}
                  devotional={currentDevotional}
                  readingPlans={readingPlans}
                  prayers={prayers}
                  isPremium={isPremium}
                  onNavigate={setActiveTab}
                  onTogglePlan={handleTogglePlan}
                  onTriggerPremiumPaywall={() => setIsPaywallOpen(true)}
                  onSetExternalChatQuery={setExternalChatQuery}
                />
              )}

              {activeTab === 'devotional' && (
                <DevotionalView
                  devotional={currentDevotional}
                  onBookmark={handleBookmarkDevotional}
                  isBookmarked={!!bookmarkedDevotionals.find(b => b.id === currentDevotional.id)}
                  onCompleteReading={handleCompleteReading}
                  hasCompletedReading={completedPlanToday}
                  setDevotional={setCurrentDevotional}
                />
              )}

              {activeTab === 'companion' && (
                <AIStudyCompanion 
                  isGeminiConfigured={isGeminiConfigured} 
                  onSaveReflection={handleSaveAIReflection}
                  externalQuery={externalChatQuery}
                  onClearExternalQuery={() => setExternalChatQuery('')}
                />
              )}

              {activeTab === 'journal' && (
                <PrayerJournal onJournalComplete={handleCompleteReading} />
              )}

              {activeTab === 'prayer_wall' && (
                <PrayerWall />
              )}

              {activeTab === 'soul' && (
                <SoulDashboard 
                  streak={streak}
                  completedPlanToday={completedPlanToday}
                  bookmarkedDevotionals={bookmarkedDevotionals}
                  readingPlans={readingPlans}
                  onTogglePlan={handleTogglePlan}
                  onRemoveBookmark={handleRemoveBookmark}
                  onSelectBookmarkedDevotional={handleSelectBookmarkedDevotional}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Fixed Mobile App Bar dock layout (Spotify/Apple Health inspired) */}
        <nav className="absolute bottom-0 inset-x-0 bg-celestial-950/98 backdrop-blur-md border-t border-white/5 flex justify-around items-center py-3.5 px-4 shadow-3xl rounded-t-[2rem] z-40">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'devotional', label: 'Daily Bread', icon: BookOpen },
            { id: 'companion', label: 'Bible Chat', icon: Bot, isSpecial: true },
            { id: 'journal', label: 'Selah Diary', icon: PenTool },
            { id: 'prayer_wall', label: 'Brethren Wall', icon: Users },
            { id: 'soul', label: 'My Soul', icon: Heart }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-1 text-center cursor-pointer relative"
              >
                {/* Visual cursor bar */}
                {isSelected && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute -top-1.5 w-8 h-1 rounded-full bg-gold-400 shadow-lg shadow-gold-500/25"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}

                <div className={`p-1.5 rounded-xl transition-all ${
                  isSelected 
                    ? 'text-celestial-950 bg-gold-500 shadow-md shadow-gold-500/10' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}>
                  <Icon className={`h-4.5 w-4.5 ${tab.isSpecial && !isSelected ? 'text-gold-400 animate-pulse' : ''}`} />
                </div>
                <span className={`text-[9.5px] font-sans font-medium tracking-wide block ${
                  isSelected ? 'text-gold-400 font-extrabold' : 'text-slate-400'
                }`}>
                  {tab.label}
                </span>
                
                {/* Show Pro crown badge on Soul if premium */}
                {tab.id === 'soul' && isPremium && (
                  <span className="absolute -top-1 -right-1 bg-gold-500 rounded-full w-2 h-2 border border-celestial-950" />
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
