@echo off
title Git 상태 확인 및 초기화
echo ========================================
echo           Git 상태 확인
echo ========================================
echo.

echo 📁 현재 디렉토리: %CD%
echo.

echo 🔍 Git 저장소 상태 확인...
if not exist .git (
    echo ❌ Git 저장소가 초기화되지 않았습니다.
    echo.
    echo 💡 다음 중 하나를 선택하세요:
    echo 1. Git 저장소 초기화
    echo 2. 종료
    echo.
    set /p choice="선택하세요 (1 또는 2): "
    
    if "%choice%"=="1" (
        echo.
        echo 🚀 Git 저장소 초기화 중...
        git init
        echo ✅ Git 저장소가 초기화되었습니다.
    ) else (
        echo 프로그램을 종료합니다.
        pause
        exit /b 0
    )
) else (
    echo ✅ Git 저장소가 이미 초기화되어 있습니다.
)

echo.
echo 📋 Git 상태:
git status

echo.
echo 🌐 원격 저장소 확인:
git remote -v

if %errorlevel% neq 0 (
    echo ❌ 설정된 원격 저장소가 없습니다.
) else (
    echo.
    echo 🔄 원격 저장소를 다시 설정하시겠습니까?
    set /p reset="y/n: "
    
    if /I "%reset%"=="y" (
        echo.
        echo 🗑️ 기존 원격 저장소 제거...
        git remote remove origin
        
        echo.
        set /p username="GitHub 사용자명을 입력하세요: "
        set /p reponame="저장소명을 입력하세요 (기본값: lipcoding_Nohhyunseung): "
        
        if "%reponame%"=="" set reponame=lipcoding_Nohhyunseung
        
        echo.
        echo 🌐 새 원격 저장소 추가...
        git remote add origin https://github.com/%username%/%reponame%.git
        
        echo ✅ 원격 저장소가 설정되었습니다: https://github.com/%username%/%reponame%.git
    )
)

echo.
echo ========================================
echo 📝 다음 단계:
echo ========================================
echo.
echo 1. GitHub에서 저장소 생성 확인
echo 2. 파일 추가: git add .
echo 3. 커밋: git commit -m "Initial commit"
echo 4. 푸시: git push -u origin main
echo.
echo 💡 또는 upload_to_github.bat 실행
echo.
pause
