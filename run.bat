@echo off
TITLE LOGISCOPE Tactical C2 Platform Launcher
COLOR 0B

echo ======================================================================
echo           LOGISCOPE: PREDICTIVE LOGISTICS INTELLIGENCE PLATFORM
echo                           [ C2 LAUNCHER ]
echo ======================================================================
echo.

set "ROOT_DIR=%~dp0"
if "%ROOT_DIR:~-1%"=="\" set "ROOT_DIR=%ROOT_DIR:~0,-1%"

echo [INFO] Project Directory: %ROOT_DIR%
echo.

set "PY_CMD="
where python >nul 2>&1 && set "PY_CMD=python"
if not defined PY_CMD (
    where py >nul 2>&1 && set "PY_CMD=py"
)
if not defined PY_CMD (
    where python3 >nul 2>&1 && set "PY_CMD=python3"
)

if not defined PY_CMD (
    COLOR 0C
    echo [ERROR] Python is not found in your system PATH!
    echo Please install Python 3.10+ and make sure to check "Add Python to PATH".
    echo.
    pause
    exit /b 1
)

echo [INFO] Using Python command: %PY_CMD%

where npm >nul 2>&1
if errorlevel 1 (
    COLOR 0C
    echo [ERROR] Node.js / npm is not found in your system PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [1/3] Checking Server Python Dependencies...
%PY_CMD% -c "import fastapi, uvicorn, pydantic, numpy" >nul 2>&1
if errorlevel 1 (
    echo [SETUP] Installing required Python packages from server\requirements.txt...
    %PY_CMD% -m pip install -r "%ROOT_DIR%\server\requirements.txt"
    if errorlevel 1 (
        COLOR 0C
        echo [ERROR] Failed to install server Python dependencies.
        pause
        exit /b 1
    )
) else (
    echo [OK] Server dependencies verified.
)

echo [2/3] Checking Client Dependencies...
if not exist "%ROOT_DIR%\client\node_modules" (
    echo [SETUP] Installing client dependencies...
    cd /d "%ROOT_DIR%\client"
    call npm install
    if errorlevel 1 (
        COLOR 0C
        echo [ERROR] Failed to install client npm packages.
        pause
        exit /b 1
    )
    cd /d "%ROOT_DIR%"
) else (
    echo [OK] Client dependencies verified.
)

echo.
echo [3/3] Launching LOGISCOPE Services...
echo.

echo [START] Launching Server on port 8000...
start "LOGISCOPE Server API (:8000)" cmd /k "cd /d "%ROOT_DIR%\server" && color 0A && echo ======================================== && echo  LOGISCOPE FASTAPI SERVER (PORT 8000) && echo ======================================== && echo. && %PY_CMD% main.py"

ping 127.0.0.1 -n 3 >nul

echo [START] Launching Client on port 5173...
start "LOGISCOPE Client UI (:5173)" cmd /k "cd /d "%ROOT_DIR%\client" && color 0B && echo ======================================== && echo  LOGISCOPE VITE CLIENT (PORT 5173) && echo ======================================== && echo. && npm run dev"

ping 127.0.0.1 -n 4 >nul
echo [BROWSER] Opening http://localhost:5173 ...
start "" "http://localhost:5173"

echo.
echo ======================================================================
echo               LOGISCOPE PLATFORM IS NOW OPERATIONAL!
echo ======================================================================
echo  - Client Web UI  : http://localhost:5173
echo  - Server REST API: http://localhost:8000
echo  - Interactive Docs: http://localhost:8000/docs
echo ======================================================================
echo.
echo (Keep the server and client command windows open while using the app.)
echo To stop all services, run stop.bat or close the windows.
echo.
pause
