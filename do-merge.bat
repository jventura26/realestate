@echo off
cd /d "%~dp0"
echo Removing stale lock...
del /f /q ".git\index.lock" 2>nul
echo Staging resolved files...
git add src\zona\index.html src\zona\templates\layout.js
echo Committing merge...
git commit --no-edit
echo Pushing to GitHub...
git push origin main
echo.
echo DONE! Check GitHub.
echo.
git log --oneline -3
pause
