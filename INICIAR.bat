@echo off
echo === Sistema de Composicao de Pontas de Medicao ===
echo.

:: Verifica se Node.js esta instalado
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERRO: Node.js nao encontrado. Instale em https://nodejs.org
    pause
    exit /b 1
)

echo Iniciando backend...
start "Backend - Composicao" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 3 /nobreak >nul

echo Iniciando frontend...
start "Frontend - Composicao" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo Abrindo no navegador...
start http://localhost:5173

echo.
echo ========================================================
echo  Backend: http://localhost:3001
echo  Frontend: http://localhost:5173
echo ========================================================
echo.
echo Feche as janelas do terminal para encerrar.
pause
