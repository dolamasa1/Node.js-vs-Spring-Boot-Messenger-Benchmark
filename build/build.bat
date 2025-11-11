@echo off
echo 🔨 Building Performance Testing Suite...

echo 📦 Building frontend assets...
if not exist dist\assets\js mkdir dist\assets\js
if not exist dist\assets\css mkdir dist\assets\css
if not exist dist\config mkdir dist\config

:: Copy frontend files
copy index.html dist\
copy assets\css\style.css dist\assets\css\
copy assets\js\*.js dist\assets\js\
copy config\endpoints.js dist\config\

echo 📦 Building Go middleware...
cd middleware\go
go build -o ..\..\dist\go-performance-server.exe .
cd ..\..

echo 📦 Setting up Node.js middleware...
cd middleware\nodejs
npm install
cd ..\..

echo ✅ Build complete!
echo.
echo 🚀 To start the servers:
echo    Go middleware: dist\go-performance-server.exe
echo    Node.js middleware: cd middleware\nodejs && npm start
echo    Frontend: Use a local HTTP server in the dist directory