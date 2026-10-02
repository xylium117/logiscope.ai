@echo off
setlocal enabledelayedexpansion
TITLE LOGISCOPE Server
COLOR 0A

cd /d "%~dp0"
echo ======================================================================
echo              STARTING LOGISCOPE FASTAPI SERVER (PORT 8000)
echo ======================================================================
echo.

set "PY_CMD="
where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
    set "PY_CMD=python"
) else (
    where py >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        set "PY_CMD=py"
    ) else (
        where python3 >nul 2>&1
        if %ERRORLEVEL% equ 0 (
            set "PY_CMD=python3"
        )
    )
)

if not defined PY_CMD (
    COLOR 0C
    echo [ERROR] Python not found in system PATH.
    pause
    exit /b 1
)

%PY_CMD% -c "import fastapi, uvicorn, pydantic, numpy" >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [SETUP] Installing required dependencies...
    %PY_CMD% -m pip install -r requirements.txt
)

%PY_CMD% main.py
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Server encountered an issue on startup.
)
pause
