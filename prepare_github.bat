@echo off
title 완전한 GitHub 업로드 준비
echo ========================================
echo   멘토-멘티 매칭 플랫폼 GitHub 업로드
echo ========================================
echo.

:: Git 설치 확인
echo 🔍 Git 설치 확인 중...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git이 설치되어 있지 않습니다.
    echo Git을 다운로드하여 설치해주세요: https://git-scm.com/
    pause
    exit /b 1
)
echo ✅ Git이 설치되어 있습니다.

echo.
echo 📁 불필요한 파일 정리 중...
if exist node_modules rmdir /s /q node_modules
if exist backend\node_modules rmdir /s /q backend\node_modules
if exist frontend\node_modules rmdir /s /q frontend\node_modules
if exist *.log del *.log
if exist backend\*.log del backend\*.log
if exist frontend\*.log del frontend\*.log

echo.
echo 📝 GitHub용 README 복사 중...
if exist README_GITHUB.md (
    copy README_GITHUB.md README.md
    echo ✅ GitHub용 README가 적용되었습니다.
) else (
    echo ⚠️  GitHub용 README 파일이 없습니다. 기존 README를 사용합니다.
)

echo.
echo 🔧 Git 저장소 초기화 중...
if exist .git (
    echo ⚠️  이미 Git 저장소가 초기화되어 있습니다.
) else (
    git init
    echo ✅ Git 저장소가 초기화되었습니다.
)

echo.
echo 📦 모든 파일 추가 중...
git add .

echo.
echo 💾 커밋 생성 중...
git commit -m "🚀 멘토-멘티 매칭 플랫폼 완성

✨ 주요 기능:
- JWT 기반 사용자 인증 시스템
- 프로필 관리 및 이미지 업로드
- 멘토/멘티 매칭 시스템
- 실시간 요청 관리
- 반응형 웹 디자인
- RESTful API with Swagger 문서

🛠️ 기술 스택:
- Frontend: Vanilla JS, HTML5, CSS3
- Backend: Node.js, Express, SQLite
- API: OpenAPI/Swagger
- 인증: JWT, bcryptjs"

echo.
echo ========================================
echo ✅ GitHub 업로드 준비 완료!
echo ========================================
echo.
echo 📋 다음 단계 (GitHub 웹사이트에서):
echo.
echo 1. 🌐 GitHub.com에 로그인
echo 2. ➕ "New repository" 클릭
echo 3. 📝 저장소 이름 입력 (예: mentor-mentee-platform)
echo 4. 📄 "Public" 선택 (오픈소스로 공유하려면)
echo 5. ⚠️  "Initialize with README" 체크 해제 (이미 있음)
echo 6. 🎯 "Create repository" 클릭
echo.
echo 📋 터미널에서 실행할 명령어:
echo.
echo git branch -M main
echo git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
echo git push -u origin main
echo.
echo 💡 YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 바꿔주세요!
echo.
echo 🎉 업로드 후 다음을 확인하세요:
echo - 📖 README.md가 제대로 표시되는지
echo - 🏷️  토픽 태그 추가 (javascript, nodejs, mentoring, platform)
echo - 📝 저장소 설명 추가
echo - 🌟 GitHub Pages 설정 (선택사항)
echo.
pause
