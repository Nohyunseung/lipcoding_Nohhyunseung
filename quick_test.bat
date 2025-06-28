@echo off
title 멘토-멘티 매칭 플랫폼 - 빠른 테스트
echo ========================================
echo   멘토-멘티 매칭 플랫폼 빠른 테스트
echo ========================================
echo.

echo 1. 테스트 HTML 파일을 브라우저에서 열기...
start test_app.html

echo.
echo 2. 메인 앱을 브라우저에서 열기...
start frontend\index.html

echo.
echo ========================================
echo 📋 테스트 가이드
echo ========================================
echo.
echo 로컬 파일로 열린 경우:
echo - 일부 기능이 제한될 수 있습니다
echo - 데모 모드로 기본 기능 테스트 가능
echo.
echo 완전한 테스트를 위해서는:
echo 1. start_all.bat 실행
echo 2. http://localhost:3000 접속
echo.
echo 테스트 계정:
echo - 멘토: mentor@test.com / 123456  
echo - 멘티: mentee@test.com / 123456
echo.
pause
