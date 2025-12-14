#!/bin/bash

echo "🤖 Starting AI Microservice (FastAPI)..."
echo "========================================"

cd "$(dirname "$0")/ai-bi-platform/ai_model"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed!"
    exit 1
fi

# Check if requirements.txt exists
if [ ! -f "requirements.txt" ]; then
    echo "❌ Error: requirements.txt not found!"
    exit 1
fi

echo "📦 Installing Python dependencies..."
pip3 install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies!"
    exit 1
fi

echo "✅ Dependencies installed!"
echo "🏃 Starting FastAPI server on port 8000..."
echo ""

# Check if uvicorn is installed
if ! command -v uvicorn &> /dev/null; then
    echo "❌ Error: uvicorn not found! Installing..."
    pip3 install uvicorn
fi

uvicorn app:app --reload --port 8000 --host 0.0.0.0
