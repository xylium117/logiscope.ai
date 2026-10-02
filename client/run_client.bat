@echo off
setlocal
TITLE LOGISCOPE Frontend Client
COLOR 0B

cd /d "%~dp0"
echo ======================================================================
echo              STARTING LOGISCOPE VITE FRONTEND (PORT 5173)
echo ======================================================================
echo.
call npm run dev
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Client encountered an issue on startup.
)
pause
