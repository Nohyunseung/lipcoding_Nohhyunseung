const express = require('express');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../utils/jwt');

const router = express.Router();

// POST /api/match-requests (mentee only)
router.post('/match-requests', authenticateToken, (req, res) => {
  try {
    // Check if user is mentee
    if (req.user.role !== 'mentee') {
      return res.status(403).json({
        error: 'Access denied',
        details: 'Only mentees can send match requests'
      });
    }
    
    const { mentorId, menteeId, message } = req.body;
    const userId = parseInt(req.user.sub);
    
    // Validation
    if (!mentorId || !menteeId || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: 'mentorId, menteeId, and message are required'
      });
    }
    
    if (menteeId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        details: 'Cannot send request on behalf of another user'
      });
    }
    
    const db = getDatabase();
    
    // Check if mentor exists
    db.get('SELECT id, role FROM users WHERE id = ?', [mentorId], (err, mentor) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          error: 'Database error',
          details: 'Failed to verify mentor'
        });
      }
      
      if (!mentor) {
        return res.status(400).json({
          error: 'Mentor not found',
          details: 'The specified mentor does not exist'
        });
      }
      
      if (mentor.role !== 'mentor') {
        return res.status(400).json({
          error: 'Invalid mentor',
          details: 'The specified user is not a mentor'
        });
      }
      
      // Check if request already exists
      db.get('SELECT id FROM match_requests WHERE mentor_id = ? AND mentee_id = ?', [mentorId, menteeId], (err, existing) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            error: 'Database error',
            details: 'Failed to check existing request'
          });
        }
        
        if (existing) {
          return res.status(400).json({
            error: 'Request already exists',
            details: 'You have already sent a request to this mentor'
          });
        }
        
        // Check if mentee has any pending requests
        db.get('SELECT id FROM match_requests WHERE mentee_id = ? AND status = "pending"', [menteeId], (err, pendingRequest) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
              error: 'Database error',
              details: 'Failed to check pending requests'
            });
          }
          
          if (pendingRequest) {
            return res.status(400).json({
              error: 'Pending request exists',
              details: 'You can only have one pending request at a time'
            });
          }
          
          // Create new match request
          db.run(
            'INSERT INTO match_requests (mentor_id, mentee_id, message, status) VALUES (?, ?, ?, "pending")',
            [mentorId, menteeId, message],
            function(err) {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                  error: 'Database error',
                  details: 'Failed to create match request'
                });
              }
              
              const response = {
                id: this.lastID,
                mentorId: mentorId,
                menteeId: menteeId,
                message: message,
                status: 'pending'
              };
              
              res.json(response);
            }
          );
        });
      });
    });
    
  } catch (error) {
    console.error('Create match request error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred'
    });
  }
});

// GET /api/match-requests/incoming (mentor only)
router.get('/match-requests/incoming', authenticateToken, (req, res) => {
  try {
    // Check if user is mentor
    if (req.user.role !== 'mentor') {
      return res.status(403).json({
        error: 'Access denied',
        details: 'Only mentors can view incoming requests'
      });
    }
    
    const userId = parseInt(req.user.sub);
    const db = getDatabase();
    
    db.all(
      'SELECT * FROM match_requests WHERE mentor_id = ? ORDER BY created_at DESC',
      [userId],
      (err, requests) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            error: 'Database error',
            details: 'Failed to query incoming requests'
          });
        }
        
        const response = requests.map(req => ({
          id: req.id,
          mentorId: req.mentor_id,
          menteeId: req.mentee_id,
          message: req.message,
          status: req.status
        }));
        
        res.json(response);
      }
    );
    
  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred'
    });
  }
});

// GET /api/match-requests/outgoing (mentee only)
router.get('/match-requests/outgoing', authenticateToken, (req, res) => {
  try {
    // Check if user is mentee
    if (req.user.role !== 'mentee') {
      return res.status(403).json({
        error: 'Access denied',
        details: 'Only mentees can view outgoing requests'
      });
    }
    
    const userId = parseInt(req.user.sub);
    const db = getDatabase();
    
    db.all(
      'SELECT * FROM match_requests WHERE mentee_id = ? ORDER BY created_at DESC',
      [userId],
      (err, requests) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            error: 'Database error',
            details: 'Failed to query outgoing requests'
          });
        }
        
        const response = requests.map(req => ({
          id: req.id,
          mentorId: req.mentor_id,
          menteeId: req.mentee_id,
          status: req.status
        }));
        
        res.json(response);
      }
    );
    
  } catch (error) {
    console.error('Get outgoing requests error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred'
    });
  }
});

// PUT /api/match-requests/:id/accept (mentor only)
router.put('/match-requests/:id/accept', authenticateToken, (req, res) => {
  try {
    // Check if user is mentor
    if (req.user.role !== 'mentor') {
      return res.status(403).json({
        error: 'Access denied',
        details: 'Only mentors can accept requests'
      });
    }
    
    const requestId = parseInt(req.params.id);
    const userId = parseInt(req.user.sub);
    const db = getDatabase();
    
    // Check if request exists and belongs to this mentor
    db.get('SELECT * FROM match_requests WHERE id = ? AND mentor_id = ?', [requestId, userId], (err, request) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          error: 'Database error',
          details: 'Failed to query request'
        });
      }
      
      if (!request) {
        return res.status(404).json({
          error: 'Request not found',
          details: 'The specified request does not exist or does not belong to you'
        });
      }
      
      if (request.status !== 'pending') {
        return res.status(400).json({
          error: 'Request already processed',
          details: 'This request has already been accepted or rejected'
        });
      }
      
      // Check if mentor already has an accepted request
      db.get('SELECT id FROM match_requests WHERE mentor_id = ? AND status = "accepted"', [userId], (err, existingAccepted) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            error: 'Database error',
            details: 'Failed to check existing accepted requests'
          });
        }
        
        if (existingAccepted) {
          return res.status(400).json({
            error: 'Already matched',
            details: 'You have already accepted a request from another mentee'
          });
        }
        
        // Accept the request
        db.run(
          'UPDATE match_requests SET status = "accepted", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [requestId],
          function(err) {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({
                error: 'Database error',
                details: 'Failed to accept request'
              });
            }
            
            // Reject all other pending requests for this mentor
            db.run(
              'UPDATE match_requests SET status = "rejected", updated_at = CURRENT_TIMESTAMP WHERE mentor_id = ? AND id != ? AND status = "pending"',
              [userId, requestId],
              (err) => {
                if (err) {
                  console.error('Database error (rejecting others):', err);
                  // Continue anyway, the main request was accepted
                }
                
                const response = {
                  id: request.id,
                  mentorId: request.mentor_id,
                  menteeId: request.mentee_id,
                  message: request.message,
                  status: 'accepted'
                };
                
                res.json(response);
              }
            );
          }
        );
      });
    });
    
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred'
    });
  }
});

// PUT /api/match-requests/:id/reject (mentor only)
router.put('/match-requests/:id/reject', authenticateToken, (req, res) => {
  try {
    // Check if user is mentor
    if (req.user.role !== 'mentor') {
      return res.status(403).json({
        error: 'Access denied',
        details: 'Only mentors can reject requests'
      });
    }
    
    const requestId = parseInt(req.params.id);
    const userId = parseInt(req.user.sub);
    const db = getDatabase();
    
    // Check if request exists and belongs to this mentor
    db.get('SELECT * FROM match_requests WHERE id = ? AND mentor_id = ?', [requestId, userId], (err, request) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          error: 'Database error',
          details: 'Failed to query request'
        });
      }
      
      if (!request) {
        return res.status(404).json({
          error: 'Request not found',
          details: 'The specified request does not exist or does not belong to you'
        });
      }
      
      if (request.status !== 'pending') {
        return res.status(400).json({
          error: 'Request already processed',
          details: 'This request has already been accepted or rejected'
        });
      }
      
      // Reject the request
      db.run(
        'UPDATE match_requests SET status = "rejected", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [requestId],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
              error: 'Database error',
              details: 'Failed to reject request'
            });
          }
          
          const response = {
            id: request.id,
            mentorId: request.mentor_id,
            menteeId: request.mentee_id,
            message: request.message,
            status: 'rejected'
          };
          
          res.json(response);
        }
      );
    });
    
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred'
    });
  }
});

// DELETE /api/match-requests/:id (mentee only)
router.delete('/match-requests/:id', authenticateToken, (req, res) => {
  try {
    // Check if user is mentee
    if (req.user.role !== 'mentee') {
      return res.status(403).json({
        error: 'Access denied',
        details: 'Only mentees can cancel requests'
      });
    }
    
    const requestId = parseInt(req.params.id);
    const userId = parseInt(req.user.sub);
    const db = getDatabase();
    
    // Check if request exists and belongs to this mentee
    db.get('SELECT * FROM match_requests WHERE id = ? AND mentee_id = ?', [requestId, userId], (err, request) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          error: 'Database error',
          details: 'Failed to query request'
        });
      }
      
      if (!request) {
        return res.status(404).json({
          error: 'Request not found',
          details: 'The specified request does not exist or does not belong to you'
        });
      }
      
      // Update status to cancelled
      db.run(
        'UPDATE match_requests SET status = "cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [requestId],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
              error: 'Database error',
              details: 'Failed to cancel request'
            });
          }
          
          const response = {
            id: request.id,
            mentorId: request.mentor_id,
            menteeId: request.mentee_id,
            message: request.message,
            status: 'cancelled'
          };
          
          res.json(response);
        }
      );
    });
    
  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: 'An unexpected error occurred'
    });
  }
});

module.exports = router;
