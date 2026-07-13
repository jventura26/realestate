@echo off
echo ========================================
echo   Desplegando worker zona-inmu...
echo ========================================
cd /d "C:\Users\ravzc\OneDrive\Desktop\real-estate-PRODUCTION\re2"
npx wrangler deploy 2>&1
echo.
echo ========================================
echo   RESULTADO ARRIBA. Presiona una tecla.
echo ========================================
pause >nul
cmd /k
