@echo off
title GitHub에 프로젝트 업로드
echo ========================================
echo   GitHub 저장소에 프로젝트 업로드
echo ========================================
echo.

echo 🔍 Git 설치 확인 중...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git이 설치되어 있지 않습니다.
    echo Git을 다운로드하여 설치해주세요: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git이 설치되어 있습니다.
echo.

echo 📁 Git 저장소 초기화 중...
git init

echo.
echo 🚫 .gitignore 적용 중...
if not exist .gitignore (
    echo node_modules/ > .gitignore
    echo .env >> .gitignore
    echo *.sqlite >> .gitignore
    echo .DS_Store >> .gitignore
    echo Thumbs.db >> .gitignore
)

echo.
echo 📝 모든 파일 추가 중...
git add .

echo.
echo 💾 초기 커밋 생성 중...
git commit -m "🎉 Initial commit: 멘토-멘티 매칭 플랫폼 완성

✨ Features:
- 완전한 회원가입/로그인 시스템 (JWT 인증)
- 멘토/멘티 프로필 관리 (이미지 업로드 포함)
- 멘토 검색 및 필터링 기능
- 매칭 요청 시스템
- 반응형 웹 디자인
- 데모 모드 지원 (오프라인 테스트)

🛠 Tech Stack:
- Backend: Node.js, Express, SQLite, JWT
- Frontend: Vanilla JavaScript, CSS3, HTML5
- Tools: Swagger UI, 자동화 스크립트

🚀 Quick Start:
- 실행: start_all.bat
- 테스트: test_app.html
- 접속: http://localhost:3000

👥 Test Accounts:
- 멘토: mentor@test.com / 123456
- 멘티: mentee@test.com / 123456"

echo.
echo 🌐 원격 저장소 연결 중...
echo 📝 GitHub 사용자명을 확인하세요...
echo.
echo ⚠️  중요: GitHub 저장소 URL을 올바르게 설정해야 합니다!
echo.
echo 1️⃣ GitHub에서 새 저장소를 먼저 생성하세요:
echo    - https://github.com/new
echo    - Repository name: lipcoding_Nohhyunseung
echo    - Public 또는 Private 선택
echo    - README 생성하지 말고 빈 저장소로 생성
echo.
echo 2️⃣ 실제 GitHub 사용자명으로 URL을 수정하세요:
echo    현재: https://github.com/Nohyunseung/lipcoding_Nohhyunseung.git
echo    변경: https://github.com/YOUR_ACTUAL_USERNAME/lipcoding_Nohhyunseung.git
echo.
set /p username="GitHub 사용자명을 입력하세요 (예: Nohyunseung): "

if "%username%"=="" (
    echo [ERROR] 사용자명이 입력되지 않았습니다.
    pause
    exit /b 1
)

echo.
echo 🔗 저장소 URL: https://github.com/%username%/lipcoding_Nohhyunseung.git
echo.

git remote add origin https://github.com/%username%/lipcoding_Nohhyunseung.git

echo.
echo 📤 GitHub에 업로드 중...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo ✅ 업로드 완료!
echo ========================================
echo.
echo 🔗 저장소 주소: https://github.com/Nohyunseung/lipcoding_Nohhyunseung
echo.
echo 📋 다음 단계:
echo 1. GitHub에서 저장소 확인
echo 2. README.md 파일이 자동으로 표시됨
echo 3. 프로젝트 설명 및 사용법 확인
echo.
pause
