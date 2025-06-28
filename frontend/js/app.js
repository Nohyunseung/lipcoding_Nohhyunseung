// app.js - Main application logic

// Global state
let currentPage = 'login';
let currentUser = null;

// Utility functions
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // Call page-specific initialization
        switch (pageName) {
            case 'profile':
                onProfilePageShow();
                break;
            case 'mentors':
                onMentorsPageShow();
                break;
            case 'requests':
                onRequestsPageShow();
                break;
        }
    }
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add icon based on type
    let iconClass = 'fas fa-info-circle';
    switch (type) {
        case 'success':
            iconClass = 'fas fa-check-circle';
            break;
        case 'error':
            iconClass = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            break;
    }
    
    toast.innerHTML = `
        <i class="${iconClass} toast-icon"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a[data-page]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            if (page) {
                showPage(page);
            }
        });
    });
}

// Setup navigation based on user role
function setupUserNavigation(user) {
    const mentorsLink = document.getElementById('mentors-link');
    
    if (user.role === 'mentee') {
        mentorsLink.style.display = 'inline';
    } else {
        mentorsLink.style.display = 'none';
    }
}

// Initialize authenticated app
function initializeApp() {
    if (!isAuthenticated()) {
        showPage('login');
        document.getElementById('navbar').style.display = 'none';
        return;
    }
    
    currentUser = getCurrentUser();
    if (!currentUser) {
        showPage('login');
        document.getElementById('navbar').style.display = 'none';
        return;
    }
    
    // Show navigation
    document.getElementById('navbar').style.display = 'block';
    setupUserNavigation(currentUser);
    
    // Show profile page by default
    showPage('profile');
}

// Initialize application
async function initApp() {
    console.log('🚀 앱 초기화 시작...');
    
    try {
        // Check backend connectivity first
        console.log('🔍 백엔드 연결 상태 확인 중...');
        if (window.initBackendConnection) {
            await window.initBackendConnection();
        }
        
        // Initialize all modules
        console.log('📦 모듈 초기화 중...');
        initAuth();
        initProfile();
        initMentors();
        initRequests();
        
        // Setup navigation
        console.log('🧭 네비게이션 설정 중...');
        setupNavigation();
        
        // Initialize mobile menu
        console.log('📱 모바일 메뉴 초기화 중...');
        initMobileMenu();
        
        // Check authentication and initialize
        console.log('🔐 인증 상태 확인 중...');
        initializeApp();
        
        console.log('✅ 앱 초기화 완료!');
        
        // Show connection status
        if (window.BACKEND_CONNECTED) {
            showToast('🌐 백엔드 서버에 연결되었습니다', 'success', 3000);
        } else {
            showToast('🔄 데모 모드로 실행됩니다', 'info', 5000);
        }
        
    } catch (error) {
        console.error('❌ 앱 초기화 실패:', error);
        showToast('앱 초기화 중 오류가 발생했습니다', 'error');
    }
}

// Show demo account info on page load
function showDemoAccountInfo() {
    if (window.DEMO_MODE) {
        setTimeout(() => {
            showToast('🎯 테스트 계정으로 바로 체험하세요! 로그인 폼 위의 계정을 클릭하면 자동 입력됩니다.', 'info', 5000);
        }, 1000);
    }
}

// Demo banner management
function showDemoBanner() {
    if (window.DEMO_MODE) {
        const banner = document.getElementById('demo-banner');
        const navbar = document.getElementById('navbar');
        const mainContent = document.getElementById('main-content');
        
        if (banner) {
            banner.style.display = 'block';
            banner.classList.add('show');
            
            // Adjust layout for banner
            if (navbar) {
                navbar.style.top = '45px';
            }
            if (mainContent) {
                mainContent.style.marginTop = '115px';
            }
        }
    }
}

function hideDemoBanner() {
    const banner = document.getElementById('demo-banner');
    const navbar = document.getElementById('navbar');
    const mainContent = document.getElementById('main-content');
    
    if (banner) {
        banner.style.display = 'none';
        banner.classList.remove('show');
        
        // Reset layout
        if (navbar) {
            navbar.style.top = '0';
        }
        if (mainContent) {
            mainContent.style.marginTop = '70px';
        }
    }
}

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
        showPage(e.state.page);
    }
});

// Handle page navigation with history
function navigateToPage(page) {
    showPage(page);
    history.pushState({ page }, '', `#${page}`);
}

// Handle initial page load
document.addEventListener('DOMContentLoaded', () => {
    // Show demo banner if in demo mode
    showDemoBanner();
    
    // Get page from URL hash
    const hash = window.location.hash.substring(1);
    if (hash && isAuthenticated()) {
        showPage(hash);
    }
    
    // Initialize app
    initApp();
    
    // Show demo account info if in demo mode
    showDemoAccountInfo();
});

// Handle authentication check on page visibility
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && currentPage !== 'login' && currentPage !== 'signup') {
        if (!isAuthenticated()) {
            logout();
        }
    }
});

// Mobile menu toggle functionality
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close mobile menu when clicking nav links
        navLinks.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
    }
}

// Export functions for use in other modules
window.showPage = showPage;
window.showLoading = showLoading;
window.showToast = showToast;
window.initializeApp = initializeApp;
window.navigateToPage = navigateToPage;
window.hideDemoBanner = hideDemoBanner;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Initialize all modules in correct order
    try {
        initApp();
        console.log('App initialized successfully');
    } catch (error) {
        console.error('App initialization failed:', error);
        showToast('앱 초기화 중 오류가 발생했습니다', 'error');
    }
});

// Fallback for older browsers or if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOM is still loading
    console.log('DOM is loading...');
} else {
    // DOM has already loaded
    console.log('DOM already loaded, initializing app...');
    setTimeout(() => {
        try {
            initApp();
            console.log('App initialized successfully (fallback)');
        } catch (error) {
            console.error('App initialization failed (fallback):', error);
            showToast('앱 초기화 중 오류가 발생했습니다', 'error');
        }
    }, 100);
}
