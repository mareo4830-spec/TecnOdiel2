@echo off
chcp 65001 >nul
title TecnOdiel — Servidor Web Local
cd /d "%~dp0"

:: 1. Comprobar si el servidor ya esta escuchando en el puerto 3000
netstat -ano | findstr :3000 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    cls
    echo ==========================================================
    echo   TecnOdiel ya esta en ejecucion en http://localhost:3000
    echo   Abriendo la web en tu navegador...
    echo ==========================================================
    start "" "http://localhost:3000"
    timeout /t 2 >nul
    exit
)

:: 2. Si no esta activo, arrancamos el servidor y abrimos el navegador
cls
echo ==========================================================
echo                TECNODIEL — SERVIDOR WEB
echo ==========================================================
echo.
echo   Iniciando el servidor local...
echo   La web se abrira automaticamente en tu navegador en:
echo     --^> http://localhost:3000
echo.
echo   [CONSEJO]
echo   No cierres esta ventana mientras quieras ver la web.
echo   Puedes MINIMIZARLA para que no moleste.
echo   Para apagar el servidor, simplemente cierra esta ventana.
echo ==========================================================
echo.

start "" "http://localhost:3000"
call npm.cmd run dev

if %errorlevel% neq 0 (
    echo.
    echo Ocurrio un error al iniciar el servidor.
    pause
)
