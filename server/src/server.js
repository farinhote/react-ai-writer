const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory user storage (replace with a real database in production)
const users = [];

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  // Create new user
  const user = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword
  };
  
  users.push(user);
  
  // Create and assign token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'mysecretkey');
  
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Email or password is incorrect' });
  }
  
  // Validate password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'Email or password is incorrect' });
  }
  
  // Create and assign token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'mysecretkey');
  
  res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/users/me', authenticateToken, (req, res) => {
  const user = users.find(user => user.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.status(200).json({ id: user.id, name: user.name, email: user.email });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
