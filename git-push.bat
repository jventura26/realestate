@echo off
cd /d "%~dp0"
echo ========================================
echo   ZONA INNMUEBLE - PUSH FASE 1
echo ========================================
echo.
echo [1/3] Descargando cambios remotos...
git pull --rebase origin main
echo.
echo [2/3] Subiendo cambios...
git push origin main
echo.
echo [3/3] Verificando...
git log --oneline -3
echo.
echo ========================================
echo   RESULTADO ARRIBA
echo ========================================
echo.
pause
