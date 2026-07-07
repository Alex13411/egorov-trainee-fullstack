$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$frontend = Join-Path $root "frontend"
$backend = Join-Path $root "backend"
$venvPython = Join-Path $backend ".venv\Scripts\python.exe"
$venvUvicorn = Join-Path $backend ".venv\Scripts\uvicorn.exe"

# Refresh PATH so npm/node/py work in this terminal session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("Path", "User")

function Stop-Port {
  param([int]$Port)
  Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}

Write-Host "Stopping old servers on ports 5173 and 8000..." -ForegroundColor Yellow
Stop-Port 5173
Stop-Port 8000
Start-Sleep -Seconds 1

if (-not (Test-Path $venvUvicorn)) {
  Write-Host "Backend venv not found. Run setup first:" -ForegroundColor Red
  Write-Host "  cd backend"
  Write-Host "  py -m venv .venv"
  Write-Host "  .\.venv\Scripts\Activate.ps1"
  Write-Host "  pip install -r requirements.txt"
  exit 1
}

Write-Host "Starting backend on http://localhost:8000 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "`$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User'); Set-Location '$backend'; Write-Host 'KAIROS backend' -ForegroundColor Cyan; & '$venvUvicorn' app.main:app --reload --port 8000"
)

Write-Host "Starting frontend on http://localhost:5173 ..." -ForegroundColor Cyan
Write-Host "Logs [KAIROS ...] will appear below." -ForegroundColor Green
Set-Location $frontend
npm run dev
