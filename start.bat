@echo off
echo ========================================
echo 멘토-멘티 매칭 플랫폼 시작
echo ========================================

echo.
echo 1. 백엔드 서버 시작 중...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "npm start"

echo.
echo 2. 프론트엔드 서버 시작 중...
cd /d "%~dp0frontend"
start "Frontend Server" cmd /k "npx http-server . -p 3000 -c-1"

echo.
echo 3. 브라우저 열기...
timeout /t 3 >nul
start "" "http://localhost:3000"

echo.
echo ========================================
echo 서버가 시작되었습니다!
echo.
echo 메인 애플리케이션: http://localhost:3000
echo API 문서: http://localhost:8080/swagger-ui
echo API 테스트: file:///%~dp0test.html
echo ========================================
echo.
echo 서버를 종료하려면 터미널 창을 닫으세요.
pause
