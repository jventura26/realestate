@echo off
cd /d "%~dp0"
echo Subiendo cambios Fase 1...
git add -A
git commit -m "Fase 1: Sort, Area filter, Lightbox gallery, Mobile sticky CTA"
git push origin main
echo.
echo LISTO! Cloudflare publicara en 1-2 min.
echo Revisa: https://zona-innmueble.com/propiedades
pause
