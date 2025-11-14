# 🎯 Backend - Dual Technology Implementation

This folder contains two identical messaging backend implementations built with **Spring Boot (Java)** and **Node.js Express** for performance benchmarking and technology comparison.

## 🏗️ Architecture

```
backend/
├── ☕ springboot/           # Spring Boot Java Backend (Port 8080 + 5001)
└── ⬢ nodejs/              # Node.js Express Backend (Port 5000)
```

## 🚀 Quick Start

### Prerequisites
- **Java 17+** & **Node.js 18+**
- **MySQL 8.0+**
- **Maven** & **npm**

### Database Setup
```sql
CREATE DATABASE messenger_db;
CREATE USER 'messenger_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON messenger_db.* TO 'messenger_user'@'localhost';
```

### Spring Boot (Port 8080)
```bash
cd springboot
mvn clean install
mvn spring-boot:run
```

### Node.js (Port 5000)
```bash
cd nodejs  
npm install
npm start
```

## ⚡ Technology Differentiation

| Aspect | Spring Boot (Java) | Node.js Express |
|--------|-------------------|-----------------|
| **Port** | 8080 (REST) + 5001 (Socket.IO) | 5000 (REST + Socket.IO) |
| **Real-time** | Dual: Spring WebSocket + Socket.IO | Socket.IO only |
| **Authentication** | JWT + Refresh Token Rotation | JWT with httpOnly cookies |
| **File Storage** | MultipartFile + FileService | Multer middleware |
| **Database** | Spring Data JPA/Hibernate | Custom mysql2 layer |
| **Concurrency** | Thread-per-request | Event Loop |
| **Type System** | Static, strong typing | Dynamic, weak typing |

## 🔌 Core API Endpoints

### Both Implementations Support:
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration  
- `GET /api/user/` - Get users with search
- `POST /api/message/send` - Send messages
- `POST /api/group/create` - Create groups
- `GET /api/health` - Health monitoring

## 🧪 Performance Testing

Use with [API Performance Benchmark Suite](https://github.com/dolamasa1/API-Performance-Benchmark):

```bash
# Configure both endpoints in benchmark suite:
- Spring Boot: http://localhost:8080
- Node.js: http://localhost:5000
```

## 📊 Expected Performance Patterns

### Spring Boot
- **✅ Better CPU performance**, strong typing
- **❌ Higher memory**, slower startup
- **🎯 Enterprise features**, dual WebSocket support

### Node.js  
- **✅ Faster startup**, better I/O performance
- **❌ Single-threaded**, callback complexity
- **🎯 Real-time apps**, rapid development

## 🔧 Configuration

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

## 🐛 Quick Troubleshooting

```bash
# Check ports
netstat -tulpn | grep :8080
netstat -tulpn | grep :5000

# Test endpoints
curl http://localhost:8080/api/health
curl http://localhost:5000/api/health
```

## 📚 Resources

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Express.js Guide](https://expressjs.com/)
- [Benchmark Suite](https://github.com/dolamasa1/API-Performance-Benchmark)

---

**Built for performance comparison studies**  
*Identical features, different technologies, same API contracts*