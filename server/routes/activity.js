const express = require('express');
const router = express.Router();
const { readDB } = require('../data/storage');

router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'];
  const db = readDB();
  
  // Filter activities that belong to this user
  const userActivities = (db.activities || []).filter(a => a.userId === userId);
  
  res.json({
    data: userActivities,
    total: userActivities.length,
    page: 1,
  });
});

module.exports = router;
