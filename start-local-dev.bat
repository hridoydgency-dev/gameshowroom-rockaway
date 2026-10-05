@echo off
title Game Show Room - local site + admin (http://localhost:4173)
cd /d "%~dp0"
set PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
rem Pick up a freshly installed Node.js without needing to sign out
set "PATH=%PATH%;%ProgramFiles%\nodejs;%APPDATA%\npm"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed, so the editable admin cannot run locally.
  echo Starting the preview-only server instead. Install Node.js LTS from https://nodejs.org to edit locally.
  call "%~dp0start-local-preview.bat"
  exit /b
)
if not exist node_modules (
  echo Installing packages - first run only, about a minute...
  call npm install --no-audit --no-fund
)
start "Decap admin backend (keep open)" cmd /k npx -y decap-server
timeout /t 4 >nul
start "" http://localhost:4173/admin/
call npm run dev
pause
