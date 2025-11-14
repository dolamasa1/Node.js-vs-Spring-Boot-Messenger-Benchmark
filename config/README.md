API Testing Dashboard - Configuration
Overview
Configuration files for API testing dashboard backend endpoints and settings.

Files
endpoints.js
Loads and manages API endpoint configuration

Provides URL builders for backends and middleware

Handles configuration loading from JSON file

endpoints.json
Contains all backend configurations (Spring, Node.js)

Defines middleware endpoints (Go, JavaScript)

Includes test scenarios and global settings

Quick Start
javascript
// Load configuration
await endpointsConfig.load();

// Get backend URL
const url = endpointsConfig.getBackendUrl('spring', 'auth');

// Get settings
const settings = endpointsConfig.getSettings();
Configuration Includes
Backends: Spring Boot (8080), Node.js (5000)

Middleware: Go (8090), JavaScript (3000)

Scenarios: POST, GET, Mixed, Stress tests

Settings: Concurrency, timeouts, retries

Usage
Ensure all backend services are running on configured ports before testing.