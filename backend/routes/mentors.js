const express = require('express');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../utils/jwt');

const router = express.Router();

// GET /api/mentors (mentee only)
router.get('/mentors', authenticateToken, (req, res) => {
  try {
    // Check if user is mentee
    if (req.user.role !== 'mentee') {
      return res.status(403).json({
        error: 'Access denied',
        details: 'Only mentees can access mentor list'
      });
    }
    
    const { skill, orderBy } = req.query;
    const db = getDatabase();
    
    let query = `
      SELECT u.id, u.email, u.name, u.bio, u.role, u.skills,
             CASE WHEN u.image_data IS NOT NULL 
                  THEN '/api/images/mentor/' || u.id 
                  ELSE 'https://placehold.co/500x500.jpg?text=MENTOR' 
             END as imageUrl
      FROM users u
      WHERE u.role = 'mentor'
    `;
    
    let queryParams = [];
    
    // Add skill filter if provided
    if (skill) {
      query += ` AND (u.skills LIKE ? OR u.skills IS NULL)`;
      queryParams.push(`%${skill}%`);
    }
    
    // Add ordering
    if (orderBy === 'name') {
      query += ' ORDER BY u.name ASC';
    } else if (orderBy === 'skill') {
      query += ' ORDER BY u.skills ASC';
    } else {
      query += ' ORDER BY u.id ASC';
    }
    
    db.all(query, queryParams, (err, mentors) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          error: 'Database error',
          details: 'Failed to query mentors'
        });
      }
      
      // Build response with parsed skills
      const response = mentors.map(mentor => {
        let skills = [];
        if (mentor.skills) {
          try {
            skills = JSON.parse(mentor.skills);
          } catch (e) {
            skills = [];
          }
        }
        
        return {
          id: mentor.id,
          email: mentor.email,
          role: mentor.role,
          profile: {
            name: mentor.name || '',
            bio: mentor.bio || '',
            imageUrl: mentor.imageUrl,
            skills: skills
          }
        };
      });
      
      res.json(response);
    });
    
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred'
    });
  }
});

module.exports = router;
