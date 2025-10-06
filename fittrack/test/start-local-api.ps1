# Start ExerciseDB Local API Server
Write-Host "🚀 Starting ExerciseDB Local API Server..." -ForegroundColor Green
Write-Host ""

$apiPath = "c:\Users\FSOS\Documents\workout-tracker\Frontend\exercisedb-api-1-open-source"

if (Test-Path $apiPath) {
    Set-Location $apiPath
    
    Write-Host "📂 Changed to API directory: $apiPath" -ForegroundColor Blue
    
    # Check if bun is installed
    try {
        $bunVersion = bun --version
        Write-Host "✅ Bun version: $bunVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Bun is not installed. Please install Bun first:" -ForegroundColor Red
        Write-Host "   Visit: https://bun.sh" -ForegroundColor Yellow
        return
    }
    
    # Check if node_modules exists
    if (!(Test-Path "node_modules")) {
        Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
        bun install
    } else {
        Write-Host "✅ Dependencies already installed." -ForegroundColor Green
    }
    
    # Build the project
    Write-Host "🔨 Building project..." -ForegroundColor Yellow
    bun run build
    
    Write-Host ""
    Write-Host "🌐 Starting API server on http://localhost:3000..." -ForegroundColor Green
    Write-Host "📋 Press Ctrl+C to stop the server." -ForegroundColor Yellow
    Write-Host ""
    
    # Start the server
    bun run start
} else {
    Write-Host "❌ API directory not found: $apiPath" -ForegroundColor Red
    Write-Host "Please check the path and try again." -ForegroundColor Red
}
