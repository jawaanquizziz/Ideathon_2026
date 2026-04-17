const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

// Memory Cache for Production/Serverless environments (Vercel)
let memoryDB = null;

const readDB = () => {
  // If we have a memory version (Production), use it
  if (memoryDB) return memoryDB;

  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(data);
    
    // In production, we initialize the memoryDB from the disk once
    if (process.env.NODE_ENV === 'production') {
      memoryDB = parsed;
    }
    
    return parsed;
  } catch (error) {
    console.warn('DB Read Warning (Fallback active):', error.message);
    return memoryDB || { users: [], activities: [], stats: { score: 50, carbonSaved: 0, trend: '0%' } };
  }
};

const writeDB = (data) => {
  // Always update memory cache
  memoryDB = data;

  try {
    // Attempt to write to disk (will work locally, fail on Vercel)
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    // On Vercel, we ignore the write error and rely on memoryDB
    if (process.env.NODE_ENV === 'production') {
      console.log('Production Environment: Data synchronized in memory.');
      return true;
    }
    console.error('Local Storage Error:', error);
    return false;
  }
};

module.exports = { readDB, writeDB };
