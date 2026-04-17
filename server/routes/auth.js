const express = require('express');
const router = express.Router();
const { readDB, writeDB, ensureUser } = require('../data/storage');

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const db = readDB();

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const newUser = { 
    id: Date.now().toString(), 
    name, 
    email, 
    password,
    stats: { score: 50, carbonSaved: 0, trend: '0%' }
  };
  db.users.push(newUser);
  writeDB(db);

  res.status(201).json({ message: 'User registered', user: { id: newUser.id, name, email } });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
});

router.put('/profile/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const db = readDB();

  const user = ensureUser(id);
  if (!user) {
    return res.status(404).json({ error: 'User session expired' });
  }

  // Update user details
  user.name = name || user.name;
  user.email = email || user.email;

  writeDB(db);

  res.json({ 
    message: 'Profile updated', 
    user: { 
      id: db.users[userIndex].id, 
      name: db.users[userIndex].name, 
      email: db.users[userIndex].email 
    } 
  });
});

module.exports = router;
