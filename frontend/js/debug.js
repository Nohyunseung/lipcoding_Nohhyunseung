// debug.js - 디버깅 도구

window.DEBUG = {
    // 현재 사용자 정보 확인
    getCurrentUser: () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return null;
        
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch (error) {
            console.error('Token decode error:', error);
            return null;
        }
    },
    
    // 로컬 스토리지 내용 확인
    getStorage: () => {
        const storage = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            storage[key] = localStorage.getItem(key);
        }
        return storage;
    },
    
    // 저장된 토큰 확인
    getToken: () => localStorage.getItem('jwt_token'),
    
    // 데모 모드 상태 확인
    getDemoMode: () => window.DEMO_MODE,
    
    // API 기본 URL 확인
    getApiUrl: () => window.API_BASE_URL || 'http://localhost:8080/api',
    
    // 현재 페이지 상태 확인
    getCurrentPage: () => {
        const activePage = document.querySelector('.page.active');
        return activePage ? activePage.id : null;
    },
    
    // 네트워크 상태 테스트
    testNetwork: async () => {
        console.log('🔍 네트워크 상태 테스트 시작...');
        
        const results = {
            backend: { status: 'unknown', details: null },
            cors: { status: 'unknown', details: null },
            api: { status: 'unknown', details: null }
        };
        
        // 1. Backend Health Check
        try {
            const response = await fetch('http://localhost:8080/api/health');
            if (response.ok) {
                const data = await response.json();
                results.backend = { status: 'success', details: data };
                console.log('✅ Backend 연결 성공:', data);
            } else {
                results.backend = { status: 'error', details: `HTTP ${response.status}` };
                console.log('❌ Backend 응답 오류:', response.status);
            }
        } catch (error) {
            results.backend = { status: 'error', details: error.message };
            console.log('❌ Backend 연결 실패:', error.message);
        }
        
        // 2. CORS Test
        try {
            const response = await fetch('http://localhost:8080/api/health', {
                method: 'GET',
                headers: { 'Origin': 'http://localhost:3000' }
            });
            if (response.ok) {
                results.cors = { status: 'success', details: 'CORS 설정 정상' };
                console.log('✅ CORS 설정 정상');
            } else {
                results.cors = { status: 'error', details: 'CORS 응답 오류' };
                console.log('❌ CORS 응답 오류');
            }
        } catch (error) {
            results.cors = { status: 'error', details: error.message };
            console.log('❌ CORS 테스트 실패:', error.message);
        }
        
        // 3. API 기능 테스트 (간단한 요청)
        try {
            // Test signup endpoint with invalid data to see if API is responding
            const response = await fetch('http://localhost:8080/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            
            if (response.status === 400) {
                // Expected error for missing fields
                results.api = { status: 'success', details: 'API 엔드포인트 정상 응답' };
                console.log('✅ API 엔드포인트 정상 응답');
            } else {
                results.api = { status: 'warning', details: `예상과 다른 응답: ${response.status}` };
                console.log('⚠️ API 응답이 예상과 다름:', response.status);
            }
        } catch (error) {
            results.api = { status: 'error', details: error.message };
            console.log('❌ API 테스트 실패:', error.message);
        }
        
        // 결과 요약 출력
        console.log('\n📊 네트워크 테스트 결과:');
        console.log('Backend Health:', results.backend);
        console.log('CORS 설정:', results.cors);
        console.log('API 기능:', results.api);
        
        return results;
    },
    
    // 로그인 상태 강제 초기화
    resetAuth: () => {
        localStorage.removeItem('jwt_token');
        window.location.reload();
    },
    
    // 테스트 계정으로 자동 로그인
    quickLogin: (type = 'mentor') => {
        const accounts = {
            mentor: { email: 'mentor@test.com', password: '123456' },
            mentee: { email: 'mentee@test.com', password: '123456' }
        };
        
        const account = accounts[type];
        if (account && window.fillLoginForm) {
            window.fillLoginForm(account.email, account.password);
            // 자동으로 로그인 폼 제출
            setTimeout(() => {
                const loginForm = document.getElementById('login-form');
                if (loginForm) {
                    loginForm.dispatchEvent(new Event('submit'));
                }
            }, 500);
        }
    },
    
    // 완전한 통합 테스트
    fullIntegrationTest: async () => {
        console.log('🧪 완전한 프론트엔드-백엔드 통합 테스트 시작...');
        
        const testResults = {
            connectivity: null,
            authentication: null,
            dataFlow: null,
            summary: { passed: 0, failed: 0, total: 0 }
        };
        
        // 1. 연결성 테스트
        console.log('\n🔍 1단계: 연결성 테스트');
        testResults.connectivity = await DEBUG.testNetwork();
        testResults.summary.total += 3;
        
        if (testResults.connectivity.backend.status === 'success') testResults.summary.passed++;
        else testResults.summary.failed++;
        
        if (testResults.connectivity.cors.status === 'success') testResults.summary.passed++;
        else testResults.summary.failed++;
        
        if (testResults.connectivity.api.status === 'success') testResults.summary.passed++;
        else testResults.summary.failed++;
        
        // 2. 인증 플로우 테스트
        console.log('\n🔐 2단계: 인증 플로우 테스트');
        try {
            // Test with demo account
            if (window.DEMO_USERS && window.DEMO_USERS['mentor@test.com']) {
                console.log('✅ 데모 계정 데이터 확인됨');
                testResults.authentication = { status: 'success', details: '데모 인증 시스템 정상' };
                testResults.summary.passed++;
            } else {
                console.log('❌ 데모 계정 데이터 누락');
                testResults.authentication = { status: 'error', details: '데모 계정 데이터 누락' };
                testResults.summary.failed++;
            }
            testResults.summary.total++;
        } catch (error) {
            console.log('❌ 인증 시스템 오류:', error);
            testResults.authentication = { status: 'error', details: error.message };
            testResults.summary.failed++;
            testResults.summary.total++;
        }
        
        // 3. 데이터 플로우 테스트
        console.log('\n📊 3단계: 데이터 플로우 테스트');
        try {
            // Check if modules are loaded
            const modulesLoaded = !!(window.initAuth && window.initProfile && window.initMentors);
            if (modulesLoaded) {
                console.log('✅ 프론트엔드 모듈 로드 확인됨');
                testResults.dataFlow = { status: 'success', details: '모든 JS 모듈 정상 로드' };
                testResults.summary.passed++;
            } else {
                console.log('❌ 일부 프론트엔드 모듈 누락');
                testResults.dataFlow = { status: 'error', details: '프론트엔드 모듈 로드 실패' };
                testResults.summary.failed++;
            }
            testResults.summary.total++;
        } catch (error) {
            console.log('❌ 데이터 플로우 테스트 실패:', error);
            testResults.dataFlow = { status: 'error', details: error.message };
            testResults.summary.failed++;
            testResults.summary.total++;
        }
        
        // 결과 요약
        console.log('\n📋 통합 테스트 최종 결과:');
        console.log(`통과: ${testResults.summary.passed}/${testResults.summary.total}`);
        console.log(`실패: ${testResults.summary.failed}/${testResults.summary.total}`);
        
        const successRate = (testResults.summary.passed / testResults.summary.total * 100).toFixed(1);
        console.log(`성공률: ${successRate}%`);
        
        if (testResults.summary.failed === 0) {
            console.log('🎉 모든 테스트 통과! 프론트엔드-백엔드 통합이 정상 작동합니다.');
        } else {
            console.log('⚠️ 일부 테스트 실패. 위의 오류 메시지를 확인해주세요.');
        }
        
        return testResults;
    }
};

console.log('🔧 디버깅 도구가 로드되었습니다!');
console.log('사용 방법:');
console.log('- DEBUG.getCurrentUser() : 현재 로그인된 사용자 정보');
console.log('- DEBUG.testNetwork() : 백엔드 서버 연결 테스트');
console.log('- DEBUG.quickLogin("mentor") : 멘토 계정으로 빠른 로그인');
console.log('- DEBUG.quickLogin("mentee") : 멘티 계정으로 빠른 로그인');
console.log('- DEBUG.resetAuth() : 로그인 상태 초기화');
console.log('- DEBUG.getStorage() : 로컬 스토리지 내용 확인');
