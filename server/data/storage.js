const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return { users: [], activities: [], stats: { score: 50, carbonSaved: 0, trend: '0%' } };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing DB:', error);
    return false;
  }
};

module.exports = { readDB, writeDB };
