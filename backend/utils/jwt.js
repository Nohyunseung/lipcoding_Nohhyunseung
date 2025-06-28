const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '1h';

// JWT claims according to RFC 7519
function generateToken(user) {
  const now = Math.floor(Date.now() / 1000);
  
  const payload = {
    // Standard claims (RFC 7519)
    iss: 'mentor-mentee-app',           // issuer
    sub: user.id.toString(),            // subject (user ID)
    aud: 'mentor-mentee-users',         // audience
    exp: now + (60 * 60),              // expiration time (1 hour)
    nbf: now,                          // not before
    iat: now,                          // issued at
    jti: `${user.id}-${now}`,          // JWT ID
    
    // Custom claims
    name: user.name,
    email: user.email,
    role: user.role
  };
  
  return jwt.sign(payload, JWT_SECRET);
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { success: true, decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Middleware for protecting routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      details: 'Please provide a valid JWT token in Authorization header'
    });
  }

  const result = verifyToken(token);
  if (!result.success) {
    return res.status(401).json({
      error: 'Invalid or expired token',
      details: result.error
    });
  }

  req.user = result.decoded;
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken
};
