@echo off
chcp 65001 >nul
title TecnOdiel — Lanzador Maestro Ecosistema
cd /d "%~dp0"

cls
echo ==========================================================
echo          TECNODIEL — LANZADOR MAESTRO ECOSISTEMA
echo ==========================================================
echo.
echo   Iniciando todos los servicios de TecnOdiel...
echo.
echo   1. Multiwebs Restaurantes (Hostelería & Cartas QR)
echo      --^> http://localhost:5173
echo.
echo   2. Portal de Clientes (Panel de Control de Clientes)
echo      --^> http://localhost:5174
echo.
echo   3. Multiwebs CyS (Clínicas & Centros de Salud)
echo      --^> http://localhost:5175
echo.
echo ==========================================================

:: Iniciar Multiwebs Restaurantes en su propia ventana
start "TecnOdiel - Multiwebs Restaurantes" cmd /k "cd /d %~dp0miltiwebs && iniciar-multiwebs.bat"

:: Esperar 1 segundo para ordenar el arranque
timeout /t 1 /nobreak >nul

:: Iniciar Portal de Clientes en su propia ventana
start "TecnOdiel - Portal de Clientes" cmd /k "cd /d %~dp0PortalDeClientes && iniciar-portal.bat"

:: Esperar 1 segundo para ordenar el arranque
timeout /t 1 /nobreak >nul

:: Iniciar Multiwebs CyS en su propia ventana
start "TecnOdiel - Multiwebs CyS Clinicas" cmd /k "cd /d %~dp0MultiwebsCyS && iniciar-multiwebs-cys.bat"

echo.
echo   [OK] Todos los servicios han sido lanzados correctamente.
echo   Las pestañas se abrirán automáticamente en tu navegador.
echo.
echo   Puedes cerrar esta ventana auxiliar.
echo ==========================================================
timeout /t 4 >nul
exit
