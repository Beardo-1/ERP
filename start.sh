#!/bin/bash

# Real Estate ERP System Startup Script
echo "🏢 Starting Real Estate ERP System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Function to start frontend
start_frontend() {
    echo "🚀 Starting Frontend (React + Vite)..."
    npm install
    npm run dev &
    FRONTEND_PID=$!
    echo "✅ Frontend started on http://localhost:5173"
}

# Function to start backend
start_backend() {
    echo "🚀 Starting Backend (FastAPI)..."
    cd backend
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        echo "📦 Creating Python virtual environment..."
        python -m venv venv || python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate || source venv/Scripts/activate
    
    # Install dependencies
    pip install -r requirements.txt
    
    # Start the API server
    python main.py &
    BACKEND_PID=$!
    echo "✅ Backend started on http://localhost:8000"
    echo "📚 API Documentation: http://localhost:8000/api/docs"
    
    cd ..
}

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down services..."
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    echo "✅ Services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start services
start_frontend
start_backend

echo ""
echo "🎉 Real Estate ERP System is running!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/api/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for services
wait 