# 🎯 Backend Test Targets - Dual Technology Implementation

This folder contains two identical messaging backend implementations built with different technologies, designed specifically for **performance benchmarking and technology comparison studies**.

## 🏗️ Architecture Overview

```
backend/
├── ☕ springboot/           # Spring Boot Java Backend (Port 8080)
│   ├── Complete REST API implementation
│   ├── JWT authentication system
│   └── Real-time WebSocket support
└── ⬢ nodejs/              # Node.js Express Backend (Port 5000)
    ├── Identical REST API endpoints
    ├── JWT authentication system
    └── Real-time Socket.IO support
```

## 🎯 Purpose & Research Goals

These backends serve as **identical test targets** for the [API Performance Benchmark Suite](https://github.com/dolamasa1/API-Performance-Benchmark), enabling:

- **🔬 Technology Comparison**: Direct performance comparison between Spring Boot and Node.js
- **⚡ Performance Analysis**: Measure response times, throughput, and resource usage
- **📊 Scalability Studies**: Test how each technology handles concurrent loads
- **🎯 API Design Analysis**: Compare implementation patterns for identical requirements

## 📋 Identical Feature Set

Both backends implement the **exact same feature set** with identical API contracts:

### 🔐 Authentication System
- **JWT-based authentication** with refresh tokens
- **HttpOnly cookie security** for token storage
- **BCrypt password hashing** with consistent security levels
- **User registration and login** with identical request/response formats

### 💬 Messaging Core
- **User-to-user messaging** with text and file support
- **Group chat functionality** with member management
- **File upload/download** for multiple file types
- **Message pagination** and history retrieval

### 👥 User Management
- **User profiles** with bio, avatar, and personal information
- **User search** and discovery functionality
- **Online status** tracking and presence indicators

### 👤 Profile System
- **Profile image management** with upload/crop functionality
- **Personal information updates** (name, phone, bio, gender)
- **Secure profile access** controls

### 👥 Group Features
- **Group creation** and management
- **Member invitations** and join functionality
- **Group message history** with pagination

## 🔌 Shared API Endpoints

Both backends expose identical REST API endpoints:

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User authentication |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/logout` | User logout |
| `GET` | `/api/auth/verify` | Token validation |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user/` | Get all users |
| `GET` | `/api/user/find` | Find user by ID |
| `GET` | `/api/user/profile` | Get user profile |
| `GET` | `/api/user/get` | Get user by UUID |

### Messaging
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/message/message` | Get messages (user/group) |
| `POST` | `/api/message/send` | Send text message |
| `POST` | `/api/message/upload` | Upload file message |
| `GET` | `/api/message/download` | Download files |

### Profile Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/profile/` | Get my profile |
| `PUT` | `/api/profile/image` | Update profile image |
| `PUT` | `/api/profile/user` | Update username |
| `PUT` | `/api/profile/phone` | Update phone number |

### Group Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/group/check` | Check group details |
| `POST` | `/api/group/create` | Create new group |
| `POST` | `/api/group/join` | Join existing group |
| `GET` | `/api/group/member` | Get group members |

### Health & Monitoring
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/check` | Version compatibility |

## 🚀 Quick Setup for Performance Testing

### Prerequisites
- **Java 17+** (for Spring Boot)
- **Node.js 18+** (for Node.js Express)
- **MySQL 8.0+** database
- **API Performance Benchmark Suite** (main project)

### 1. Database Setup
```sql
-- Create database for both backends (can use same or separate)
CREATE DATABASE messenger_db;
CREATE USER 'messenger_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON messenger_db.* TO 'messenger_user'@'localhost';
```

### 2. Spring Boot Backend Setup
```bash
cd backend/springboot

# Configure database in application.properties
# Update: spring.datasource.url, username, password

# Build and run
mvn clean install
mvn spring-boot:run

# Server starts on: http://localhost:8080
```

### 3. Node.js Express Backend Setup
```bash
cd backend/nodejs

# Configure environment
cp .env.example .env
# Update: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

# Install and run
npm install
npm start

# Server starts on: http://localhost:5000
```

### 4. Verify Both Backends
```bash
# Test Spring Boot
curl http://localhost:8080/api/health

# Test Node.js Express  
curl http://localhost:5000/api/health

# Both should return healthy status
```

## 🧪 Testing with Performance Benchmark Suite

### 1. Configure Dashboard
1. Open the **API Performance Benchmark Suite** dashboard
2. Click **⚙️ Settings**
3. Configure both backend endpoints:
   - **Spring Boot**: `http://localhost:8080`
   - **Node.js Express**: `http://localhost:5000`

### 2. Authentication Setup
- Use default credentials: `admin` / `password`
- Or register new users through the dashboard
- Both backends maintain separate user databases

### 3. Run Performance Tests
- Select test scenarios (POST, GET, Mixed, Stress)
- Choose request count and concurrency levels
- Execute tests using either Go or JavaScript middleware
- Compare real-time metrics between both backends

## 📊 Performance Comparison Metrics

When testing with the benchmark suite, you'll be able to compare:

### Response Time Analysis
- **Average Response Time**: Overall request processing speed
- **P95/P99 Latency**: Tail latency for worst-case performance
- **Min/Max Response Times**: Performance consistency

### Throughput & Concurrency
- **Requests/Second**: Maximum throughput capacity
- **Concurrency Handling**: Performance under parallel loads
- **Success Rates**: Reliability under stress conditions

### Resource Efficiency
- **Memory Usage**: RAM consumption patterns
- **CPU Utilization**: Processing efficiency
- **Connection Handling**: Concurrent connection management

### Language-Specific Metrics
- **Startup Time**: Application initialization speed
- **Warm-up Performance**: JIT compilation vs interpreted performance
- **Garbage Collection Impact**: Memory management overhead

## 🔧 Technology Stack Comparison

| Aspect | Spring Boot (Java) | Node.js Express |
|--------|-------------------|-----------------|
| **Runtime** | JVM (HotSpot) | Node.js V8 |
| **Concurrency** | Thread-per-request | Event Loop |
| **Memory Model** | Object-oriented with GC | Prototype-based with GC |
| **Type System** | Static, strong typing | Dynamic, weak typing |
| **Database ORM** | Spring Data JPA/Hibernate | Custom MySQL layer |
| **Real-time** | Spring WebSocket | Socket.IO |
| **Build Tool** | Maven | npm |
| **Startup Time** | Slower (JVM warmup) | Faster (interpreted) |

## 🎯 Research Use Cases

### 1. **Performance Benchmarking**
- Compare raw request processing speed
- Analyze memory and CPU usage patterns
- Measure scalability under high loads

### 2. **Architecture Analysis**
- Study different concurrency models
- Compare database interaction patterns
- Analyze error handling approaches

### 3. **Development Experience**
- Compare development velocity
- Analyze debugging and troubleshooting
- Evaluate deployment complexity

### 4. **Production Readiness**
- Assess monitoring and observability
- Compare security implementations
- Evaluate documentation quality

## 📈 Expected Performance Patterns

Based on typical characteristics:

### Spring Boot (Java)
- **✅ Strengths**: Better CPU-bound performance, strong typing, enterprise features
- **❌ Weaknesses**: Higher memory usage, slower startup, more complex configuration
- **🎯 Best For**: CPU-intensive operations, large teams, enterprise environments

### Node.js Express (JavaScript)
- **✅ Strengths**: Faster startup, lower memory footprint, excellent I/O performance
- **❌ Weaknesses**: Callback complexity, single-threaded limitations, dynamic typing issues
- **🎯 Best For**: I/O-intensive applications, real-time features, rapid prototyping

## 🔬 Testing Scenarios

### 1. **Basic CRUD Operations**
- User registration and authentication
- Profile updates and management
- Simple message sending

### 2. **File Operations**
- Image upload and processing
- File download performance
- Storage efficiency comparison

### 3. **Real-time Communication**
- WebSocket connection handling
- Message broadcasting efficiency
- Connection scaling tests

### 4. **Stress Testing**
- High concurrent user simulation
- Database connection pooling
- Memory leak detection

## 🐛 Troubleshooting Common Issues

### Database Connection Problems
```bash
# Verify MySQL is running
sudo systemctl status mysql

# Check database permissions
mysql -u messenger_user -p
USE messenger_db;
SHOW TABLES;
```

### Port Conflicts
```bash
# Check if ports are available
netstat -tulpn | grep :8080
netstat -tulpn | grep :5000

# Kill processes if needed
kill -9 $(lsof -t -i:8080)
```

### Authentication Issues
- Verify JWT secret keys match expected values
- Check CORS configuration for frontend access
- Validate database user permissions

### Performance Testing Issues
- Ensure sufficient system resources (RAM, CPU)
- Monitor database performance during tests
- Check network connectivity between services

## 📚 Additional Resources

### Spring Boot Backend
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security JWT Guide](https://spring.io/guides/tutorials/spring-security-and-angular-js/)
- [Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)

### Node.js Express Backend  
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [JWT Implementation Guide](https://github.com/auth0/node-jsonwebtoken)

### Performance Testing
- [API Performance Benchmark Suite](https://github.com/dolamasa1/API-Performance-Benchmark)
- [Load Testing Best Practices](https://k6.io/docs/test-types/load-testing/)
- [Performance Monitoring Tools](https://grafana.com/docs/grafana/latest/)

## 🤝 Contributing to Backend Development

We welcome contributions to both backend implementations:

### Adding New Features
1. Implement feature in both Spring Boot and Node.js
2. Maintain identical API contracts
3. Update documentation for both implementations
4. Test with performance benchmark suite

### Performance Optimizations
1. Identify bottlenecks through benchmarking
2. Apply optimizations to both backends
3. Measure performance impact
4. Document optimization techniques

### Bug Fixes
1. Reproduce issue in both implementations
2. Apply consistent fixes
3. Verify with integration tests
4. Update both README files

## 📄 License

Both backend implementations are released under the MIT License. See individual project directories for specific license details.

## 👨‍💻 Maintainer

**Ahmed Adel Moghraby**  
📧 Email: ahmed.adel.elmoghraby@gmail.com  
🌐 GitHub: [dolamasa1](https://github.com/dolamasa1)

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Microservices architecture variants
- [ ] GraphQL API implementations
- [ ] Advanced caching strategies (Redis)
- [ ] Containerized deployment examples
- [ ] Advanced monitoring and metrics

### Research Extensions
- [ ] Additional backend technologies (Go, Python, .NET)
- [ ] Different database systems (PostgreSQL, MongoDB)
- [ ] Various authentication methods (OAuth2, OpenID Connect)
- [ ] Advanced real-time features (video/audio calling)

---

**Built with ❤️ for the performance testing community**  
*These identical backend implementations enable meaningful technology comparisons and help developers make informed architectural decisions.*
