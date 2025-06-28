const express = require('express');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../utils/jwt');

const router = express.Router();

// GET /api/me
router.get('/me', authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    const userId = parseInt(req.user.sub);
    
    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          error: 'Database error',
          details: 'Failed to query user'
        });
      }
      
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          details: 'User does not exist'
        });
      }
      
      // Parse skills for mentors
      let skills = [];
      if (user.role === 'mentor' && user.skills) {
        try {
          skills = JSON.parse(user.skills);
        } catch (e) {
          skills = [];
        }
      }
      
      const response = {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: {
          name: user.name || '',
          bio: user.bio || '',
          imageUrl: user.image_data ? `/api/images/${user.role}/${user.id}` : 
            (user.role === 'mentor' ? 
              `https://placehold.co/500x500.jpg?text=MENTOR` : 
              `https://placehold.co/500x500.jpg?text=MENTEE`),
          ...(user.role === 'mentor' && { skills })
        }
      };
      
      res.json(response);
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred'
    });
  }
});

// GET /api/images/:role/:id
router.get('/images/:role/:id', authenticateToken, (req, res) => {
  try {
    const { role, id } = req.params;
    const userId = parseInt(id);
    
    if (!['mentor', 'mentee'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        details: 'Role must be mentor or mentee'
      });
    }
    
    const db = getDatabase();
    
    db.get('SELECT image_data, image_type FROM users WHERE id = ? AND role = ?', [userId, role], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          error: 'Database error',
          details: 'Failed to query image'
        });
      }
      
      if (!user || !user.image_data) {
        // Redirect to default placeholder
        const defaultUrl = role === 'mentor' 
          ? 'https://placehold.co/500x500.jpg?text=MENTOR'
          : 'https://placehold.co/500x500.jpg?text=MENTEE';
        return res.redirect(defaultUrl);
      }
      
      res.set('Content-Type', user.image_type || 'image/jpeg');
      res.send(user.image_data);
    });
    
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred'
    });
  }
});

// PUT /api/profile
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const userId = parseInt(req.user.sub);
    const { id, name, role, bio, image, skills } = req.body;
    
    // Validation
    if (!id || !name || !role || !bio) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'ID, name, role, and bio are required'
      });
    }
    
    if (id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        details: 'Cannot update another user\'s profile'
      });
    }
    
    if (!['mentor', 'mentee'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        details: 'Role must be mentor or mentee'
      });
    }
    
    if (role === 'mentor' && (!skills || !Array.isArray(skills))) {
      return res.status(400).json({
        error: 'Skills required',
        details: 'Mentors must provide skills array'
      });
    }
    
    const db = getDatabase();
    
    // Process image if provided
    let imageData = null;
    let imageType = null;
    
    if (image && image.length > 0) {
      try {
        // Validate base64 format
        const matches = image.match(/^data:image\/(jpeg|jpg|png);base64,(.+)$/);
        if (!matches) {
          return res.status(400).json({
            error: 'Invalid image format',
            details: 'Image must be base64 encoded JPEG or PNG'
          });
        }
        
        imageType = `image/${matches[1]}`;
        imageData = Buffer.from(matches[2], 'base64');
        
        // Check image size (max 1MB)
        if (imageData.length > 1024 * 1024) {
          return res.status(400).json({
            error: 'Image too large',
            details: 'Image must be less than 1MB'
          });
        }
      } catch (imageError) {
        return res.status(400).json({
          error: 'Invalid image data',
          details: 'Failed to process image'
        });
      }
    }
    
    // Prepare skills JSON for mentors
    let skillsJson = '[]';
    if (role === 'mentor' && skills && Array.isArray(skills)) {
      skillsJson = JSON.stringify(skills);
    }
    
    // Update user profile
    const updateQuery = imageData 
      ? 'UPDATE users SET name = ?, bio = ?, skills = ?, image_data = ?, image_type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      : 'UPDATE users SET name = ?, bio = ?, skills = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
    
    const updateParams = imageData 
      ? [name, bio, skillsJson, imageData, imageType, userId]
      : [name, bio, skillsJson, userId];
    
    db.run(updateQuery, updateParams, function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          error: 'Database error',
          details: 'Failed to update profile'
        });
      }
      
      // Return updated profile
      const response = {
        id: userId,
        email: req.user.email,
        role: role,
        profile: {
          name: name,
          bio: bio,
          imageUrl: imageData ? `/api/images/${role}/${userId}` : 
            (role === 'mentor' ? 
              `https://placehold.co/500x500.jpg?text=MENTOR` : 
              `https://placehold.co/500x500.jpg?text=MENTEE`),
          ...(role === 'mentor' && { skills: skills || [] })
        }
      };
      res.json(response);
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred'
    });
  }
});

module.exports = router;
