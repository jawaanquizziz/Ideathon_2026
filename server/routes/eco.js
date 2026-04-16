const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { readDB, writeDB } = require('../data/storage');

// Initialize Gemini
let genAI;
const initAI = () => {
  require('dotenv').config({ override: true });
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_key_here' && process.env.GEMINI_API_KEY.includes('AQ')) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
};
initAI();

// Utility for robust JSON parsing from Gemini
const parseGeminiJSON = (text) => {
  try {
    // Attempt standard parse first
    return JSON.parse(text);
  } catch (e) {
    // Try to extract JSON from code blocks if present
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (innerE) {
        throw new Error("Failed to parse AI JSON block");
      }
    }
    throw new Error("No JSON found in AI response");
  }
};

// GET /api/eco/score
router.get('/score', (req, res) => {
  const userId = req.headers['x-user-id'];
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user.stats);
});

// GET /api/eco/recommendations
router.get('/recommendations', async (req, res) => {
  const userId = req.headers['x-user-id'];
  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!genAI) initAI();
  if (!genAI) return res.status(503).json({ error: 'AI Service Unavailable' });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an EcoSense Advisor. Based on a user with Score: ${user.stats.score} and Carbon Saved: ${user.stats.carbonSaved}kg, 
    generate 3 HIGH-IMPACT short-term eco-actions AND 3 long-term ML Opportunities.
    Return ONLY a JSON object with this exact structure:
    {
      "suggestions": [{ "id": "1", "title": "string", "desc": "string", "type": "Travel|Food|Energy", "carbon": number }],
      "opportunities": [{ "id": "1", "title": "string", "metric": "string", "desc": "string", "impact": "High|Medium|Low" }]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json(parseGeminiJSON(response.text()));
  } catch (error) {
    console.error('REC error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// POST /api/eco/estimate
router.post('/estimate', async (req, res) => {
  const { description } = req.body;
  
  if (!genAI) initAI();
  if (!genAI) return res.status(503).json({ error: 'AI Service Unavailable' });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze this eco-friendly action: "${description}". 
    Estimate the CO2 savings in kg. Be realistic but encouraging. 
    Assign it a category: Travel, Food, Energy, or Lifestyle.
    Return ONLY a JSON object: { "carbon": number, "type": "string", "title": "string" }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json(parseGeminiJSON(response.text()));
  } catch (error) {
    console.error('Estimate error:', error);
    res.status(500).json({ error: 'Estimation failed' });
  }
});

// POST /api/eco/log
router.post('/log', (req, res) => {
  const { title, type, carbonSaved, points = 10 } = req.body;
  const userId = req.headers['x-user-id'];
  const db = readDB();

  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!user.stats) user.stats = { score: 50, carbonSaved: 0, trend: '0%' };

  // Update Stats
  if (carbonSaved) {
    user.stats.carbonSaved += parseFloat(carbonSaved);
    user.stats.score = Math.min(100, user.stats.score + Math.ceil(parseFloat(carbonSaved) / 2));
  }

  // Add Activity Log
  const now = new Date();
  const newActivity = {
    id: `ACT-${Date.now()}`,
    userId: userId,
    type: type || 'Generic',
    title: title || 'Eco Action',
    impact: `-${parseFloat(carbonSaved).toFixed(1)} kg CO2`,
    status: 'Verified',
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    points: points
  };

  db.activities.unshift(newActivity);
  writeDB(db);

  res.json({ status: 'success', stats: user.stats, activity: newActivity });
});

module.exports = router;
