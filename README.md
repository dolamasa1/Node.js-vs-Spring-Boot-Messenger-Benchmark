# 🚀 API Performance Benchmark Suite

A comprehensive performance testing platform that compares **Spring Boot vs Node.js** backends with real-time analytics and advanced metrics visualization.

![Architecture](https://img.shields.io/badge/Architecture-Modular-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Version](https://img.shields.io/badge/Version-2.0-brightgreen)
![Backends](https://img.shields.io/badge/Backends-Spring%20Boot%20%7C%20Node.js-blue)
![Middleware](https://img.shields.io/badge/Middleware-Go%20Only-orange)

## 📋 Overview

Enterprise-grade performance testing dashboard featuring dual backend implementations with identical API contracts, enabling precise technology comparison and real-time performance analytics.

## 🖼️ Dashboard Preview

![Dashboard Screenshot](assets/Screenshot.png)

## 🏗️ Architecture

```
api-performance-benchmark/
├── 🎨 frontend/                 # Performance Testing Dashboard (Port 8000)
├── ⚙️ middleware/go/           # Go Performance Engine (Port 8090)
├── ☕ backend/springboot/       # Spring Boot Backend (Port 8080 + 5001)
├── ⬢ backend/nodejs/           # Node.js Backend (Port 5000)
└── 🔨 build/                   # Build scripts
```

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (Spring Boot)
- **Node.js 18+** (Node.js backend & frontend)
- **Go 1.21+** (Middleware)
- **MySQL 8.0+** (Database)

### 1. Clone & Setup
```bash
git clone https://github.com/dolamasa1/API-Performance-Benchmark.git
cd API-Performance-Benchmark

# Initialize submodules
git submodule update --init --recursive
```

### 2. Database Setup
```sql
CREATE DATABASE messenger_db;
CREATE USER 'messenger_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON messenger_db.* TO 'messenger_user'@'localhost';
```

### 3. Start Backends
**Spring Boot (Port 8080):**
```bash
cd backend/springboot
mvn clean install
mvn spring-boot:run
```

**Node.js (Port 5000):**
```bash
cd backend/nodejs
npm install
npm start
```

### 4. Start Go Middleware (Port 8090)
```bash
cd middleware/go
go run *.go
```

### 5. Serve Frontend (Port 8000)
```bash
cd frontend
python -m http.server 8000
# or: npx http-server -p 8000
# or: php -S localhost:8000
```

### 6. Access Dashboard
Open `http://localhost:8000` in your browser.

## ⚡ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Vanilla JS + CSS3 | Performance dashboard with real-time animations |
| **Middleware** | Go 1.21+ | High-performance testing engine |
| **Backend A** | Spring Boot 3.2 + Java 17 | Enterprise Java implementation |
| **Backend B** | Node.js 18 + Express 4.x | JavaScript runtime implementation |
| **Database** | MySQL 8.0 | Data persistence for both backends |

## 🎯 Key Features

### 🔬 Performance Comparison
- **Dual Backend Testing**: Identical API contracts, different technologies
- **Real-time Metrics**: Live performance analytics with animated visualizations
- **Advanced Timing**: Separate HTTP time from language processing overhead
- **Statistical Analysis**: P95/P99 percentiles, throughput, success rates

### 🎨 Enhanced Dashboard
- **Animated Metrics**: Smooth counter animations and real-time updates
- **Responsive Design**: Mobile-first interface with dark theme
- **Progress Tracking**: Live progress bars with completion statistics
- **Console Output**: Color-coded logging with timestamps

### 🧪 Testing Scenarios
- **POST Tests**: Message creation and user registration
- **GET Tests**: User lists and message history
- **Mixed Loads**: Real-world request patterns
- **Stress Testing**: High-concurrency performance limits

## 🔌 API Endpoints (Both Backends)

### Core Endpoints
- `POST /api/auth/login` - JWT authentication
- `POST /api/auth/register` - User registration
- `GET /api/user/` - User search and lists
- `POST /api/message/send` - Send messages
- `POST /api/group/create` - Group management
- `GET /api/health` - System monitoring

### Real-time Features
- **Spring Boot**: Dual WebSocket (Spring + Socket.IO on port 5001)
- **Node.js**: Socket.IO real-time messaging
- **User Presence**: Online/offline status tracking

## ⚡ Performance Characteristics

### Spring Boot (Java)
- **✅ Strengths**: Better CPU performance, strong typing, enterprise features
- **❌ Weaknesses**: Higher memory usage, slower startup
- **🎯 Best For**: CPU-intensive operations, large teams

### Node.js Express
- **✅ Strengths**: Faster startup, better I/O, rapid development
- **❌ Weaknesses**: Single-threaded limitations, callback complexity
- **🎯 Best For**: I/O-intensive apps, real-time features

### Go Middleware
- **Exclusive Engine**: Replaced JavaScript middleware for superior performance
- **High Concurrency**: Goroutine-based request handling
- **Accurate Metrics**: Millisecond-precision timing with real values

## 🛠️ Configuration

### Spring Boot (`application.properties`)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/messenger_db
app.jwt.secret=your-jwt-secret
app.websocket.type=both
```

### Node.js (`.env`)
```env
DB_HOST=localhost
DB_NAME=messenger_db
JWT_SECRET_KEY=your-jwt-secret
PORT=5000
```

### Go Middleware
- **Port**: 8090 (fixed)
- **CORS**: Enabled for frontend integration
- **Concurrency**: Configurable worker pools

## 🧪 Testing Workflow

1. **Configure Settings**: Set backend endpoints and authentication
2. **Authenticate**: Connect to both backends using JWT tokens
3. **Select Scenario**: Choose test type and parameters
4. **Execute Tests**: Run via Go middleware with real-time monitoring
5. **Analyze Results**: Compare metrics with animated visualizations

## 📊 Expected Results

### Typical Performance Patterns
- **Spring Boot**: Consistent performance under CPU load, better type safety
- **Node.js**: Superior I/O handling, faster response for concurrent requests
- **Go Middleware**: 3-5x higher throughput vs deprecated JavaScript version

### Metric Comparisons
- **Response Times**: Real millisecond measurements (not zeros)
- **Throughput**: Requests per second based on actual test duration
- **Success Rates**: HTTP status code-based accuracy
- **Resource Usage**: Memory and CPU efficiency analysis

## 🐛 Troubleshooting

### Quick Verification
```bash
# Check all services
curl http://localhost:8080/api/health  # Spring Boot
curl http://localhost:5000/api/health  # Node.js  
curl http://localhost:8090/api/health  # Go Middleware

# Check ports
netstat -tulpn | grep -E ':(8080|5000|8090|8000)'
```

### Common Issues
- **CORS Errors**: Serve frontend via HTTP server, not file protocol
- **Database Connection**: Verify MySQL is running and credentials match
- **Authentication**: Check JWT tokens and backend connectivity
- **Port Conflicts**: Ensure ports 8080, 5000, 8090, 8000 are available

## 📚 Component Documentation

- [**Frontend Dashboard**](./frontend/README.md) - Real-time testing interface
- [**Backend Comparison**](./backend/README.md) - Spring Boot vs Node.js
- [**Go Middleware**](./middleware/go/README.md) - Performance testing engine
- [**Configuration**](./config/README.md) - Endpoint and settings management

## 🔮 Roadmap

### Next Version (v2.1)
- [ ] Advanced message encryption
- [ ] Push notifications integration
- [ ] Microservices architecture variants
- [ ] Kubernetes deployment examples

### Research Extensions
- [ ] Additional backend technologies (Go, Python, .NET)
- [ ] Different database systems (PostgreSQL, MongoDB)
- [ ] Advanced caching strategies (Redis)

## 📄 License

**MIT License** - See LICENSE file for full details.

## 👨‍💻 Author

**Ahmed Adel Moghraby**  
📧 [ahmed.adel.elmoghraby@gmail.com](mailto:ahmed.adel.elmoghraby@gmail.com)  
🌐 [GitHub: dolamasa1](https://github.com/dolamasa1)

---

**Built for precision performance analysis**  
*Identical features, different technologies, accurate comparisons*
