@echo off
title Install Node.js LTS
set "PATH=%PATH%;%ProgramFiles%\nodejs"
where node >nul 2>nul
if not errorlevel 1 (
  echo Node.js is already installed:
  node -v
  pause
  exit /b
)
where winget >nul 2>nul
if errorlevel 1 (
  echo winget is not available on this PC. Opening the official Node.js download page...
  start "" https://nodejs.org/en/download
  pause
  exit /b
)
echo Installing Node.js LTS from the official winget source (OpenJS)...
echo Windows may ask for permission - click Yes.
winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-package-agreements --accept-source-agreements
echo.
if exist "%ProgramFiles%\nodejs\node.exe" (
  "%ProgramFiles%\nodejs\node.exe" -v
  echo Node.js installed. Next: open start-local-dev.bat
) else (
  echo Installation did not finish. You can install manually from https://nodejs.org
)
pause
