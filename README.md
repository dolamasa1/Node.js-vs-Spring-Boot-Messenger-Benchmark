# 🚀 API Performance Benchmark Suite

A comprehensive performance testing dashboard that compares **Spring Boot** vs **Node.js Express** backends with dual middleware testing engines.

---

## 📋 Overview

This project provides a sophisticated web-based dashboard for performance testing and comparison of different backend technologies. It measures not just HTTP response times but also separates **language overhead** from **network overhead** to give you pure performance insights.

![Architecture](https://img.shields.io/badge/Architecture-Modular-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🎯 Key Features

* **🔍 Dual Backend Testing**: Compare Spring Boot and Node.js Express simultaneously
* **⚡ Dual Middleware Options**: Test using Go or JavaScript as the testing engine
* **📊 Real-time Metrics**: Live performance metrics with beautiful visualizations
* **🔧 Multiple Test Scenarios**: POST, GET, Mixed, and Stress testing
* **⏱️ Advanced Timing**: Separate HTTP time from language processing time
* **📈 Comprehensive Analytics**: Percentiles (P95, P99), throughput, success rates
* **🎨 Modern UI**: Responsive design with real-time console output

---

## 🕿️ Project Structure

```
api-performance-benchmark/
├── 🎨 frontend/          # Web dashboard application
├── ⚙️ middleware/        # Performance testing engines
│   ├── 🐹 go/            # Go middleware server
│   └── ⚡ nodejs/        # JavaScript middleware server
├── 🔨 build/             # Build scripts
└── 📄 README.md          # This file
```

---

## 🚀 Quick Start

### Prerequisites

* **Go 1.21+** (for Go middleware)
* **Node.js 16+** (for JavaScript middleware)
* **Web Browser** (Chrome, Firefox, Safari, or Edge)

### 1. Clone and Setup

```bash
git clone <your-repo>
cd api-performance-benchmark
```

### 2. Build Everything

**Windows:**

```cmd
build\build.bat
```

**Linux/Mac:**

```bash
chmod +x build/build.sh
./build/build.sh
```

---

## 🧭 App Workflow — Complete Setup Guide

### Step 1. Start Your Backend Services (Test Targets)

```bash
# Spring Boot (Port 8080)
# Ensure your Spring Boot app is running on:
http://localhost:8080

# Node.js Express (Port 5000)
# Ensure your Node.js backend is running on:
http://localhost:5000
```

### Step 2. Start the Middleware Servers

**Go Middleware:**

```bash
cd middleware/go
go run .
# Server starts on http://localhost:8090
```

**JavaScript Middleware:**

```bash
cd middleware/nodejs
npm install
npm start
# Server starts on http://localhost:3000
```

### Step 3. Serve the Frontend

```bash
cd frontend

# Option 1: Using Python
python -m http.server 8000

# Option 2: Using Node.js http-server
npx http-server -p 8000

# Option 3: Using PHP
php -S localhost:8000

# Option 4: Using Live Server (VS Code extension)
# Right-click index.html -> "Open with Live Server"
```

### Step 4. Open the Dashboard

Visit: [http://localhost:8000](http://localhost:8000)

---

## ✅ Quick Verification Checklist

### Backends Running

```bash
Spring Boot: curl http://localhost:8080/api/health
Node.js:     curl http://localhost:5000/api/health
```

### Middleware Running

```bash
Go:          curl http://localhost:8090/api/health
JavaScript:  curl http://localhost:3000/api/health
```

### Frontend Accessible

Visit [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🎮 Usage

1. **Configure Settings:** Click ⚙️ to set backend endpoints.
2. **Authenticate:** Connect to Spring Boot and Node.js backends.
3. **Select Test:** Choose scenario, request count, and concurrency.
4. **Choose Middleware:** Switch between Go and JavaScript engines.
5. **Run Benchmark:** Execute tests and monitor real-time results.
6. **Analyze Results:** Compare performance metrics and efficiency.

---

## 📊 Test Scenarios

| Scenario       | Description                         | Use Case              |
| -------------- | ----------------------------------- | --------------------- |
| POST Messages  | Send multiple messages via POST API | Write-heavy workloads |
| GET Messages   | Fetch messages via GET API          | Read-heavy workloads  |
| Mixed Workload | 50% POST, 50% GET requests          | Real-world simulation |
| Stress Test    | High concurrency rapid fire         | System limits testing |

---

## 🔧 Configuration

**Default Endpoints**

* Spring Boot: `http://localhost:8080`
* Node.js Express: `http://localhost:5000`
* Go Middleware: `http://localhost:8090`
* JavaScript Middleware: `http://localhost:3000`

**Environment Setup:**

```
SPRING_BOOT_URL=http://localhost:8080
NODE_EXPRESS_URL=http://localhost:5000
GO_MIDDLEWARE_URL=http://localhost:8090
JS_MIDDLEWARE_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

**CORS Errors:**

* Serve frontend via HTTP server, not file:// protocol.
* Ensure backends have proper CORS configuration.

**Connection Failures:**

* Verify backend services are running.
* Check firewall and port accessibility.

**Test Failures:**

* Check backend API availability.
* Verify authentication tokens.
* Review console logs for specific errors.

**Debug Mode:**

* Enable detailed logging in Settings.
* Check browser Developer Tools console.
* Review middleware server logs.

---

## 🛠️ Development

**Adding New Backends:**

* Update configuration in Settings modal.
* Implement authentication logic.
* Add API endpoints in config.
* Test with existing middleware.

**Extending Test Scenarios:**

* Define a new scenario in frontend config.
* Update both middleware implementations.
* Add UI controls and validation.
* Test across all components.

---

## 📄 License

MIT License — see **LICENSE** file for details.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Add tests if applicable.
5. Submit a pull request.

---

## 📞 Support

* Check the Troubleshooting section.
* Review console logs and error messages.
* Create an issue in the repository.

Built with ❤️ for performance testing enthusiasts.
