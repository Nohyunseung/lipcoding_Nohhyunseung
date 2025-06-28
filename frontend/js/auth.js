// auth.js - Authentication handling

const API_BASE_URL = 'http://localhost:8080/api';

// Demo mode for offline testing
const DEMO_MODE = true; // Set to true for offline demo
window.DEMO_MODE = DEMO_MODE; // Make it globally available
const DEMO_USERS = {
    'mentor@test.com': {
        password: '123456',
        user: {
            id: 1,
            email: 'mentor@test.com',
            name: '김멘토',
            role: 'mentor',
            bio: '10년 경력의 풀스택 개발자입니다. React, Node.js, Python을 전문으로 합니다.',
            skills: ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript']
        }
    },
    'mentee@test.com': {
        password: '123456',
        user: {
            id: 2,
            email: 'mentee@test.com',
            name: '이멘티',
            role: 'mentee',
            bio: '프론트엔드 개발을 배우고 있는 신입 개발자입니다.',
            skills: ['HTML', 'CSS', 'JavaScript']
        }
    }
};

// Token management
function getToken() {
    return localStorage.getItem('jwt_token');
}

function setToken(token) {
    localStorage.setItem('jwt_token', token);
}

function removeToken() {
    localStorage.removeItem('jwt_token');
}

function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}

function isTokenValid(token) {
    if (!token) return false;
    
    const decoded = decodeToken(token);
    if (!decoded) return false;
    
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
}

// Check authentication status
function isAuthenticated() {
    const token = getToken();
    return isTokenValid(token);
}

function getCurrentUser() {
    const token = getToken();
    if (!isTokenValid(token)) return null;
    return decodeToken(token);
}

// Login function
async function login(email, password) {
    try {
        showLoading(true);
        
        // Demo mode handling (offline mode)
        if (DEMO_MODE) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
            
            if (DEMO_USERS[email] && DEMO_USERS[email].password === password) {
                const demoUser = DEMO_USERS[email];
                const token = 'demo-token.' + btoa(JSON.stringify({ 
                    id: demoUser.user.id, 
                    email: demoUser.user.email, 
                    name: demoUser.user.name, 
                    role: demoUser.user.role,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
                }));
                
                setToken(token);
                showToast('로그인 성공! (데모 모드)', 'success');
                return { success: true };
            } else {
                showToast('비밀번호가 일치하지 않습니다', 'error');
                return { success: false, error: 'Invalid password' };
            }
        }
        
        // Try real backend if not in demo mode
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setToken(data.token);
                showToast('로그인 성공!', 'success');
                return { success: true };
            } else {
                showToast(data.error || '로그인 실패', 'error');
                return { success: false, error: data.error };
            }
        } catch (networkError) {
            // Fallback to demo mode if backend is not available
            console.warn('Backend not available, falling back to demo mode:', networkError);
            
            // Show user that we're using demo mode
            if (!window.demoModeNotified) {
                showToast('🌐 백엔드 서버에 연결할 수 없어 데모 모드로 전환합니다', 'warning', 5000);
                window.demoModeNotified = true;
                
                // Show demo banner
                if (window.showDemoBanner) {
                    window.showDemoBanner();
                }
            }
            
            if (DEMO_USERS[email] && DEMO_USERS[email].password === password) {
                const demoUser = DEMO_USERS[email];
                const token = 'demo-token.' + btoa(JSON.stringify({ 
                    id: demoUser.user.id, 
                    email: demoUser.user.email, 
                    name: demoUser.user.name, 
                    role: demoUser.user.role,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60)
                }));
                
                setToken(token);
                showToast('로그인 성공! (데모 모드)', 'success');
                return { success: true };
            } else {
                showToast('잘못된 계정 정보입니다', 'error');
                return { success: false, error: 'Invalid credentials' };
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('로그인 중 오류가 발생했습니다', 'error');
        return { success: false, error: 'Login error' };
    } finally {
        showLoading(false);
    }
}

// Signup function
async function signup(email, password, name, role) {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, name, role })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('회원가입 성공! 로그인해주세요.', 'success');
            return { success: true };
        } else {
            showToast(data.error || '회원가입 실패', 'error');
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('Signup error:', error);
        showToast('네트워크 오류가 발생했습니다', 'error');
        return { success: false, error: 'Network error' };
    } finally {
        showLoading(false);
    }
}

// Logout function
function logout() {
    removeToken();
    showToast('로그아웃되었습니다', 'success');
    showPage('login');
    document.getElementById('navbar').style.display = 'none';
}

// API request helper with authentication
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    
    if (!isTokenValid(token)) {
        logout();
        throw new Error('Token expired');
    }
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (response.status === 401) {
            logout();
            throw new Error('Unauthorized');
        }
        
        return response;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Check backend connectivity
async function checkBackendConnectivity() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            timeout: 5000
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ 백엔드 연결 성공:', data);
            return { connected: true, data };
        } else {
            console.warn('⚠️ 백엔드 응답 오류:', response.status);
            return { connected: false, error: `HTTP ${response.status}` };
        }
    } catch (error) {
        console.warn('❌ 백엔드 연결 실패:', error.message);
        return { connected: false, error: error.message };
    }
}

// Initialize backend connection check
async function initBackendConnection() {
    const connectivity = await checkBackendConnectivity();
    
    if (connectivity.connected) {
        console.log('🌐 백엔드 서버 연결됨 - 실시간 모드');
        window.BACKEND_CONNECTED = true;
        
        // Hide demo banner if shown
        const demoBanner = document.getElementById('demo-banner');
        if (demoBanner) {
            demoBanner.style.display = 'none';
        }
    } else {
        console.log('🔄 백엔드 서버 연결 실패 - 데모 모드로 전환');
        window.BACKEND_CONNECTED = false;
        window.DEMO_MODE = true;
        
        // Show demo banner
        setTimeout(() => {
            if (window.showDemoBanner) {
                window.showDemoBanner();
            }
        }, 1000);
    }
    
    return connectivity;
}

// Fill login form with demo account
function fillLoginForm(email, password) {
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
    
    // Add visual feedback
    const inputs = document.querySelectorAll('#login-form input');
    inputs.forEach(input => {
        input.style.borderColor = '#667eea';
        input.style.background = '#f0f8ff';
        setTimeout(() => {
            input.style.borderColor = '';
            input.style.background = '';
        }, 1000);
    });
    
    showToast('테스트 계정 정보가 입력되었습니다', 'success');
}

// Make function globally available
window.fillLoginForm = fillLoginForm;

// Initialize auth event listeners
function initAuth() {
    // Login form
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const result = await login(email, password);
        if (result.success) {
            initializeApp();
        }
    });
    
    // Signup form
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const name = document.getElementById('signup-name').value;
        const role = document.getElementById('signup-role').value;
        
        const result = await signup(email, password, name, role);
        if (result.success) {
            showPage('login');
            loginForm.reset();
        }
    });
    
    // Show signup page
    document.getElementById('show-signup').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('signup');
    });
    
    // Show login page
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        showPage('login');
    });
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

// Initialize backend connection on load
window.addEventListener('load', async () => {
    await initBackendConnection();
    initAuth();
});
