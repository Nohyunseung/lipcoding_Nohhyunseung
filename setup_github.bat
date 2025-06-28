@echo off
title GitHub 업로드 준비
echo ========================================
echo   GitHub 저장소 초기화 및 업로드
echo ========================================
echo.

echo 🔧 Git 저장소 초기화 중...
git init

echo.
echo 📁 .gitignore 파일 확인 중...
if exist .gitignore (
    echo ✅ .gitignore 파일이 이미 존재합니다.
) else (
    echo ❌ .gitignore 파일이 없습니다. 생성 중...
    echo node_modules/ > .gitignore
    echo .env >> .gitignore
    echo *.log >> .gitignore
    echo .DS_Store >> .gitignore
)

echo.
echo 📦 모든 파일 추가 중...
git add .

echo.
echo 💾 첫 번째 커밋 생성 중...
git commit -m "Initial commit: 멘토-멘티 매칭 플랫폼 완성"

echo.
echo ========================================
echo ✅ Git 저장소 초기화 완료!
echo ========================================
echo.
echo 📋 다음 단계:
echo 1. GitHub에서 새 저장소 생성
echo 2. 아래 명령어로 원격 저장소 추가:
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
echo.
echo 3. GitHub에 업로드:
echo    git branch -M main
echo    git push -u origin main
echo.
echo 💡 GitHub 저장소 URL을 복사해서 YOUR_USERNAME과 YOUR_REPO_NAME을 
echo    실제 값으로 바꿔주세요.
echo.
pause
