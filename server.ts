import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const PORT = 3000;

// Lazy-initialized Gemini Client
let aiClient: GoogleGenAI | null = null;
const getGeminiClient = (): GoogleGenAI => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      console.warn("WARNING: GEMINI_API_KEY remains unconfigured or is the placeholder. Falling back to dynamic mock generation.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
};

// Mock Preloaded Devotionals (High-quality fallbacks / quick-start data)
const PRELOADED_DEVOTIONALS = [
  {
    id: "d1",
    verse: "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters.",
    reference: "Psalm 23:1-2",
    translation: "ESV",
    reflection: "In our fast-paced world, stress and exhaustion are often worn as badges of honor. Yet here, the Psalmist reminds us that our primary Shepherd invites us into resting spaces. He does not just permit rest; He *makes* us lie down. He knows our souls need the green pastures and the still, undisturbed waters to reflect His posture of quiet peace. When we let go of control and allow the Lord to shepherd our desires, we find that we truly 'shall not want' because our deepest spiritual appetites are perfectly satisfied in Him.",
    prayerPrompt: "Lord, I hand over my list of worries and my busy schedules to You. Guide me to Your still waters today. Teach my soul to sit in quiet surrender, recognizing that You are my ultimate provider. Amen.",
    date: "2026-05-27",
    isCustom: false
  },
  {
    id: "d2",
    verse: "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
    reference: "Isaiah 40:31",
    translation: "ESV",
    reflection: "Waiting is rarely easy. It feels inactive, like lost time. But biblical waiting is not passive stagnation; it is an active posture of hopeful expectation and trust in God's character. When we wait on the Lord, we exchange our limited, depleted energy for His infinite, non-wearying strength. Like eagles caught in thermal winds, we are lifted above the storms not by flapping our wings harder, but by trusting the wind of His Holy Spirit. Today, release the pressure to make things happen in your own strength.",
    prayerPrompt: "Father, waiting is hard for me. Forgive me for trying to run ahead of You. I place my hope in You today. Renew my tired spirit and grant me the grace to walk and not faint. Amen.",
    date: "2026-05-28",
    isCustom: false
  },
  {
    id: "d3",
    verse: "Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
    reference: "Philippians 4:6-7",
    translation: "ESV",
    reflection: "Paul does not dismiss anxiety as trivial; rather, he offers an immediate pathway out of it: transforming every single anxious thought into an active, thankful petition to God. True peacefulness does not arise from solving all of our problems, but from handing them over to the Sovereign Lord who cares for us. When we do this, a miraculous peace that defies logical circumstances descends to guard our hearts—like a garrison of soldiers protecting a city's gate.",
    prayerPrompt: "Sovereign Lord, thank You that You are close to me. I bring my anxieties into Your presence now. I exchange them for Your supernatural peace. Guard my mind today. Amen.",
    date: "2026-05-29",
    isCustom: false
  }
];

// Offline fallback generator for chat queries if API key is not present
const getOfflineChatResponse = (query: string): string => {
  const q = query.toLowerCase();
  
  if (q.includes("peace") || q.includes("worry") || q.includes("anxious") || q.includes("anxiety")) {
    return "### Divine Peace in Times of Concern\n\nScripture of Comfort: **Philippians 4:6-7** - *\"Do not be anxious about anything, but in everything... let your requests be made known to God.\"*\n\nWhen challenges press against your mind, remember that Bible guidance centers on **active prayer with thanksgiving**. \n\n**Reflection:**\nPeace is not the absence of trouble, but the comforting presence of God. Try practicing \"Breath Prayers\" today: inhale deeply while thinking *\"The Lord is my shepherd\"*, and exhale while thinking *\"I shall not want.\"*\n\nHow else can I help you explore this beautiful theme?";
  }
  
  if (q.includes("love") || q.includes("grace") || q.includes("forgive")) {
    return "### Experiencing the Depths of His Love\n\nScripture of Comfort: **1 John 4:19** - *\"We love because he first loved us.\"* and **Ephesians 2:8** - *\"For by grace you have been saved through faith.\"*\n\n**Deep Context:**\nIn the original Greek, biblical love is often described as *Agape*—an unconditional, sacrificial love that is a choice rather than an emotion. God's grace (*Charis*) is an unmerited gift of favor that is completely free yet cost Christ everything.\n\nBe encouraged today that your value is not defined by external successes, but by the love shown on the Cross. What specific scriptures on love or grace would you like to examine?";
  }

  if (q.includes("strength") || q.includes("hard") || q.includes("difficult") || q.includes("pain")) {
    return "### Unfailing Strength for the Journey\n\nScripture of Comfort: **Isaiah 41:10** - *\"Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you...\"*\n\n**Devotional Thought:**\nWhen we are weak, it feels discouraging. However, Paul wrote in **2 Corinthians 12:9** that the Lord's power is made perfect in weakness. It is during our low moments that His grace becomes our foundation.\n\nLet us pray: *\"Father, stand beside me today. When my strength runs dry, pour Your life and fortitude into my soul. Amen.\"*\n\nWould you like me to find custom verses about enduring trials?";
  }

  return "### Exploring God's Living Word\n\nThank you for exploring scripture. As your Bible Companion, I am here to help you study, reflect, and pray.\n\n**Here are a few meaningful things you can ask me:**\n1. *\"Explain Romans 8:28 in its cultural and historical context.\"*\n2. *\"What does the scripture say about perseverance and trials?\"*\n3. *\"Give me a 5-day devotional outline on managing mental fatigue.\"*\n4. *\"Help me write a personal prayer inspired by Psalm 46.\"*\n\nPlease set your **GEMINI_API_KEY** in the Secrets panel to activate full real-time bible search and scripture commentary! In the meantime, I'm happy to discuss topics like Peace, Love, or Strength using my stored study materials.";
};

async function startServer() {
  const app = express();
  app.use(express.json());

  // Check if Gemini API key is configured
  app.get('/api/config', (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    const isConfigured = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '';
    res.json({ isGeminiConfigured: isConfigured });
  });

  // ENDPOINT: Chat Companion
  app.post('/api/gemini/chat', async (req, res) => {
    const { messages, userMessage } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    const isConfigured = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '';

    if (!isConfigured) {
      setTimeout(() => {
        res.json({ content: getOfflineChatResponse(userMessage), isFallback: true });
      }, 800);
      return;
    }

    try {
      const ai = getGeminiClient();
      
      const systemInstruction = 
        "You are 'Daily Bread Companion', a deeply warm, wise, compassionate, and orthodox Bible Study Mentor. " +
        "Your purpose is to help the user understand scriptures, solve theological questions, write meaningful reflections, and feel comforted. " +
        "Always include specific, inspiring scripture references (Book Chapter:Verse) to back up your guidance. " +
        "Formatting: Use markdown headers, lists, italics, and quotes to make the text beautifully readable. " +
        "Make your tone encouraging, quiet, faith-oriented, and ending with a short, personal 1-sentence blessing.";

      const formattedHistory = (messages || []).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const contents = [...formattedHistory, { role: 'user', parts: [{ text: userMessage }] }];

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const textOutput = response.text || "I apologize, I am contemplating the scripture structure but could not generate a response. Please rephrase your faith query.";
      res.json({ content: textOutput, isFallback: false });
    } catch (error: any) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({ error: "Failed to generate AI chat response. Reverting to local guide companion.", detail: error.message });
    }
  });

  // ENDPOINT: Generate Dynamic Devotional
  app.post('/api/gemini/devotional', async (req, res) => {
    const { topic } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    const isConfigured = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '';

    if (!isConfigured) {
      const topicLC = (topic || '').toLowerCase();
      let picked = PRELOADED_DEVOTIONALS[0];
      if (topicLC.includes("strength") || topicLC.includes("wait") || topicLC.includes("hope")) {
        picked = PRELOADED_DEVOTIONALS[1];
      } else if (topicLC.includes("anxious") || topicLC.includes("peace") || topicLC.includes("worry") || topicLC.includes("fear")) {
        picked = PRELOADED_DEVOTIONALS[2];
      }
      
      setTimeout(() => {
        res.json({
          ...picked,
          id: `custom-offline-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          isCustom: true,
          isFallback: true
        });
      }, 1000);
      return;
    }

    try {
      const ai = getGeminiClient();
      const systemPrompt = 
        "You are a master biblical scholar and faith counselor. " +
        "Your goal is to generate a deeply inspiring, scripture-based daily devotional for a specified topic. " +
        "You must return the devotional strictly conforming to the requested JSON schema.";

      const promptMessage = `Create a beautiful, emotionally rich, and biblically sound daily devotional about the topic of: "${topic || 'Inspiration and Faith'}". Make the reflection segment exceptionally warm and relatable (~2-3 paragraphs).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptMessage,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verse: { type: Type.STRING, description: "The exact wording of the selected Bible verse that matches the topic perfectly" },
              reference: { type: Type.STRING, description: "The scroll, book, chapter, and verse references (e.g., Romans 8:38-39)" },
              translation: { type: Type.STRING, description: "The Bible translation used (e.g. NIV, ESV, NASB)" },
              reflection: { type: Type.STRING, description: "A heartwarming, deep theological reflection that links the scripture text with daily struggles, hope, and modern-day spiritual practices. Keep it 2-3 paragraphs." },
              prayerPrompt: { type: Type.STRING, description: "A beautifully crafted personal guided prayer written in the first person, ready to pray aloud." }
            },
            required: ["verse", "reference", "translation", "reflection", "prayerPrompt"]
          }
        }
      });

      const parsedData = JSON.parse(response.text || '{}');
      res.json({
        id: `ai-dev-${Date.now()}`,
        ...parsedData,
        date: new Date().toISOString().split('T')[0],
        isCustom: true,
        isFallback: false
      });
    } catch (error: any) {
      console.error("Gemini Devotional Creator Error:", error);
      res.status(500).json({ error: "Failed to generate devotional. Restoring preloaded bible readings." });
    }
  });

  // ENDPOINT: Get Preloaded Devotional list
  app.get('/api/devotionals', (req, res) => {
    res.json(PRELOADED_DEVOTIONALS);
  });

  // ENDPOINT: Generate Guided Journal Prompt
  app.get('/api/prayer-prompt', async (req, res) => {
    const { mood } = req.query;
    const moodStr = (mood || 'peaceful').toString();
    
    const apiKey = process.env.GEMINI_API_KEY;
    const isConfigured = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '';

    if (!isConfigured) {
      const localPrompts: Record<string, string> = {
        anxious: "Write down 3 things that are currently heavy on your chest. For each, write: 'Father, Your hands are bigger than this. I trust You.'",
        tired: "Settle into your seat. Reflect on Matthew 11:28. Describe what 'rest for your soul' feels like to you today.",
        grateful: "List five unexpected blessings from this past week, no matter how small, and write a love letter of thanks to your Creator.",
        lonely: "Reflect on God's promise to never leave nor forsake you. Write down times in your life where you felt His invisible comforting hand.",
        confused: "Acknowledge that you do not need to know the next ten steps, only the next single step. Ask Lord for wisdom to take it in peace."
      };
      const chosenPrompt = localPrompts[moodStr] || "Spend 5 minutes describing where you saw God's light shining today, and write a humble prayer.";
      res.json({ prompt: chosenPrompt, isFallback: true });
      return;
    }

    try {
      const ai = getGeminiClient();
      const promptMessage = `Create a single, deeply comforting, and highly creative journal/prayer prompt for someone seeking faith who feels "${moodStr}". It should be 2-3 sentences max, giving them a practical reflection exercise to type about.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptMessage,
        config: {
          systemInstruction: "You are a warm pastoral advisor writing short spiritual diary prompts. No fluff, just the prompt itself.",
          temperature: 0.8,
        }
      });

      res.json({ prompt: response.text?.trim() || "What is sitting heaviest on your heart right now? Pour it out in writing, asking God for peace.", isFallback: false });
    } catch (error) {
      res.json({ prompt: "Focus on your breathing for a moment. Write a quiet prayer asking God to illuminate your next step.", isFallback: true });
    }
  });

  // Serve Static Files and Vite Handler
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
