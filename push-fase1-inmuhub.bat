@echo off
cd /d "%~dp0"
echo.
echo === INMUHUB FASE 1 DEPLOY ===
echo.

echo Removing stale locks...
del /f /q ".git\index.lock" 2>nul

echo Staging changes...
git add src/vinculo/assets/vinculo-fase1.js
git add src/vinculo/templates/layout.js
git add src/vinculo/build.js
git add package.json

echo.
echo Committing...
git commit -m "feat(inmuhub): Fase 1 - Sort, Area filter, Lightbox gallery"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo === DONE! Cloudflare Pages will auto-deploy ===
echo.
git log --oneline -3
pause
