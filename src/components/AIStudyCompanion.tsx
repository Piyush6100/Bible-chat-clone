import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Trash2, HelpCircle, AlertCircle, BookOpen, Sparkles, Heart, Copy, Bookmark, MessageSquareHeart, Mic, Info, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, Devotional } from '../types';

interface AIStudyCompanionProps {
  isGeminiConfigured: boolean;
  onSaveReflection?: (devotional: Devotional) => void;
  externalQuery?: string;
  onClearExternalQuery?: () => void;
}

export default function AIStudyCompanion({ 
  isGeminiConfigured, 
  onSaveReflection,
  externalQuery,
  onClearExternalQuery 
}: AIStudyCompanionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
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
        content: "Peace be with you! 🌿 I am your companion counselor.\n\nAsk me anything from biblical archaeology, translation nuances, or personal struggles you would like comforting passages for.\n\nTry asking:\n* *\"Suggest passages of encouragement for when I feel overwhelmed at work\"*\n* *\"What are the original Greek and Hebrew nuances of the word Mercy?\"*",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isMicActive, setIsMicActive] = useState(false);
  const [activeVoicePrompt, setActiveVoicePrompt] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    { title: "Calm Anxiety", text: "Offer a beautiful guided calming prayer & passages for middle of the night anxiety." },
    { title: "Meaning of Chesed", text: "Explain the profound Hebrew covenant concept of 'Chesed' mercy." },
    { title: "Help Me Sleep", text: "Share a peaceful scripture reading of Psalm 91 styled like a sleep meditation." },
    { title: "Theology of Hope", text: "Provide historical theological commentary about Roman contexts of hope." }
  ];

  // Sync external direct queries (e.g., from the Suggested chips on Home Screen)
  useEffect(() => {
    if (externalQuery) {
      setInputValue(externalQuery);
      handleSendMessage(externalQuery);
      if (onClearExternalQuery) onClearExternalQuery();
    }
  }, [externalQuery]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
          messages: messages.filter(m => m.id !== 'm-welcome'), 
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
        throw new Error("API Offline");
      }
    } catch (error) {
      console.error(error);
      // Premium interactive fallback engine
      setTimeout(() => {
        let fallbackReply = "Peace be with you. In this moment, remember that 'The Lord is high above all nations, and his glory above the heavens' (Psalm 113:4). Let us seek His counsel in absolute confidence, for 'The Lord is near to all who call on him, to all who call on him in truth' (Psalm 145:18).";
        
        if (text.toLowerCase().includes('anxiety') || text.toLowerCase().includes('sleep') || text.toLowerCase().includes('overwhelm')) {
          fallbackReply = "Grace to you. When waves of worry crash against your soul, speak the words of Philippians 4:6-7: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.' Let us pause. Take a deep, calm breath. God is holding your tomorrow. \n\n### Companion Comfort Prayer\n*Lord Jesus, shepherd this heart today. Hush the noise of the world. Wrap them in Your peace which exceeds all understanding. Let Your light break through any momentary shadows. Amen.*";
        } else if (text.toLowerCase().includes('mercy') || text.toLowerCase().includes('chesed') || text.toLowerCase().includes('greek')) {
          fallbackReply = "The Hebrew word **Chesed** (*\u05d7\u05e1\u05d3*) represents one of the most foundational covenant concepts in all of scripture. Often translated as 'steadfast love,' 'loyalty,' or 'lovingkindness,' it is not a mere emotion but an active duty. It is the absolute fidelity of Yahweh to His promises.\n\nIn the Greek New Testament, this is echoed in **Agape** (*\u1f00\u03b3\u03ac\u03c0\u03b7*), self-sacrificing love as modeled in the life of Christ. Combining Chesed and Agape reveals a complete picture of divine mercy: an unbreakable devotion coupled with sacrificial action.";
        } else if (text.toLowerCase().includes('hope') || text.toLowerCase().includes('commentary')) {
          fallbackReply = "Hope represents a robust, eager expectation of future victory based on God’s proven past faithfulness. \n\nIn Hebrew, hope is often **Tiqvah**, related to a binding cord or tensioned line, signifying strength in active patience. In the Roman context, this stood as a majestic counter-cultural statement: while the empire celebrated transient material power, the early church rooted their hope specifically in the resurrected Logos.";
        }

        const aiMsg: ChatMessage = {
          id: `ai-msg-res-${Date.now()}`,
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsLoading(false);
      }, 1200);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToBookmarks = (msg: ChatMessage) => {
    if (onSaveReflection) {
      const generatedDevotional: Devotional = {
        id: `custom-${Date.now()}`,
        verse: "Reflective scripture session",
        reference: "Companion Study Quote",
        translation: "A Counselor Study",
        reflection: msg.content,
        prayerPrompt: "Blessed be the Lord.",
        date: new Date().toLocaleDateString(),
        isCustom: true
      };
      onSaveReflection(generatedDevotional);
      setSavedId(msg.id);
      setTimeout(() => setSavedId(null), 2000);
    }
  };

  // Pray about this interaction (appends a quick prayer generation request)
  const handlePrayAboutThis = (themeText: string) => {
    const summary = themeText.split('\n')[0].substring(0, 60);
    handleSendMessage(`Write an elegant pastoral prayer for my evening devotional reflecting on: "${summary}"`);
  };

  const clearChat = () => {
    const defaultState = [
      {
        id: "m-welcome",
        role: 'assistant',
        content: "Welcome back! What scripture context or theological query exists on your mind today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(defaultState);
    localStorage.setItem('daily_bread_chat_history', JSON.stringify(defaultState));
  };

  // Simulate dictation flow
  const handleToggleVoiceDictation = () => {
    if (isMicActive) {
      setIsMicActive(false);
      if (activeVoicePrompt) {
        setInputValue(activeVoicePrompt);
        setActiveVoicePrompt('');
      }
    } else {
      setIsMicActive(true);
      const suggestions = [
        "Explain what John 1:1 means by 'the Word was God'",
        "Help me sleep which comforting peace verses",
        "How can I practice biblical patience when stressed?"
      ];
      const randomPrompt = suggestions[Math.floor(Math.random() * suggestions.length)];
      
      // Gradually type out voice input
      let cur = '';
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < randomPrompt.length) {
          cur += randomPrompt[idx];
          setActiveVoicePrompt(cur);
          idx++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsMicActive(false);
            setInputValue(randomPrompt);
            setActiveVoicePrompt('');
          }, 1000);
        }
      }, 40);
    }
  };

  return (
    <div className="flex flex-col h-[580px] bg-[#07080d] rounded-3xl overflow-hidden border border-gold-500/10 shadow-2xl relative select-none">
      
      {/* Background radial glows exactly like Bible Chat premium design */}
      <div className="absolute top-[10%] right-[-10%] w-60 h-60 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-56 h-56 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Mic dictating simulation overlay box */}
      <AnimatePresence>
        {isMicActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#05060a]/92 backdrop-blur-md z-45 flex flex-col justify-center items-center p-6 text-center"
          >
            <div className="p-4 bg-gold-500 text-celestial-950 rounded-full animate-bounce mb-4 border-2 border-gold-300">
              <Mic className="h-6 w-6 stroke-[2.5]" />
            </div>
            <h4 className="text-sm font-serif font-bold text-slate-100 tracking-wide uppercase">Listening with Compassion</h4>
            <div className="w-16 h-1 mt-2.5 bg-gold-500 rounded-full flex gap-1 justify-center overflow-hidden">
              <span className="w-1.5 h-full bg-slate-900 animate-ping" />
              <span className="w-1.5 h-full bg-slate-900 animate-ping" style={{ animationDelay: '200ms' }} />
            </div>
            <p className="text-slate-300 font-serif italic text-xs mt-6 leading-relaxed max-w-xs">
              &ldquo;{activeVoicePrompt || "Listening..."}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top micro stat status banner */}
      <div className="bg-[#0b0c14] border-b border-white/5 py-2.5 px-4.5 flex justify-between items-center text-[10px] text-slate-400 font-mono font-bold">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> AI Study Advisor Online
        </span>
        <button 
          onClick={clearChat}
          className="hover:text-rose-450 transition-colors uppercase flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="h-3 w-3" /> Reset Session
        </button>
      </div>

      {/* Chat Speech Bubble Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans leading-relaxed">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Profile Avatar Frame with Golden Accents */}
              <div className={`p-2.5 rounded-xl h-9 w-9 flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                m.role === 'user'
                  ? 'bg-gradient-to-br from-gold-500 to-gold-600 border-gold-400 text-celestial-950 font-bold shadow-md shadow-gold-500/10'
                  : 'bg-celestial-950 border-gold-500/20 text-gold-400 shadow-sm'
              }`}>
                {m.role === 'user' ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5 text-gold-400 fill-gold-400/10" />}
              </div>

              {/* Message bubble speech container */}
              <div className="space-y-1.5">
                <div className={`p-4 rounded-2xl shadow-xl leading-relaxed text-xs sm:text-[13.5px] border ${
                  m.role === 'user'
                    ? 'bg-[#151722]/90 text-gold-100 rounded-tr-none border-gold-500/20'
                    : 'bg-[#0f111a]/95 text-slate-100 rounded-tl-none border-white/5'
                }`}>
                  <div className="whitespace-pre-wrap selection:bg-gold-500/35">
                    {m.content.split('\n').map((line, i) => {
                      if (line.startsWith('### ')) {
                        return (
                          <h4 key={i} className="text-xs font-mono font-bold text-gold-400 mt-4 mb-2 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1 h-3 bg-gold-500 rounded-full" />
                            {line.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (line.startsWith('* ') || line.startsWith('- ')) {
                        return <li key={i} className="ml-4 list-disc text-slate-300 my-1">{line.substring(2)}</li>;
                      }

                      // Dynamic bible quote bold highlight rules
                      if (line.includes('**') || line.includes('*') || line.includes("'")) {
                        return (
                          <p key={i} className="my-1.5 leading-relaxed font-sans">
                            {line.split('**').map((tok, j) => {
                              if (j % 2 === 1) return <strong key={j} className="font-extrabold text-gold-300">{tok}</strong>;
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

                  {/* Micro interaction buttons under Assistant messages */}
                  {m.role === 'assistant' && m.id !== 'm-welcome' && (
                    <div className="mt-4 pt-3.5 border-t border-white/5 flex flex-wrap gap-2 text-[10px] text-slate-400">
                      <button 
                        onClick={() => handleCopy(m.id, m.content)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-white/[0.03] hover:bg-gold-500/10 border border-white/5 hover:border-gold-500/20 text-slate-300 hover:text-gold-400 rounded-lg transition-all"
                      >
                        {copiedId === m.id ? (
                          <><Check className="h-3 w-3 text-emerald-400" /> Copied!</>
                        ) : (
                          <><Copy className="h-3 w-3" /> Copy Verse</>
                        )}
                      </button>

                      <button 
                        onClick={() => handleSaveToBookmarks(m)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-white/[0.03] hover:bg-gold-500/10 border border-white/5 hover:border-gold-500/20 text-slate-300 hover:text-gold-400 rounded-lg transition-all"
                      >
                        {savedId === m.id ? (
                          <><Check className="h-3 w-3 text-emerald-400" /> Saved!</>
                        ) : (
                          <><Bookmark className="h-3 w-3" /> Save Reflection</>
                        )}
                      </button>

                      <button 
                        onClick={() => handlePrayAboutThis(m.content)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-white/[0.03] hover:bg-gold-500/10 border border-[#eedfbc]/10 hover:border-gold-500/30 text-[#eedfbc] hover:text-gold-400 rounded-lg transition-all font-serif"
                      >
                        <MessageSquareHeart className="h-3 w-3 text-gold-400" /> Pray About This
                      </button>
                    </div>
                  )}
                </div>
                
                <span className={`text-[9px] text-slate-500 block font-mono ${m.role === 'user' ? 'text-right' : ''}`}>
                  {m.timestamp}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Typing delay placeholder */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 max-w-[85%]"
            >
              <div className="p-2 h-9 w-9 bg-[#0b0c14]/10 border-2 border-gold-500/20 text-gold-400 rounded-xl flex items-center justify-center">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div className="bg-[#0f111a] p-4 rounded-2xl border border-white/5 shadow-md">
                <div className="flex gap-2 items-center py-0.5">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                  <span className="text-[11px] text-slate-400 ml-1.5 font-sans">Theology assistant is tailoring counsel...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Suggested discussion topic pills if history holds welcome screen only */}
      {messages.length < 2 && !isLoading && (
        <div className="px-4 py-3 bg-[#0a0b10] border-t border-white/5 relative z-10 animate-fade-in">
          <div className="flex items-center gap-1.5 text-[9.5px] font-mono font-extrabold text-[#eedfbc] mb-2 uppercase tracking-widest leading-none">
            <Sparkles className="h-3.5 w-3.5 text-gold-400" /> Suggested discussions
          </div>
          <div className="flex flex-col gap-1.5 max-h-[148px] overflow-y-auto">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.text)}
                className="text-left bg-[#10121b] hover:bg-gold-500/5 border border-white/5 hover:border-gold-500/20 rounded-xl p-2.5 text-xs transition-all group flex justify-between items-center cursor-pointer"
              >
                <div className="flex-1 text-left">
                  <span className="font-bold text-slate-200 group-hover:text-gold-400 text-[11px] block">{q.title}</span>
                  <span className="text-[10px] text-slate-400 truncate block mt-0.5 font-sans pr-2">
                    {q.text}
                  </span>
                </div>
                <BookOpen className="h-4 w-4 text-slate-500 group-hover:text-gold-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Dictation trigger & Message Input desks */}
      <div className="p-4 bg-[#0a0b12] border-t border-white/5 flex items-center gap-2 relative z-10 shadow-2xl">
        <button
          onClick={handleToggleVoiceDictation}
          className="p-3 bg-celestial-950 text-gold-400 hover:text-gold-300 rounded-2xl hover:bg-white/[0.03] border border-white/5 hover:border-gold-500/20 transition-all flex justify-center items-center cursor-pointer flex-shrink-0"
          title="Voice dictation simulation input mode"
        >
          <Mic className="h-5 w-5 animate-pulse" />
        </button>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="flex-1 flex gap-2"
        >
          <input
            type="text"
            value={inputValue}
            disabled={isLoading}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask theological counsel or prayer requests..."
            className="flex-1 px-4 py-3.5 bg-celestial-950 rounded-2xl border border-white/5 text-xs focus:ring-1 focus:ring-gold-500 outline-none text-slate-100 placeholder-slate-600 focus:bg-white/[0.02] transition-all font-sans disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4.5 rounded-2xl bg-gold-500 hover:bg-gold-600 text-celestial-950 font-extrabold transition-all shadow-md disabled:opacity-35 flex justify-center items-center cursor-pointer"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
