@echo off
title TecnOdiel CyS - Clinicas y Salud
echo ========================================================
echo   Iniciando TecnOdiel CyS (Clinicas y Salud)
echo   Puerto: http://localhost:5175
echo ========================================================
cd /d "%~dp0"
call npm run dev
pause
