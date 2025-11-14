# ⚙️ Middleware - Performance Testing Engines

Dual middleware implementation for performance testing - choose between **Go** for maximum performance or **JavaScript** for flexibility.

## 📋 Overview

The middleware servers act as intelligent testing engines that execute load tests against target backends while precisely measuring performance metrics and separating HTTP overhead from language processing time.

![Go](https://img.shields.io/badge/Go-Middleware-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-Middleware-yellow)

## 🎯 Features

### Core Capabilities
- **Concurrent Testing**: Execute thousands of requests in parallel
- **Precise Timing**: Nanosecond-level performance measurements
- **Efficiency Analysis**: Separate HTTP time from language overhead
- **Comprehensive Metrics**: Response times, throughput, success rates, percentiles
- **Flexible Scenarios**: Support for POST, GET, Mixed, and Stress tests

### Dual Implementation Benefits
- **Go Middleware**: Maximum performance, minimal overhead
- **JavaScript Middleware**: Easy customization, rapid development
- **Consistent API**: Same endpoints and response format
- **Cross-Validation**: Compare results between both engines

## 🏗️ Architecture

### System Overview
Middleware Layer
├── 🐹 Go Middleware (Port 8090)
│ ├── High-performance concurrent testing
│ ├── Minimal memory footprint
│ └── Native goroutine concurrency
└── ⚡ JavaScript Middleware (Port 3000)
├── Easy customization and extension
├── NPM ecosystem integration
└── Familiar JavaScript tooling

text

### Request Flow
Frontend → Middleware API → Execute Load Test → Target Backend
↓
Calculate Metrics → Efficiency Analysis → Return Results

text

## 🐹 Go Middleware

### Features
- **Native Concurrency**: Goroutine-based parallel execution
- **Precise Timing**: Nanosecond-level timing measurements
- **Memory Efficient**: Minimal allocation, native GC
- **High Throughput**: Optimized for maximum request rates

### API Endpoints

**Health Check:**
```http
GET /api/health
Execute Test:

http
POST /api/go-test
Content-Type: application/json

{
  "tech": "spring|node",
  "scenario": "post|get|mixed|stress", 
  "count": 1000,
  "target": "2",
  "concurrency": 10,
  "endpoint": "http://localhost:8080",
  "token": "jwt-token"
}
File Structure
text
go/
├── main.go                 # HTTP server and API endpoints
├── http-client.go          # Concurrent HTTP client with timing
├── performance-calc.go     # Performance analysis utilities
└── go.mod                 # Go module dependencies
Quick Start
Prerequisites:

Go 1.21 or later

Running the Server:

bash
cd middleware/go

# Development mode
go run .

# Production build
go build -o go-performance-server .

# Run binary
./go-performance-server
Testing:

bash
# Health check
curl http://localhost:8090/api/health

# Test execution
curl -X POST http://localhost:8090/api/go-test \
  -H "Content-Type: application/json" \
  -d '{
    "tech": "spring",
    "scenario": "post",
    "count": 100,
    "target": "2", 
    "concurrency": 5,
    "endpoint": "http://localhost:8080",
    "token": "test-token"
  }'
⚡ JavaScript Middleware
Features
Flexible Configuration: Easy to modify test scenarios

NPM Ecosystem: Rich library support

Rapid Development: Quick iteration and testing

Familiar Stack: JavaScript throughout the stack

API Endpoints
Health Check:

http
GET /api/health
Execute Test:

http
POST /api/js-test
Content-Type: application/json

{
  "tech": "spring|node",
  "scenario": "post|get|mixed|stress",
  "count": 1000, 
  "target": "2",
  "concurrency": 10,
  "endpoint": "http://localhost:8080",
  "token": "jwt-token"
}
File Structure
text
nodejs/
├── server.js              # Express.js server and routes
├── performance-client.js  # HTTP client and performance measurement
├── package.json          # Dependencies and scripts
└── package-lock.json     # Lock file
Quick Start
Prerequisites:

Node.js 16 or later

npm or yarn

Setup and Running:

bash
cd middleware/nodejs

# Install dependencies
npm install

# Development mode
npm start

# Development with auto-restart
npm run dev

# Production mode
NODE_ENV=production npm start
Testing:

bash
# Health check
curl http://localhost:3000/api/health

# Test execution
curl -X POST http://localhost:3000/api/js-test \
  -H "Content-Type: application/json" \
  -d '{
    "tech": "node", 
    "scenario": "get",
    "count": 100,
    "target": "2",
    "concurrency": 5,
    "endpoint": "http://localhost:5000",
    "token": "test-token"
  }'
📊 Performance Comparison
Go Advantages
Higher Throughput: 2-3x more requests/second

Lower Memory: 10x less memory usage

Better Concurrency: Native goroutine support

Faster Execution: Compiled performance

JavaScript Advantages
Faster Development: Quick iteration and debugging

Rich Ecosystem: NPM packages and tools

Easy Integration: Same language as frontend

Flexible Configuration: Runtime configuration changes

🔧 Configuration
Environment Variables
Go Middleware:

bash
export PORT=8090
export LOG_LEVEL=info
export TIMEOUT=30s
JavaScript Middleware:

bash
export PORT=3000
export NODE_ENV=production
export LOG_LEVEL=info
Request Parameters
Parameter	Type	Description	Default
tech	string	Backend technology (spring or node)	Required
scenario	string	Test scenario (post, get, mixed, stress)	Required
count	number	Number of requests to execute	1000
target	string	Target user ID for messages	"2"
concurrency	number	Simultaneous requests	10
endpoint	string	Backend base URL	Required
token	string	Authentication token	Required
📈 Response Format
Both middleware implementations return the same response structure:

json
{
  "success": true,
  "metrics": {
    "totalRequests": 1000,
    "successfulRequests": 950,
    "failedRequests": 50,
    "successRate": 95.0,
    "throughput": 150.5,
    "totalTime": { "avg": 45.2, "min": 12.1, "max": 210.5, "p95": 89.3, "p99": 156.7 },
    "httpTime": { "avg": 35.1, "min": 10.2, "max": 180.3, "p95": 75.6, "p99": 140.2 },
    "languageTime": { "avg": 10.1, "min": 1.9, "max": 30.2, "p95": 13.7, "p99": 16.5 },
    "performanceAnalysis": {
      "totalDuration": 45200.5,
      "httpDuration": 35100.2,
      "languageDuration": 10100.3,
      "efficiencyScore": 77.6
    }
  },
  "appRuntime": 45200.5
}
🚀 Deployment
Go Middleware
Docker:

dockerfile
FROM golang:1.21-alpine
WORKDIR /app
COPY . .
RUN go build -o server .
EXPOSE 8090
CMD ["./server"]
Systemd Service:

ini
[Unit]
Description=Go Performance Middleware
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/go-middleware
ExecStart=/opt/go-middleware/go-performance-server
Restart=on-failure

[Install]
WantedBy=multi-user.target
JavaScript Middleware
Docker:

dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
PM2:

javascript
module.exports = {
  apps: [{
    name: 'js-middleware',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
🧪 Testing
Unit Tests
Go Middleware:

bash
cd middleware/go
go test ./...
JavaScript Middleware:

bash
cd middleware/nodejs
npm test
Integration Tests
bash
# Test both middleware servers
./test-middleware.sh
Load Testing
bash
# Test middleware performance
./load-test-middleware.sh
📊 Monitoring
Health Checks
bash
# Go Middleware
curl -f http://localhost:8090/api/health

# JavaScript Middleware
curl -f http://localhost:3000/api/health
Key Metrics
Request Rate: Requests per second

Error Rate: Failed request percentage

Response Time: P95 and P99 latencies

Memory Usage: Heap and RSS memory

CPU Utilization: Processing overhead

🔍 Debugging
Go Middleware
bash
# Debug mode
go run -race .

# Memory profiling
go tool pprof http://localhost:8090/debug/pprof/heap
JavaScript Middleware
bash
# Debug mode
DEBUG=* npm start

# Memory profiling
node --inspect server.js
🛠️ Development
Adding New Features
Implement in both Go and JavaScript middleware

Maintain consistent API responses

Update frontend to handle new features

Test with both middleware implementations

Code Standards
Go: Follow standard Go conventions and effective Go practices

JavaScript: Use ESLint with standard configuration

API: Maintain consistent request/response formats

Documentation: Update README for new features

📄 License
MIT License

🤝 Contributing
Follow the language-specific code style

Maintain API compatibility between implementations

Add tests for new features

Update documentation accordingly