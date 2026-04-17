const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// Memory Cache for Production/Serverless environments (Vercel)
let memoryDB = null;

const readDB = () => {
  if (memoryDB) return memoryDB;

  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(data);
    memoryDB = parsed; // Cache it immediately
    return parsed;
  } catch (error) {
    console.warn('DB Read Warning (Fallback active):', error.message);
    const fallback = { users: [], activities: [], stats: { score: 50, carbonSaved: 0, trend: '0%' } };
    memoryDB = fallback;
    return fallback;
  }
};

const writeDB = (data) => {
  memoryDB = data;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    // Silently continue for serverless environments
    return true;
  }
};

/**
 * Ensures a user exists in the memory DB. 
 * If missing (due to Lambda recycle), it recreates a default state for them.
 */
const ensureUser = (userId) => {
  const db = readDB();
  let user = db.users.find(u => u.id === userId);
  
  if (!user && userId && userId !== 'guest') {
    user = {
      id: userId,
      name: 'Resilient User',
      email: 'recovered@ecosense.ai',
      stats: { score: 50, carbonSaved: 0, trend: '0%' }
    };
    db.users.push(user);
    // On Vercel, this only lasts in this container instance, 
    // but it prevents 404s for the current session.
  }
  
  return user;
};

module.exports = { readDB, writeDB, ensureUser };
