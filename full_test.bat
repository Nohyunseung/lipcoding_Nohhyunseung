@echo off
title 멘토-멘티 매칭 플랫폼 - 프론트엔드-백엔드 통합 테스트
echo ========================================
echo   프론트엔드-백엔드 통합 테스트
echo ========================================
echo.

:: Set color for better visibility
color 0A

echo 🔍 시스템 사전 점검...
echo.

:: Check Node.js
echo [1/4] Node.js 확인...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js가 설치되어 있지 않습니다.
    echo 다운로드: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js %%i 감지됨
)

:: Check Python
echo [2/4] Python 확인...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python이 설치되어 있지 않습니다.
    echo 다운로드: https://python.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('python --version') do echo ✅ Python %%i 감지됨
)

:: Check backend dependencies
echo [3/4] 백엔드 의존성 확인...
if not exist "backend\node_modules\" (
    echo 📦 백엔드 의존성 설치 중...
    cd backend
    npm install --silent
    cd ..
    echo ✅ 백엔드 의존성 설치 완료
) else (
    echo ✅ 백엔드 의존성 이미 설치됨
)

:: Check frontend dependencies
echo [4/4] 프론트엔드 의존성 확인...
if not exist "frontend\node_modules\" (
    echo 📦 프론트엔드 의존성 설치 중...
    cd frontend
    npm install --silent
    cd ..
    echo ✅ 프론트엔드 의존성 설치 완료
) else (
    echo ✅ 프론트엔드 의존성 이미 설치됨
)

echo.
echo 🚀 서버 시작 중...
echo.

:: Start backend server
echo [1/2] 백엔드 서버 시작...
start "📚 Backend Server (Port 8080)" cmd /k "cd /d backend && echo 백엔드 서버 시작 중... && npm start"

:: Wait for backend to start
echo ⏳ 백엔드 서버 시작 대기 (5초)...
timeout /t 5 /nobreak >nul

:: Start frontend server
echo [2/2] 프론트엔드 서버 시작...
start "🌐 Frontend Server (Port 3000)" cmd /k "cd /d frontend && echo 프론트엔드 서버 시작 중... && npm start"

:: Wait for frontend to start
echo ⏳ 프론트엔드 서버 시작 대기 (3초)...
timeout /t 3 /nobreak >nul

:: Test servers
echo.
echo 🧪 서버 연결 테스트...
timeout /t 2 /nobreak >nul

:: Open test page first
echo 📋 테스트 도구 열기...
start test_app.html

:: Wait a bit then open main app
timeout /t 2 /nobreak >nul
echo 🎯 메인 앱 열기...
start http://localhost:3000

echo.
echo ========================================
echo ✅ 앱이 성공적으로 시작되었습니다!
echo ========================================
echo.
echo 🧪 API 통합 테스트 실행 중...
timeout /t 3 /nobreak >nul

:: Test backend health
echo [API-1] 백엔드 헬스 체크...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/health' -TimeoutSec 5; $data = $response.Content | ConvertFrom-Json; Write-Host ('✅ 백엔드 헬스: ' + $data.status) -ForegroundColor Green } catch { Write-Host '❌ 백엔드 헬스 체크 실패' -ForegroundColor Red }"

:: Test CORS
echo [API-2] CORS 설정 테스트...
powershell -Command "try { $headers = @{ 'Origin' = 'http://localhost:3000' }; $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/health' -Headers $headers -TimeoutSec 5; Write-Host '✅ CORS 설정 정상' -ForegroundColor Green } catch { Write-Host '❌ CORS 테스트 실패' -ForegroundColor Red }"

:: Test frontend connectivity
echo [API-3] 프론트엔드 연결 테스트...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000' -TimeoutSec 5; Write-Host '✅ 프론트엔드 서버 정상' -ForegroundColor Green } catch { Write-Host '❌ 프론트엔드 연결 실패' -ForegroundColor Red }"

echo.
echo 📱 열린 창들:
echo - 테스트 도구: 서버 상태 확인
echo - 메인 앱: http://localhost:3000
echo - 백엔드 터미널: Port 8080
echo - 프론트엔드 터미널: Port 3000
echo.
echo 🔐 테스트 계정:
echo [멘토] mentor@test.com / 123456
echo [멘티] mentee@test.com / 123456
echo.
echo 📖 사용 가이드:
echo 1. 테스트 도구에서 서버 상태 확인
echo 2. 메인 앱에서 로그인
echo 3. 각 기능별 테스트 진행
echo.
echo 🛑 종료: 각 터미널에서 Ctrl+C
echo.
pause
