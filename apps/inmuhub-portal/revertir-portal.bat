@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo ================================================
echo   Revertir: inmuhub.com vuelve al sitio anterior
echo ================================================
echo.
echo Esto borra el Worker "inmuhub-portal" y sus rutas.
echo NO borra la base de datos (propiedades y consultas quedan guardadas),
echo NO toca el DNS ni el proyecto de Pages. Puede volver a publicar
echo cuando quiera con publicar-portal.bat.
echo.
set /p RESP="Continuar? (s/n): "
if /i not "%RESP%"=="s" exit /b 0
call npx wrangler delete --name inmuhub-portal
echo.
echo Listo. inmuhub.com vuelve a mostrar el sitio anterior en uno o dos minutos.
pause
