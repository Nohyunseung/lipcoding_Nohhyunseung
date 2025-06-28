// check.js - 백엔드 상태 체크 도구

const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🔍 백엔드 상태 체크를 시작합니다...\n');

// 1. 파일 존재 확인
const requiredFiles = [
    'server.js',
    'package.json',
    'database/init.js',
    'routes/auth.js',
    'routes/profile.js',
    'routes/mentors.js',
    'routes/matchRequests.js'
];

console.log('📁 필수 파일 확인:');
let allFilesExist = true;
requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
});

// 2. package.json 의존성 확인
console.log('\n📦 의존성 확인:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
    'express', 'cors', 'helmet', 'jsonwebtoken', 
    'bcryptjs', 'sqlite3', 'multer', 'swagger-ui-express', 'yamljs'
];

requiredDeps.forEach(dep => {
    const exists = packageJson.dependencies[dep];
    console.log(`  ${exists ? '✅' : '❌'} ${dep} ${exists || 'missing'}`);
});

// 3. node_modules 확인
console.log('\n📚 모듈 설치 확인:');
const nodeModulesExists = fs.existsSync('node_modules');
console.log(`  ${nodeModulesExists ? '✅' : '❌'} node_modules 디렉토리`);

if (nodeModulesExists) {
    requiredDeps.forEach(dep => {
        const moduleExists = fs.existsSync(path.join('node_modules', dep));
        console.log(`  ${moduleExists ? '✅' : '❌'} ${dep} 모듈`);
    });
}

// 4. 데이터베이스 확인
console.log('\n🗄️ 데이터베이스 확인:');
const dbExists = fs.existsSync('database.sqlite');
console.log(`  ${dbExists ? '✅' : '❌'} database.sqlite`);

// 5. 서버 실행 테스트
console.log('\n🚀 서버 실행 테스트:');

function testServer() {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 8080,
            path: '/api/health',
            method: 'GET',
            timeout: 3000
        }, (res) => {
            console.log(`  ✅ 서버 응답: ${res.statusCode}`);
            resolve(true);
        });

        req.on('error', (err) => {
            console.log(`  ❌ 서버 연결 실패: ${err.code}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log(`  ❌ 서버 응답 시간 초과`);
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

// 결과 요약
async function showSummary() {
    const serverRunning = await testServer();
    
    console.log('\n==========================================');
    console.log('📊 백엔드 상태 요약');
    console.log('==========================================');
    
    const issues = [];
    
    if (!allFilesExist) issues.push('필수 파일 누락');
    if (!nodeModulesExists) issues.push('의존성 미설치');
    if (!dbExists) issues.push('데이터베이스 미생성');
    if (!serverRunning) issues.push('서버 미실행');
    
    if (issues.length === 0) {
        console.log('✅ 모든 항목이 정상입니다!');
        console.log('🌐 API 문서: http://localhost:8080/swagger-ui');
    } else {
        console.log('❌ 다음 문제들을 해결해야 합니다:');
        issues.forEach(issue => console.log(`  - ${issue}`));
        
        console.log('\n🔧 해결 방법:');
        if (!nodeModulesExists) {
            console.log('  1. npm install 실행');
        }
        if (!dbExists) {
            console.log('  2. 데이터베이스 초기화');
        }
        if (!serverRunning) {
            console.log('  3. node server.js 실행');
        }
    }
    
    console.log('\n💡 도움말:');
    console.log('  - setup.bat: 자동 환경 설정');
    console.log('  - start_server.bat: 서버 시작');
    console.log('  - node check.js: 상태 재확인');
}

showSummary();
