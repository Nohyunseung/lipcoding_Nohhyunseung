@echo off
echo Starting frontend server...
cd /d "%~dp0"
python -m http.server 3000
pause
