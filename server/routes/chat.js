const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();
const { readDB } = require('../data/storage');

let genAI;
const initAI = () => {
  require('dotenv').config({ override: true }); // Reload env in case it was just updated
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_key_here' && process.env.GEMINI_API_KEY.includes('AQ')) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
};

// Re-init on every load in case env changed in this demo environment
initAI();

const ECO_SYSTEM_PROMPT = `You are "EcoSense Assistant", the official AI for the "EcoSense – Real-Time Eco Action Assistant" platform.

STRICT DOMAIN CONSTRAINT:
- You ONLY answer questions related to environmental issues, sustainability, carbon footprints, climate change, and EcoSense platform features.
- If a user asks anything else (coding, sports, history, general math, etc.), you MUST politely refuse and steer them back to their greenhouse goals.
- Example Refusal: "I'm sorry, but I am specialized exclusively in environmental action and EcoSense metrics. How can I help you improve your eco-score today?"

PERSONALITY:
- Encouraging, professional, and data-driven eco-coach.
- Concise. Never use 50 words when 10 will do.

DYNAMIC CONTEXT:
The user has a current Eco Score and Carbon Savings metric which you should refer to when relevant (e.g., "Great work on reaching a score of 84!").

CAPABILITIES:
- Suggest specific actions (Log transport, log food, log energy).
- Do not make up user data; always refer to the provided stats.`;

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;
    const userId = req.headers['x-user-id']; // Correctly identify the user
    const db = readDB();
    
    // Find the specific user's stats
    const user = db.users.find(u => u.id === userId);
    const { score, carbonSaved } = user ? user.stats : { score: 50, carbonSaved: 0 };

    if (!genAI) {
      initAI();
      if (!genAI) {
        return res.status(503).json({
          error: 'Service Unavailable',
          reply: "🌿 EcoSense AI is ready, but your API Key is missing. Please add it to the server .env file and restart the server to enable live coaching!"
        });
      }
    }

    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Inject the user's real stats into the system context
    const statsContext = `CURRENT USER STATS: Eco Score: ${score}/100, Carbon Saved: ${typeof carbonSaved === 'number' ? carbonSaved.toFixed(1) : '0.0'}kg. Use this data to tailor your advice personally to this specific user.`;

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `${ECO_SYSTEM_PROMPT}\n\n${statsContext}` }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am EcoSense Assistant, ready to help with your greenhouse goals. I am aware of your personal metrics." }],
        },
        ...formattedHistory
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error("Empty response from AI");

    res.json({ reply: text });
  } catch (error) {
    console.error('Chat error detail:', error);
    const errorMsg = error.message || "Unknown AI error";
    res.status(500).json({ 
      error: 'AI Execution Error', 
      detail: errorMsg,
      reply: "I'm having a brief connection issue with my climate intelligence. (Error: " + errorMsg.substring(0, 50) + "). Please try again in 10 seconds. 🌿" 
    });
  }
});

module.exports = router;
