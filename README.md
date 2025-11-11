# 🚀 API Performance Benchmark Suite

A comprehensive performance testing dashboard that compares **Spring Boot** vs **Node.js Express** backends with dual middleware testing engines.

## 📋 Overview

This project provides a sophisticated web-based dashboard for performance testing and comparison of different backend technologies. It measures not just HTTP response times but also separates **language overhead** from **network overhead** to give you pure performance insights.

![Architecture](https://img.shields.io/badge/Architecture-Modular-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-1.0-brightgreen)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Optional%20Spring%20Boot-blue)
![Language](https://img.shields.io/badge/Go-Performance%20Engine-orange)

## 🖼️ Dashboard Preview

![Dashboard Screenshot](assets/Screenshot.png)

## 🎯 Key Features

* **🔍 Dual Backend Testing**: Compare Node.js Express and optionally Spring Boot
* **⚡ Dual Middleware Options**: Test using Go or JavaScript as the testing engine
* **📊 Real-time Metrics**: Live performance metrics with beautiful visualizations
* **🔧 Multiple Test Scenarios**: POST, GET, Mixed, and Stress testing
* **⏱️ Advanced Timing**: Separate HTTP time from language processing time
* **📈 Comprehensive Analytics**: Percentiles (P95, P99), throughput, success rates
* **🎨 Modern UI**: Responsive design with real-time console output

## 🏗️ Project Structure

api-performance-benchmark/
├── 🎨 frontend/ # Web dashboard application
├── ⚙️ middleware/ # Performance testing engines
│ ├── 🐹 go/ # Go middleware server
│ └── ⚡ nodejs/ # JavaScript middleware server
├── backend/springboot/ # Optional Spring Boot backend (submodule)
├── 🔨 build/ # Build scripts
└── 📄 README.md # This file

## 🚀 Quick Start

### Prerequisites

* **Go 1.21+** (for Go middleware)
* **Node.js 16+** (for JavaScript middleware)
* **Web Browser** (Chrome, Firefox, Safari, or Edge)

### 1. Clone and Setup

```bash
git clone https://github.com/dolamasa1/API-Performance-Benchmark.git
cd API-Performance-Benchmark
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

## ⚙️ App Workflow — Complete Setup Guide

### 1. Start Your Backend Services (Test Targets)

```bash
# Node.js Express (Port 5000)
# Make sure your Node.js backend is running on http://localhost:5000

# Optional Spring Boot (Port 8080)
# Used only for performance comparison
```

### 2. Start the Middleware Servers

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

### 3. Serve the Frontend

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

### 4. Open the Dashboard

Navigate to **[http://localhost:8000](http://localhost:8000)** in your browser.

#### Quick Verification Checklist

✅ **Backends Running:**

```bash
Node.js: curl http://localhost:5000/api/health
# Optional Spring Boot: curl http://localhost:8080/api/health
```

✅ **Middleware Running:**

```bash
Go: curl http://localhost:8090/api/health
JavaScript: curl http://localhost:3000/api/health
```

✅ **Frontend Accessible:**
Open `http://localhost:8000` in your browser.

---

## 🏗️ Optional Backend Submodule

The Spring Boot backend is included as a **Git submodule** for performance comparison. It is **tracked in this repository** but is optional for running the dashboard.

* **Path:** `backend/springboot`
* **Repository:** [raven-messenger-backend](https://github.com/dolamasa1/raven-messenger-backend/tree/4c5e75cbd1b86ba1af45ea62cceb5ac80887c5f5)
* **Commit:** `4c5e75cbd1b86ba1af45ea62cceb5ac80887c5f5`

Initialize the submodule after cloning:

```bash
git submodule update --init --recursive
```

> ⚠️ The dashboard works without this backend; it’s used only for benchmark comparison.

---

## 🎮 Usage

1. Configure Settings: Click ⚙️ to set backend endpoints
2. Authenticate: Connect to Node.js backend (Spring Boot optional)
3. Select Test: Choose scenario, request count, and concurrency
4. Choose Middleware: Switch between Go and JavaScript engines
5. Run Benchmark: Execute tests and monitor real-time results
6. Analyze Results: Compare performance metrics and efficiency

---

## 📄 License

**MIT License © 2025 Ahmed Adel Moghraby**
See LICENSE file for full details.

---

## 👨‍💻 Author

**Ahmed Adel Moghraby**
📧 [ahmed.adel.elmoghraby@gmail.com](mailto:ahmed.adel.elmoghraby@gmail.com)
🌐 [GitHub: dolamasa1](https://github.com/dolamasa1)

### 🧠 About the Author & Project Status

Ahmed Adel Moghraby is a passionate developer focused on system optimization, API architecture, and cross-technology performance measurement.

⚠️ **Project Status:** This repository is still under active development; features and workflows may change in future updates.
