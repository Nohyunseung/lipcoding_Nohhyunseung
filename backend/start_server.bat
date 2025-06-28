@echo off
title 백엔드 서버 - 멘토-멘티 매칭 플랫폼
echo ==========================================
echo        백엔드 서버 시작
echo ==========================================
echo.

cd /d "%~dp0"

echo 🔍 Node.js 설치 확인 중...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js가 설치되어 있지 않습니다.
    echo Node.js를 다운로드하여 설치해주세요: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js 설치 확인됨

echo.
echo 📦 의존성 확인 중...
if not exist "node_modules" (
    echo 🔧 의존성을 설치합니다...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] 의존성 설치에 실패했습니다.
        pause
        exit /b 1
    )
    echo ✅ 의존성 설치 완료
) else (
    echo ✅ 의존성이 이미 설치되어 있습니다.
)

echo.
echo 🚀 백엔드 서버를 시작합니다...
echo 포트: 8080
echo API 문서: http://localhost:8080/swagger-ui
echo 종료하려면 Ctrl+C를 누르세요.
echo.
echo ==========================================

node server.js
pause
