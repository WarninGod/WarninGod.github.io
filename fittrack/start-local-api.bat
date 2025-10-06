@echo off
echo Starting ExerciseDB Local API Server...
echo.

cd /d "c:\Users\FSOS\Documents\workout-tracker\Frontend\exercisedb-api-1-open-source"

echo Checking if Bun is installed...
bun --version >nul 2>&1
if errorlevel 1 (
    echo Bun is not installed. Please install Bun first:
    echo Visit: https://bun.sh
    pause
    exit /b
)

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing dependencies...
    bun install
) else (
    echo Dependencies already installed.
)

echo.
echo Building project...
bun run build

echo.
echo Starting the API server on http://localhost:3000...
echo Press Ctrl+C to stop the server.
echo.

bun run start
