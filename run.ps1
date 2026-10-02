Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "          LOGISCOPE: PREDICTIVE LOGISTICS INTELLIGENCE PLATFORM       " -ForegroundColor Cyan
Write-Host "                          [ POWERSHELL LAUNCHER ]                     " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$RootDir = $PSScriptRoot
Set-Location $RootDir

$PyCmd = if (Get-Command python -ErrorAction SilentlyContinue) { "python" } elseif (Get-Command py -ErrorAction SilentlyContinue) { "py" } else { $null }

if (-not $PyCmd) {
    Write-Host "[ERROR] Python not found in PATH!" -ForegroundColor Red
    pause
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js / npm not found in PATH!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "[SETUP] Verifying server dependencies..." -ForegroundColor Yellow
& $PyCmd -c "import fastapi, uvicorn, pydantic, numpy" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[SETUP] Installing Python requirements..." -ForegroundColor Yellow
    & $PyCmd -m pip install -r "$RootDir\server\requirements.txt"
}

if (-not (Test-Path "$RootDir\client\node_modules")) {
    Write-Host "[SETUP] Installing client dependencies..." -ForegroundColor Yellow
    Set-Location "$RootDir\client"
    npm install
    Set-Location $RootDir
}

Write-Host "[START] Launching FastAPI Server on http://localhost:8000 ..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/k", "cd /d `"$RootDir\server`" && color 0A && $PyCmd main.py" -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "[START] Launching Vite Client on http://localhost:5173 ..." -ForegroundColor Cyan
Start-Process cmd -ArgumentList "/k", "cd /d `"$RootDir\client`" && color 0B && npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "[BROWSER] Launching http://localhost:5173 ..." -ForegroundColor Magenta
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "              LOGISCOPE PLATFORM IS NOW OPERATIONAL!                 " -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  - Client: http://localhost:5173" -ForegroundColor White
Write-Host "  - Server: http://localhost:8000" -ForegroundColor White
Write-Host "  - API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Green
