const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!', status: 'OK' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Simple login endpoint for testing
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Demo users
  const demoUsers = {
    'mentor@test.com': { role: 'mentor', name: '김멘토', id: 1 },
    'mentee@test.com': { role: 'mentee', name: '이멘티', id: 2 }
  };
  
  if (demoUsers[email] && password === '123456') {
    const user = demoUsers[email];
    const token = `demo-token-${user.id}-${Date.now()}`;
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email, 
        name: user.name, 
        role: user.role 
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Simple mentors endpoint
app.get('/api/mentors', (req, res) => {
  const mentors = [
    {
      id: 1,
      name: '김멘토',
      email: 'mentor@test.com',
      bio: '10년 경력의 풀스택 개발자입니다.',
      skills: ['React', 'Node.js', 'Python']
    },
    {
      id: 3,
      name: '박개발',
      email: 'dev@test.com',
      bio: '모바일 앱 개발 전문가입니다.',
      skills: ['React Native', 'Flutter', 'Swift']
    }
  ];
  res.json(mentors);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple backend server running on http://localhost:${PORT}`);
  console.log(`✅ Test login: POST http://localhost:${PORT}/api/login`);
  console.log(`✅ Test mentors: GET http://localhost:${PORT}/api/mentors`);
});

module.exports = app;
