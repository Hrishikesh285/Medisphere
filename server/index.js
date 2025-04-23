import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock MongoDB connection
// In a real app, this would connect to your MongoDB database
console.log('Setting up mock MongoDB connection for demonstration');

// Mock user model
const mockUsers = [
  {
    _id: '1',
    name: 'Ravi Kumar',
    email: 'ravikumar@example.com',
    password: bcrypt.hashSync('Ravi@123', 10),
    healthConditions: ['Hypertension', 'Type 2 Diabetes'],
    emergencyContact: {
      name: 'Priya Kumar',
      phone: '+91 98765 43210',
      relationship: 'Spouse'
    },
    createdAt: new Date()
  }
];

// Routes
app.get('/', (req, res) => {
  res.send('MediSphere API is running');
});

// Login route
app.post('/api/user/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = mockUsers.find(u => u.email === email);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Check password
  const isMatch = bcrypt.compareSync(password, user.password);
  
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  // Generate token
  const token = jwt.sign({ id: user._id }, 'medisphere_secret_key', { expiresIn: '1d' });
  
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;
  
  res.json({
    token,
    user: userWithoutPassword
  });
});

// Get user profile
app.get('/api/user/profile', authenticate, (req, res) => {
  const user = mockUsers.find(u => u._id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;
  
  res.json(userWithoutPassword);
});

// Authentication middleware
function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'medisphere_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`This is a demo server for the MediSphere application`);
  console.log(`For a real implementation, you would connect to MongoDB Atlas`);
});