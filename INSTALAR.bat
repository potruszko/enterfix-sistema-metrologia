@echo off
echo === Instalando dependencias ===
echo.

echo [1/2] Instalando backend...
cd /d %~dp0backend
npm install
if %ERRORLEVEL% neq 0 (
    echo ERRO na instalacao do backend
    pause
    exit /b 1
)

echo.
echo [2/2] Instalando frontend...
cd /d %~dp0frontend
npm install
if %ERRORLEVEL% neq 0 (
    echo ERRO na instalacao do frontend
    pause
    exit /b 1
)

echo.
echo =============================================
echo  Instalacao concluida!
echo  Execute INICIAR.bat para abrir o sistema.
echo =============================================
pause
