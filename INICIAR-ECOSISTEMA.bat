@echo off
chcp 65001 >nul
title TecnOdiel — Plataforma Completa Unificada
cd /d "%~dp0"

cls
echo ==========================================================
echo          TECNODIEL — ECOSISTEMA DIGITAL UNIFICADO
echo ==========================================================
echo.
echo   Iniciando la plataforma completa (Landing + Multiwebs + Portal)...
echo.
echo   • URL Local: http://localhost:5173
echo   • Landing:   http://localhost:5173/
echo   • Multiwebs: http://localhost:5173/restaurantes
echo   • Portal:    http://localhost:5173/portal
echo.
echo ==========================================================

:: Abrir navegador tras 2 segundos
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5173"

:: Ejecutar servidor Vite de desarrollo unificado
npm run dev

pause
