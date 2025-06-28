@echo off
title 백엔드 설정 및 초기화
echo ==========================================
echo        백엔드 환경 설정
echo ==========================================
echo.

cd /d "%~dp0"

echo 🔍 시스템 요구사항 확인 중...

:: Node.js 확인
echo - Node.js 확인 중...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js가 설치되어 있지 않습니다.
    echo Node.js 다운로드: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=1" %%i in ('node --version') do echo   ✅ Node.js %%i 설치됨

:: npm 확인
echo - npm 확인 중...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm이 설치되어 있지 않습니다.
    pause
    exit /b 1
)
for /f "tokens=1" %%i in ('npm --version') do echo   ✅ npm %%i 설치됨

echo.
echo 📦 패키지 설치/확인 중...

:: node_modules 확인 및 설치
if not exist "node_modules" (
    echo 🔧 의존성 패키지를 설치합니다...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] 패키지 설치에 실패했습니다.
        echo 다음을 시도해보세요:
        echo 1. npm cache clean --force
        echo 2. 관리자 권한으로 실행
        pause
        exit /b 1
    )
    echo ✅ 의존성 설치 완료
) else (
    echo ✅ 의존성이 이미 설치되어 있습니다.
    
    :: package.json 변경 확인
    echo 🔄 의존성 업데이트 확인 중...
    npm outdated >nul 2>&1
    if %errorlevel% equ 0 (
        echo 📦 새로운 업데이트가 있습니다. npm update를 실행하시겠습니까? (y/n)
        set /p choice=
        if /i "%choice%"=="y" (
            npm update
        )
    )
)

echo.
echo 🗄️ 데이터베이스 확인 중...

:: 데이터베이스 파일 확인
if not exist "database.sqlite" (
    echo 🔧 데이터베이스를 초기화합니다...
    node -e "
    const { initializeDatabase } = require('./database/init');
    initializeDatabase().then(() => {
        console.log('✅ 데이터베이스 초기화 완료');
        process.exit(0);
    }).catch(err => {
        console.error('❌ 데이터베이스 초기화 실패:', err);
        process.exit(1);
    });
    "
    if %errorlevel% neq 0 (
        echo [ERROR] 데이터베이스 초기화에 실패했습니다.
        pause
        exit /b 1
    )
) else (
    echo ✅ 데이터베이스 파일이 존재합니다.
)

echo.
echo 🧪 서버 테스트 중...

:: 포트 8080 사용 여부 확인
netstat -an | find "8080" >nul
if %errorlevel% equ 0 (
    echo ⚠️ 포트 8080이 이미 사용 중입니다.
    echo 다른 서버를 종료하거나 포트를 변경해주세요.
    pause
    exit /b 1
)

echo ✅ 포트 8080 사용 가능

echo.
echo ==========================================
echo ✅ 백엔드 환경 설정이 완료되었습니다!
echo ==========================================
echo.
echo 🚀 서버를 시작하려면 start_server.bat를 실행하세요.
echo 📚 API 문서: http://localhost:8080/swagger-ui
echo.
echo 시작할까요? (y/n)
set /p start_choice=
if /i "%start_choice%"=="y" (
    echo.
    echo 🚀 서버를 시작합니다...
    node server.js
) else (
    echo.
    echo start_server.bat를 실행하여 서버를 시작할 수 있습니다.
)

pause
