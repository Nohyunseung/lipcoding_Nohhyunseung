@echo off
title 멘토-멘티 매칭 플랫폼 - 전체 실행
echo ========================================
echo   멘토-멘티 매칭 플랫폼 시작
echo ========================================
echo.

:: Check if Node.js is installed
echo 🔍 Node.js 설치 확인 중...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js가 설치되어 있지 않습니다.
    echo Node.js를 다운로드하여 설치해주세요: https://nodejs.org/
    pause
    exit /b 1
)

:: Check if Python is installed
echo 🔍 Python 설치 확인 중...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Python이 설치되어 있지 않습니다.
    echo 프론트엔드 서버 실행을 위해 Python 설치를 권장합니다.
    echo 또는 다른 HTTP 서버를 사용하세요.
)

echo.
echo 1. 백엔드 서버 시작 중...
cd /d "%~dp0\backend"
if not exist node_modules (
    echo 백엔드 의존성 설치 중...
    npm install
)

:: Start backend server in background
echo 백엔드 서버를 백그라운드에서 시작합니다...
start "Backend Server" cmd /c "node server.js & pause"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

echo.
echo 2. 프론트엔드 서버 시작 중...
cd /d "%~dp0\frontend"

:: Start frontend server in background
echo 프론트엔드 서버를 백그라운드에서 시작합니다...
start "Frontend Server" cmd /c "python -m http.server 3000 & pause"

:: Wait a moment for frontend to start
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo 🚀 서버 시작 완료!
echo ========================================
echo.
echo 백엔드 서버: http://localhost:8080
echo 프론트엔드: http://localhost:3000
echo API 문서: http://localhost:8080/swagger-ui
echo.
echo 테스트 계정:
echo - 멘토: mentor@test.com / 123456
echo - 멘티: mentee@test.com / 123456
echo.
echo 브라우저에서 http://localhost:3000 으로 접속하세요!
echo.

:: Open browser automatically
echo 브라우저를 자동으로 열까요? (Y/N)
set /p openBrowser="선택: "
if /i "%openBrowser%"=="Y" (
    start http://localhost:3000
)

echo.
echo 서버를 종료하려면 각 콘솔 창에서 Ctrl+C를 누르세요.
echo 또는 이 창을 닫으면 됩니다.
pause
