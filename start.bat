@echo off
title Real Estate ERP System

echo 🏢 Starting Real Estate ERP System...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

echo 🚀 Starting Frontend (React + Vite)...
start "Frontend" cmd /k "npm install && npm run dev"

echo 🚀 Starting Backend (FastAPI)...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment and start backend
start "Backend" cmd /k "venv\Scripts\activate && pip install -r requirements.txt && python main.py"

cd ..

echo.
echo 🎉 Real Estate ERP System is starting!
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/api/docs
echo.
echo Press any key to exit...
pause >nul 