@echo off
chcp 65001 >nul
title TecnOdiel — Portal de Clientes
cd /d "%~dp0"

:: 1. Comprobar si el servidor ya esta escuchando en el puerto 5174
netstat -ano | findstr :5174 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    cls
    echo ==========================================================
    echo   Portal de Clientes ya esta en ejecucion en http://localhost:5174
    echo   Abriendo en tu navegador...
    echo ==========================================================
    start "" "http://localhost:5174"
    timeout /t 2 >nul
    exit
)

:: 2. Si no esta activo, arrancamos el servidor y abrimos el navegador
cls
echo ==========================================================
echo           TECNODIEL — PORTAL DE CLIENTES
echo ==========================================================
echo.
echo   Iniciando el servidor del Portal de Clientes...
echo   El portal se abrira automaticamente en tu navegador en:
echo     --^> http://localhost:5174
echo.
echo   [CONSEJO]
echo   No cierres esta ventana mientras uses el portal.
echo   Puedes MINIMIZARLA para que no moleste.
echo   Para apagar el servidor, simplemente cierra esta ventana.
echo ==========================================================
echo.

start "" "http://localhost:5174"
call npm.cmd run dev

if %errorlevel% neq 0 (
    echo.
    echo Ocurrio un error al iniciar el Portal de Clientes.
    pause
)
