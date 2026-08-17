@echo off
cd /d "%~dp0"
echo Adding build fix...
git add src\zona\build.js
git commit -m "Fix: copy zona-fase1.js to dist/zona/assets during build"
echo Pushing...
git push origin main
echo.
echo DONE!
git log --oneline -3
pause
