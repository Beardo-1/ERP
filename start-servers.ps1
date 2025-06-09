#!/usr/bin/env powershell

# Real Estate ERP System - Server Startup Script
# This script starts both the frontend and backend servers

Write-Host "Real Estate ERP System Starting..." -ForegroundColor Green
Write-Host "Multilingual Arabic/English Support" -ForegroundColor Cyan
Write-Host "==================================================="

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "Python version: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

Write-Host "`nStarting Backend Server (FastAPI)..." -ForegroundColor Yellow

# Start backend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

Write-Host "Backend server starting on http://localhost:8000" -ForegroundColor Green
Write-Host "API Documentation: http://localhost:8000/api/docs" -ForegroundColor Cyan

# Wait for backend to be ready with health check
$backendStarted = $false
$retryCount = 0
$maxRetries = 15

Write-Host "`nWaiting for backend to be ready..." -ForegroundColor Yellow

while (-not $backendStarted -and $retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $backendStarted = $true
            Write-Host "✅ Backend server is ready and responding" -ForegroundColor Green
        }
    } catch {
        Write-Host "⏳ Waiting for backend... (Attempt $($retryCount + 1)/$maxRetries)" -ForegroundColor Yellow
        Start-Sleep -Seconds 3
        $retryCount++
    }
}

if (-not $backendStarted) {
    Write-Host "❌ Backend server failed to start after $maxRetries attempts" -ForegroundColor Red
    Write-Host "Please check the backend logs for errors" -ForegroundColor Red
    exit 1
}

Write-Host "`nStarting Frontend Server (Vite + React)..." -ForegroundColor Yellow

# Start frontend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Write-Host "Frontend server starting on http://localhost:5173" -ForegroundColor Green

Write-Host "`nSystem Startup Complete!" -ForegroundColor Green
Write-Host "==================================================="
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/api/docs" -ForegroundColor Cyan
Write-Host "==================================================="

Write-Host "`nFeatures Available:" -ForegroundColor Yellow
Write-Host "  - Complete Arabic/English Translation" -ForegroundColor White
Write-Host "  - RTL Layout Support" -ForegroundColor White
Write-Host "  - Real-time Dashboard Analytics" -ForegroundColor White
Write-Host "  - Collection Agent Management" -ForegroundColor White
Write-Host "  - Project Management (70+ Projects)" -ForegroundColor White
Write-Host "  - Financial Reporting and Export" -ForegroundColor White
Write-Host "  - Advanced Search and Notifications" -ForegroundColor White
Write-Host "  - Multilingual Settings Panel" -ForegroundColor White

Write-Host "`nAccess the system at: http://localhost:5173" -ForegroundColor Green
Write-Host "Both servers will auto-reload on file changes" -ForegroundColor Cyan

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 