const express = require('express');
const bcrypt = require('bcryptjs');
const { getDatabase } = require('../database/init');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

// POST /api/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'Email, password, name, and role are required'
      });
    }
    
    if (!['mentor', 'mentee'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        details: 'Role must be either "mentor" or "mentee"'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password too short',
        details: 'Password must be at least 6 characters long'
      });
    }
    
    const db = getDatabase();
    
    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          error: 'Database error',
          details: 'Failed to check existing user'
        });
      }
      
      if (existingUser) {
        return res.status(400).json({
          error: 'User already exists',
          details: 'A user with this email already exists'
        });
      }
      
      try {
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Insert new user
        db.run(
          'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
          [email, hashedPassword, name, role],
          function(err) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({
                error: 'Failed to create user',
                details: 'Database insertion failed'
              });
            }
            
            res.status(201).json({
              message: 'User created successfully',
              userId: this.lastID
            });
          }
        );
      } catch (hashError) {
        console.error('Password hashing error:', hashError);
        res.status(500).json({
          error: 'Internal server error',
          details: 'Failed to process password'
        });
      }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred'
    });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        details: 'Email and password are required'
      });
    }
    
    const db = getDatabase();
    
    // Find user by email
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          error: 'Database error',
          details: 'Failed to query user'
        });
      }
      
      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials',
          details: 'Email or password is incorrect'
        });
      }
      
      try {
        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
          return res.status(401).json({
            error: 'Invalid credentials',
            details: 'Email or password is incorrect'
          });
        }
        
        // Generate JWT token
        const token = generateToken({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        });
        
        res.json({
          token
        });
        
      } catch (compareError) {
        console.error('Password comparison error:', compareError);
        res.status(500).json({
          error: 'Internal server error',
          details: 'Failed to verify password'
        });
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred'
    });
  }
});

module.exports = router;
