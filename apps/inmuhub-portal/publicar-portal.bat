@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo ================================================
echo   Publicando portal inmuhub en inmuhub.com
echo ================================================
echo.

echo [0/4] Descargando la version mas reciente desde GitHub...
git pull
echo.
echo [1/4] Instalando dependencias...
call npm install --no-audit --no-fund
if errorlevel 1 goto error

echo.
echo [2/4] Creando tablas y cargando propiedades en la base de datos (D1)...
echo       Si pregunta "Ok to proceed?", responda Y.
call npx wrangler d1 migrations apply inmuhub --remote
if errorlevel 1 goto error

echo.
echo [3/4] Publicando el portal...
call npx wrangler deploy
if errorlevel 1 goto error

echo.
echo [4/4] Clave de acceso al panel /admin
set /p RESP="Desea crear o cambiar la clave de /admin ahora? (s/n): "
if /i "%RESP%"=="s" call npx wrangler secret put ADMIN_TOKEN

echo.
echo ================================================
echo   LISTO. Revise https://inmuhub.com
echo   Para volver al sitio anterior: revertir-portal.bat
echo ================================================
pause
exit /b 0

:error
echo.
echo *** Hubo un error. Copie el mensaje de arriba y compartalo con Claude. ***
pause
exit /b 1
