@echo off
echo ========================================
echo   Desplegando worker zona-inmu...
echo ========================================
cd /d "C:\Users\ravzc\OneDrive\Desktop\real-estate-PRODUCTION\re2"

rem Siempre se publica la version mas reciente de main, para no subir codigo viejo.
git status --porcelain | findstr . >nul
if not errorlevel 1 (
  echo.
  echo  ALTO: hay cambios locales sin subir a GitHub. No se publico nada.
  echo  Subalos o descartelos y vuelva a correr este archivo.
  git status --short
  goto fin
)
git checkout main || goto error
git pull --ff-only origin main || goto error

npx wrangler deploy 2>&1
goto fin

:error
echo.
echo  ALTO: no se pudo actualizar main desde GitHub. No se publico nada.

:fin
echo.
echo ========================================
echo   RESULTADO ARRIBA. Presiona una tecla.
echo ========================================
pause >nul
cmd /k
