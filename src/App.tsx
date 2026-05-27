import { useState, useEffect } from 'react';
import { BookOpen, Bot, PenTool, Users, Heart, Sparkles, Flame, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import DevotionalView from './components/DevotionalView';
import AIStudyCompanion from './components/AIStudyCompanion';
import PrayerJournal from './components/PrayerJournal';
import PrayerWall from './components/PrayerWall';
import SoulDashboard from './components/SoulDashboard';
import { Devotional, ReadingPlan } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('devotional');
  const [isGeminiConfigured, setIsGeminiConfigured] = useState(false);
  
  // Devotionals & Scripture lists
  const [currentDevotional, setCurrentDevotional] = useState<Devotional>({
    id: "d1",
    verse: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters.",
    reference: "Psalm 23:1-2",
    translation: "ESV",
    reflection: "In our fast-paced world, stress and exhaustion are often worn as badges of honor. Yet here, the Psalmist reminds us that our primary Shepherd invites us into resting spaces. He does not just permit rest; He *makes* us lie down. He knows our souls need the green pastures and the still, undisturbed waters to reflect His posture of quiet peace. When we let go of control and allow the Lord to shepherd our desires, we find that we truly 'shall not want' because our deepest spiritual appetites are perfectly satisfied in Him.",
    prayerPrompt: "Lord, I hand over my list of worries and my busy schedules to You. Guide me to Your still waters today. Teach my soul to sit in quiet surrender, recognizing that You are my ultimate provider. Amen.",
    date: new Date().toISOString().split('T')[0]
  });

  // Habit metrics: Streak, bookmarking lists
  const [streak, setStreak] = useState(3); // Start with a 3-day active streak for onboarding delight
  const [completedPlanToday, setCompletedPlanToday] = useState(false);
  const [bookmarkedDevotionals, setBookmarkedDevotionals] = useState<Devotional[]>([]);
  
  // Custom interactive Bible Chapter checkboxes
  const [readingPlans, setReadingPlans] = useState<ReadingPlan[]>([
    { id: 'rp1', title: 'Genesis 1: Creation Story', targetChapter: 'Genesis 1', completed: false },
    { id: 'rp2', title: 'Psalm 23: The Shepherd’s Song', targetChapter: 'Psalm 23', completed: true },
    { id: 'rp3', title: 'Proverbs 3: Wisdom and Trust', targetChapter: 'Proverbs 3', completed: false },
    { id: 'rp4', title: 'John 1: The Word Made Flesh', targetChapter: 'John 1', completed: false }
  ]);

  // Read config & states from LocalStorage / Server
  useEffect(() => {
    // 1. Fetch backend configuration
    fetch('/api/config')
      .then(res => res.json())
      .then(data => setIsGeminiConfigured(!!data.isGeminiConfigured))
      .catch(err => console.error("Error loaded API config status", err));

    // 2. Local Storage bookmarks
    const savedBookmarks = localStorage.getItem('daily_bread_bookmarks');
    if (savedBookmarks) {
      try {
        setBookmarkedDevotionals(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error(e);
      }
    }

    // 3. Local Storage streaks
    const savedStreak = localStorage.getItem('daily_bread_streak');
    const savedCompletedToday = localStorage.getItem('daily_bread_completed_today');
    if (savedStreak) {
      setStreak(parseInt(savedStreak, 10));
    }
    if (savedCompletedToday === 'true') {
      setCompletedPlanToday(true);
    }

    // 4. Local Storage Reading plans
    const savedPlans = localStorage.getItem('daily_bread_reading_plans');
    if (savedPlans) {
      try {
        setReadingPlans(JSON.parse(savedPlans));
      } catch (e) {
        console.error(e);
      }
    }

    // 5. Fetch default server devotionals for the day (if any exist)
    fetch('/api/devotionals')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          // Keep current if customized already to save user's prompt interaction
          setCurrentDevotional(prev => prev.isCustom ? prev : data[0]);
        }
      })
      .catch(err => console.warn("Notice: Operating on default offline scriptures. Serve API fallback is active."));
  }, []);

  // Handle Complete Devotional reading: Climbs streak!
  const handleCompleteReading = () => {
    if (completedPlanToday) return;

    const nextStreak = streak + 1;
    setStreak(nextStreak);
    setCompletedPlanToday(true);
    
    localStorage.setItem('daily_bread_streak', nextStreak.toString());
    localStorage.setItem('daily_bread_completed_today', 'true');
  };

  // Complete a Journal entry: Climbs streak!
  const handleJournalComplete = () => {
    handleCompleteReading();
  };

  // Bookmark toggling
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

  // Toggle active reading chapters
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

  return (
    <div className="min-h-screen bg-celestial-900 flex justify-center items-start sm:p-4 md:py-8 font-sans overflow-x-hidden select-none relative">
      
      {/* Decorative celestial stars backgrounds */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[8%] left-[7%] w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        <div className="absolute top-[35%] right-[12%] w-2 h-2 bg-gold-400 rounded-full animate-ping" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-[22%] left-[10%] w-1 h-1 bg-white rounded-full" />
        <div className="absolute bottom-[48%] right-[28%] w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse" />
      </div>

      {/* Main Premium Phone/Tablet Mockup frame */}
      <div className="w-full sm:max-w-md md:max-w-3xl bg-celestial-950 sm:rounded-[3rem] shadow-2xl relative overflow-hidden sm:border-8 border-celestial-950 flex flex-col min-h-screen sm:min-h-[850px]">
        
        {/* Dynamic faith header */}
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
                <AIStudyCompanion isGeminiConfigured={isGeminiConfigured} />
              )}

              {activeTab === 'journal' && (
                <PrayerJournal onJournalComplete={handleJournalComplete} />
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

        {/* Fixed Mobile App Bar dock layout */}
        <nav className="absolute bottom-0 inset-x-0 bg-celestial-950/95 backdrop-blur-md border-t border-white/5 flex justify-around items-center py-3.5 px-4 shadow-2xl rounded-t-3xl z-40">
          {[
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
                className="flex flex-col items-center gap-1.5 text-center cursor-pointer relative"
              >
                {/* Visual cursor ring */}
                {isSelected && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute -top-1.5 w-10 h-1 rounded-full bg-gold-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <div className={`p-1.5 rounded-xl transition-all ${
                  isSelected 
                    ? 'text-celestial-950 bg-gold-500 shadow-md shadow-gold-500/10' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}>
                  <Icon className={`h-5 w-5 ${tab.isSpecial && !isSelected ? 'text-gold-400 animate-pulse' : ''}`} />
                </div>
                <span className={`text-[9.5px] font-sans leading-none tracking-wide block ${
                  isSelected ? 'text-gold-400 font-bold' : 'text-slate-400'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
