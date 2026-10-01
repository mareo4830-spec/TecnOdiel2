@echo off
chcp 65001 >nul
title TecnOdiel — Multiwebs & Creador de Webs
cd /d "%~dp0"

:: 1. Comprobar si el servidor ya esta escuchando en el puerto 5173
netstat -ano | findstr :5173 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    cls
    echo ==========================================================
    echo   Multiwebs ya esta en ejecucion en http://localhost:5173
    echo   Abriendo en tu navegador...
    echo ==========================================================
    start "" "http://localhost:5173"
    timeout /t 2 >nul
    exit
)

:: 2. Si no esta activo, arrancamos el servidor y abrimos el navegador
cls
echo ==========================================================
echo           TECNODIEL — MULTIWEBS & CREADOR DE WEBS
echo ==========================================================
echo.
echo   Iniciando el servidor de Multiwebs...
echo   La plataforma se abrira automaticamente en tu navegador en:
echo     --^> http://localhost:5173
echo.
echo   [CONSEJO]
echo   No cierres esta ventana mientras quieras usar Multiwebs.
echo   Puedes MINIMIZARLA para que no moleste.
echo   Para apagar el servidor, simplemente cierra esta ventana.
echo ==========================================================
echo.

start "" "http://localhost:5173"
call npm.cmd run dev

if %errorlevel% neq 0 (
    echo.
    echo Ocurrio un error al iniciar Multiwebs.
    pause
)
