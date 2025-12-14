#!/bin/bash

echo "🚀 Starting Spring Boot Backend..."
echo "=================================="

cd "$(dirname "$0")/ai-bi-platform"

# Check if Maven wrapper exists
if [ ! -f "./mvnw" ]; then
    echo "❌ Error: Maven wrapper not found!"
    exit 1
fi

# Make mvnw executable
chmod +x ./mvnw

echo "📦 Building project..."
./mvnw clean install -DskipTests

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo "🏃 Starting Spring Boot application on port 8080..."
echo ""

./mvnw spring-boot:run
