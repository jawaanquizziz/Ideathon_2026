const express = require('express');
const router = express.Router();
const { readDB, writeDB, ensureUser } = require('../data/storage');

// --- VIRTUAL AI INTELLIGENCE DATABASE (ZERO-API) ---
const VIRTUAL_SUGGESTIONS = [
  { id: "S-IQ-1", title: "Carbon-Link Optimization", desc: "Digital analysis suggests switching to LED lighting will reduce latent energy emissions by 15.4%.", type: "Energy", carbon: 3.2 },
  { id: "S-IQ-2", title: "Transport Synapse Detected", desc: "Our transport algorithms suggest telecommuting today aligns ideally with green grid peak hours.", type: "Travel", carbon: 5.8 },
  { id: "S-IQ-3", title: "Nutritional Logic Bridge", desc: "Processing recent food patterns... Switch to plant-based synergy tonight for an optimal footprint ROI.", type: "Food", carbon: 2.4 },
  { id: "S-IQ-4", title: "Hydraulic Efficiency Scan", desc: "Reducing shower duration by 180 seconds will optimize your water-energy nexus immediately.", type: "Lifestyle", carbon: 1.1 },
  { id: "S-IQ-5", title: "Waste Stream Optimization", desc: "Diagnostic scan complete. Implementing zero-waste packaging for groceries detected as high-impact.", type: "Waste", carbon: 0.9 },
  { id: "S-IQ-6", title: "Smart Standby Termination", desc: "Neural scan found redundant standby power draw. Unplug inactive devices for high Energy ROI.", type: "Energy", carbon: 0.5 }
];

const VIRTUAL_OPPORTUNITIES = [
  { id: "O-IQ-1", title: "Smart HVAC Synchronization", metric: "22% Prediction", desc: "Predictive thermal mapping suggests a smart thermostat will eliminate off-peak energy wastage.", impact: "High" },
  { id: "O-IQ-2", title: "Solar ROI Pattern Detection", metric: "3.5yr Break-even", desc: "Structural analysis shows local solar potential is peaking. High ROI probability detected.", impact: "High" },
  { id: "O-IQ-3", title: "EV Transition Logic Bridge", metric: "88% Synergy", desc: "Your travel logs indicate an electric vehicle would yield significant carbon-reduction synergy.", impact: "Medium" },
  { id: "O-IQ-4", title: "Compost Lifecycle Integration", metric: "12kg Monthly", desc: "Waste stream diagnosis predicts massive methane reduction through structural composting.", impact: "Low" }
];

// Helper to shuffle and pick items
const getRandomItems = (arr, count) => {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, count);
};

// GET /api/eco/score
router.get('/score', (req, res) => {
  const userId = req.headers['x-user-id'];
  const user = ensureUser(userId);
  if (!user) return res.status(404).json({ error: 'User session expired. Please refresh.' });
  res.json(user.stats);
});

// GET /api/eco/recommendations (Virtual AI Implementation)
router.get('/recommendations', async (req, res) => {
  // Simulate AI Processing time
  setTimeout(() => {
    res.json({
      suggestions: getRandomItems(VIRTUAL_SUGGESTIONS, 3),
      opportunities: getRandomItems(VIRTUAL_OPPORTUNITIES, 3)
    });
  }, 1200);
});

// POST /api/eco/estimate (Virtual AI Implementation)
router.post('/estimate', async (req, res) => {
  const { description } = req.body;
  
  // Intelligence Logic for Estimations
  let carbonValue = 1.5;
  let type = "General Optimization";
  
  if (description.toLowerCase().includes('walk') || description.toLowerCase().includes('bike')) {
    carbonValue = 3.5;
    type = "Travel Synergy";
  } else if (description.toLowerCase().includes('led') || description.toLowerCase().includes('solar')) {
    carbonValue = 12.0;
    type = "Structural ROI";
  } else if (description.toLowerCase().includes('food') || description.toLowerCase().includes('meal')) {
    carbonValue = 2.1;
    type = "Biological Impact";
  }

  setTimeout(() => {
    res.json({
      carbon: carbonValue,
      type: type,
      title: `AI Optimized: ${description.substring(0, 15)}`
    });
  }, 900);
});

// POST /api/eco/log
router.post('/log', (req, res) => {
  const { title, type, carbonSaved, points = 10 } = req.body;
  const userId = req.headers['x-user-id'];
  const db = readDB();

  const user = ensureUser(userId);
  if (!user) return res.status(404).json({ error: 'User session expired' });

  // Update Stats
  if (carbonSaved) {
    const val = parseFloat(carbonSaved);
    user.stats.carbonSaved += val;
    user.stats.score = Math.min(100, user.stats.score + Math.ceil(val / 0.2));
  }

  // Activity Log
  const now = new Date();
  const newActivity = {
    id: `ACT-${Date.now()}`,
    userId: userId,
    type: type || 'AI-Optimized',
    title: title || 'Eco Synchronization',
    impact: `-${parseFloat(carbonSaved).toFixed(1)} kg CO2`,
    status: 'Verified by AI',
    date: now.toISOString().split('T')[0],
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    points: points
  };

  db.activities.unshift(newActivity);
  writeDB(db);

  res.json({ status: 'success', stats: user.stats, activity: newActivity });
});

module.exports = router;
