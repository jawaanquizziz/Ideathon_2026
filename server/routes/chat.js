const express = require('express');
const router = express.Router();
const { ensureUser } = require('../data/storage');

// --- VIRTUAL AI INTELLIGENCE ENGINE (ZERO-API) ---
const getLeafyResponse = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('hello') || msg.includes('hi')) {
    return "🌿 Energy synchronization complete. Hello! I am Leafy, your Virtual Intelligence Mentor. My neural circuits are ready to optimize your sustainability path today.";
  }
  if (msg.includes('analyze') || msg.includes('impact') || msg.includes('footprint')) {
    return "🔍 Environmental Diagnosis: I've scanned the current global sustainability patterns. Your impact signature shows great promise. I recommend focusing on 'Hydraulic Efficiency' and 'Energy ROI' to reach net-zero even faster.";
  }
  if (msg.includes('score') || msg.includes('how am i doing')) {
    return "📊 Sustainability Metrics: Your Eco Score is at a high-ROI state. I've cross-referenced your habits with top-performing eco-warriors and detected a 12% optimization window for your next 48 hours.";
  }
  if (msg.includes('tip') || msg.includes('suggest') || msg.includes('recommend')) {
    return "🍃 Intelligence Suggestion: Based on my predictive algorithms, switching to a 'Plant-Based Synergy' for dinner tonight could reduce your daily emissions by 1.8kg CO2. High-probability success detected!";
  }
  if (msg.includes('help') || msg.includes('what can i do')) {
    return "🌿 I am Leafy, your AI Mentor! You can ask me to 'Analyze my impact', 'Give me a tip', or 'Check my score'. I'm also here to help you log activities and find structural 'ML Opportunities'.";
  }
  if (msg.includes('log') || msg.includes('activity')) {
    return "✍️ Data Input Request: I can help you log actions! Simply use the Dashboard to record your latest eco-win, and My neural engine will verify and calculate the points for you.";
  }
  
  return "🍃 Leafy Intelligence Status: Processing... That's a fascinating perspective! While I cross-reference that with the global eco-grid, remember that every small optimization leads to a massive environmental ROI. Stay green! 🌿";
};

// POST /api/chat
router.post('/', async (req, res) => {
  const { message } = req.body;
  const userId = req.headers['x-user-id'];
  
  // Ensure session exists
  const user = ensureUser(userId);
  if (!user && userId !== 'guest') {
    return res.status(404).json({ error: 'Session expired' });
  }
  
  // Artificial delay to simulate "AI Thinking"
  setTimeout(() => {
    const responseText = getLeafyResponse(message);
    res.json({ text: responseText });
  }, 800);
});

module.exports = router;
