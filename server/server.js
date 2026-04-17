const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const ecoRoutes = require('./routes/eco');
const activityRoutes = require('./routes/activity');
const notificationRoutes = require('./routes/notification');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/eco', ecoRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/notification', notificationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EcoSense API is running' });
});

// Export for Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
