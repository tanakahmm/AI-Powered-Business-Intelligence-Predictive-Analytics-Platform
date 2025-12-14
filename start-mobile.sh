#!/bin/bash

echo "📱 Starting Expo Mobile App..."
echo "=============================="

cd "$(dirname "$0")/mobile-app"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed!"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed!"
    exit 1
fi

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies!"
        exit 1
    fi
    echo "✅ Dependencies installed!"
fi

echo "🏃 Starting Expo dev server..."
echo ""
echo "Options:"
echo "  - Press 'i' for iOS simulator"
echo "  - Press 'a' for Android emulator"
echo "  - Scan QR code with Expo Go app on your phone"
echo ""

npx expo start -c
