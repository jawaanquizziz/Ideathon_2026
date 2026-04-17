const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../data/storage');

// GET /api/notifications
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'];
  const db = readDB();
  
  // Ensure user has notifications array in DB
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  if (!user.notifications) {
    user.notifications = [
      { id: '1', title: 'Welcome to EcoSense AI', message: 'Personalized sustainability analysis is now active.', type: 'System', read: false, date: 'Today' },
      { id: '2', title: 'Calibration Successful', message: 'Your Carbon Pattern has been synchronized with global trends.', type: 'AI', read: false, date: 'Today' }
    ];
    writeDB(db);
  }
  
  res.json(user.notifications);
});

// POST /api/notifications/read
router.post('/read', (req, res) => {
  const { id } = req.body;
  const userId = req.headers['x-user-id'];
  const db = readDB();
  
  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const notif = user.notifications?.find(n => n.id === id);
  if (notif) {
    notif.read = true;
    writeDB(db);
  }
  
  res.json({ success: true });
});

module.exports = router;
