import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Trash2, HelpCircle, AlertCircle, BookOpen, Sparkles, MessageSquareHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';

interface AIStudyCompanionProps {
  isGeminiConfigured: boolean;
}

export default function AIStudyCompanion({ isGeminiConfigured }: AIStudyCompanionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Attempt load historic active chat session optionally
    const cached = localStorage.getItem('daily_bread_chat_history');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.warn(e);
      }
    }
    return [
      {
        id: "m-welcome",
        role: 'assistant',
        content: "Grace and peace to you! 🌿 I am your **Daily Bread Scripture Advisor**.\n\nAs you read the Bible, questions arise about context, Hebrew/Greek roots, theology, or practical applications. Please ask me anything! For example: \n- *\"What is the historical background of the book of Isaiah?\"*\n- *\"Explain the concept of Agape love mentioned in 1 Corinthians 13.\"*\n- *\"Can you suggest 3 scriptures that offer strength in times of grief?\"*",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { title: "Understand Romans 8", text: "Explain Romans 8:28 in its cultural and historical context." },
    { title: "Verses for Perseverance", text: "What does the scripture say about perseverance during heavy trials?" },
    { title: "History of Psalms", text: "Who wrote the Psalms, and what was their role in ancient Israelite worship?" },
    { title: "Study Agape Love", text: "Compare Hebrew 'Chesed' mercy with Greek 'Agape' love." }
  ];

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Save history on changes
  useEffect(() => {
    localStorage.setItem('daily_bread_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: ChatMessage = {
      id: `u-msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.filter(m => m.id !== 'm-welcome'), // Skip welcome in main LLM payload
          userMessage: text
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: `ai-msg-${Date.now()}`,
          role: 'assistant',
          content: data.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        const errData = await response.json();
        throw new Error(errData.error || "Server error");
      }
    } catch (error) {
      console.error(error);
      const aiErr: ChatMessage = {
        id: `ai-msg-err-${Date.now()}`,
        role: 'assistant',
        content: "I apologize, deeply. I had trouble connecting to my central theological library. Please check your internet or retry soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiErr]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Do you want to clear your current conversation history?")) {
      const defaultState = [
        {
          id: "m-welcome",
          role: 'assistant',
          content: "Welcome back! How can I help you explore, study, and pray with the Scriptures today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      setMessages(defaultState);
      localStorage.setItem('daily_bread_chat_history', JSON.stringify(defaultState));
    }
  };

  return (
    <div className="flex flex-col h-[580px] bg-celestial-900 rounded-3xl overflow-hidden border border-gold-500/10 shadow-2xl relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Configuration Status Notice Banner */}
      {!isGeminiConfigured && (
        <div className="bg-gold-500/5 border-b border-gold-500/15 px-4 py-2.5 flex items-center gap-2 text-[10px] text-amber-200 justify-between">
          <span className="flex items-center gap-1.5 font-sans leading-relaxed tracking-tight">
            <AlertCircle className="h-3.5 w-3.5 text-gold-400 flex-shrink-0" />
            Study Mode: Offline Local database active. Configure Gemini Secrets API access for real-time theological counseling.
          </span>
        </div>
      )}

      {/* Message Ledger Pane */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-[88%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Profile Ring */}
              <div className={`p-2 rounded-xl h-8 w-8 flex items-center justify-center flex-shrink-0 border transition-all ${
                m.role === 'user' 
                  ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-celestial-950 border-gold-500/30 font-bold shadow-md shadow-gold-500/10' 
                  : 'bg-celestial-850 border-white/5 text-gold-400 shadow-sm'
              }`}>
                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-gold-400" />}
              </div>

              {/* Speech Bubble */}
              <div>
                <div className={`p-4 rounded-2xl shadow-lg leading-relaxed text-xs sm:text-sm ${
                  m.role === 'user'
                    ? 'bg-celestial-850 text-gold-100 rounded-tr-none border border-gold-500/20'
                    : 'bg-celestial-850 text-slate-100 border border-white/5 rounded-tl-none font-sans'
                }`}>
                  <div className="whitespace-pre-wrap selection:bg-gold-500/20">
                    {m.content.split('\n').map((line, i) => {
                      if (line.startsWith('### ')) {
                        return <h4 key={i} className="text-sm font-serif font-bold text-gold-400 mt-3 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                          <span className="w-1 h-3 bg-gold-500 rounded-full" />
                          {line.replace('### ', '')}
                        </h4>;
                      }
                      if (line.startsWith('- ') || line.startsWith('* ')) {
                        return <li key={i} className="ml-4 list-disc text-slate-300 my-1">{line.substring(2)}</li>;
                      }
                      
                      // Match verse quote patterns roughly
                      if (line.includes('**') || line.includes('*')) {
                        return (
                          <p key={i} className="my-1.5 leading-relaxed">
                            {line.split('**').map((tok, j) => {
                              if (j % 2 === 1) return <strong key={j} className="font-extrabold text-gold-400">{tok}</strong>;
                              return tok.split('*').map((sub, k) => {
                                if (k % 2 === 1) return <span key={k} className="italic text-slate-100 bg-gold-500/10 px-1.5 py-0.5 rounded border border-gold-400/10 font-serif">{sub}</span>;
                                return sub;
                              });
                            })}
                          </p>
                        );
                      }
                      return <p key={i} className="my-1.5">{line}</p>;
                    })}
                  </div>
                </div>
                <span className={`text-[9px] text-slate-500 mt-1 block font-mono ${m.role === 'user' ? 'text-right' : ''}`}>
                  {m.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 max-w-[80%]"
            >
              <div className="p-2 rounded-xl h-8 w-8 bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-celestial-850 p-4 rounded-2xl border border-white/5 shadow-md">
                <div className="flex gap-2 items-center py-0.5">
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce align-middle" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce align-middle" style={{ animationDelay: '200ms' }} />
                  <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce align-middle" style={{ animationDelay: '400ms' }} />
                  <span className="text-xs text-slate-400 ml-1.5 font-sans">Counselor is shepherding response...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Quick Suggested Query Chips (Only show if messages length is short) */}
      {messages.length < 3 && !isLoading && (
        <div className="px-4 py-3 bg-celestial-950/80 border-t border-white/5 relative z-10">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 mb-2.5 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-gold-400 animate-pulse" /> SUGGESTED DISCUSSIONS:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.text)}
                className="text-left bg-celestial-850 hover:bg-gold-500/5 border border-white/5 hover:border-gold-500/30 rounded-xl p-2.5 text-xs transition-all group cursor-pointer hover:shadow-lg"
              >
                <div className="font-sans font-bold text-slate-200 group-hover:text-gold-400 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-slate-400 group-hover:text-gold-500" />
                  {q.title}
                </div>
                <div className="text-[10px] text-slate-400 group-hover:text-slate-300 truncate mt-0.5">{q.text}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Message Container */}
      <div className="p-4 bg-celestial-950 border-t border-white/5 flex items-center gap-2 relative z-10">
        <button
          onClick={clearChat}
          className="p-3 bg-celestial-850 text-slate-400 hover:text-gold-400 rounded-2xl hover:bg-celestial-800 border border-white/5 transition-all cursor-pointer"
          title="Clear current theological conversation session"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex-1 flex gap-2 relative"
        >
          <input
            type="text"
            value={inputValue}
            disabled={isLoading}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask scriptures commentary or translation context..."
            className="flex-1 px-4 py-3 bg-celestial-850 rounded-2xl border border-white/5 text-xs focus:ring-1 focus:ring-gold-500 outline-none text-slate-100 placeholder-slate-500 focus:bg-celestial-800 transition-all font-sans disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-3 rounded-2xl bg-gold-500 hover:bg-gold-600 text-celestial-950 font-extrabold transition-all shadow-md disabled:opacity-40 cursor-pointer"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
