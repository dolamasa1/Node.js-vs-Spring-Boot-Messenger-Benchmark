#!/bin/bash

echo "🔨 Building Performance Testing Suite..."

echo "📦 Building frontend assets..."
mkdir -p dist/assets/js dist/assets/css dist/config

# Copy frontend files
cp index.html dist/
cp assets/css/style.css dist/assets/css/
cp assets/js/*.js dist/assets/js/
cp config/endpoints.js dist/config/

echo "📦 Building Go middleware..."
cd middleware/go
go build -o ../../dist/go-performance-server .
cd ../..

echo "📦 Setting up Node.js middleware..."
cd middleware/nodejs
npm install
cd ../..

echo "✅ Build complete!"
echo ""
echo "🚀 To start the servers:"
echo "   Go middleware: ./dist/go-performance-server"
echo "   Node.js middleware: cd middleware/nodejs && npm start"
echo "   Frontend: Use a local HTTP server in the dist/ directory"