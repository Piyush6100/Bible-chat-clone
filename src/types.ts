export interface Devotional {
  id: string;
  verse: string;
  reference: string;
  translation: string;
  reflection: string;
  prayerPrompt: string;
  themeColor?: string;
  date: string;
  isCustom?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  promptText: string;
  date: string;
}

export interface Prayer {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  amenCount: number;
  isLikedByUser?: boolean;
  tags?: string[];
}

export interface ReadingPlan {
  id: string;
  title: string;
  targetChapter: string;
  completed: boolean;
  notes?: string;
}

export interface BibleVerse {
  reference: string;
  text: string;
}
