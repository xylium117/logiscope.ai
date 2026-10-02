@echo off
TITLE LOGISCOPE Platform Shutdown
COLOR 0C

echo ======================================================================
echo           LOGISCOPE: SHUTTING DOWN ACTIVE SERVICES
echo ======================================================================
echo.

echo [INFO] Terminating processes running on port 8000 (Server API)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>nul
    echo  - Terminated PID %%a (FastAPI Server)
)

echo.
echo [INFO] Terminating processes running on port 5173 (Client UI)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>nul
    echo  - Terminated PID %%a (Vite Client Server)
)

echo.
echo ======================================================================
echo              LOGISCOPE SERVICES HAVE BEEN STOPPED.
echo ======================================================================
echo.
ping 127.0.0.1 -n 3 >nul
