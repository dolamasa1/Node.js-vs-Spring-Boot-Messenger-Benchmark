// Simple endpoints configuration - Direct property reading
class EndpointsConfig {
    constructor() {
        this.config = {};
        this.loaded = false;
    }

    // Simple synchronous initialization
    initialize() {
        if (this.loaded) return;

        try {
            // For now, we'll use direct configuration
            // In a real app, you could fetch this from properties file
            this.config = this.getDefaultConfig();
            this.loaded = true;
            console.log('✅ Endpoints configuration loaded');
        } catch (error) {
            console.error('❌ Failed to load endpoints configuration:', error);
            this.config = this.getDefaultConfig();
            this.loaded = true;
        }
    }

    getDefaultConfig() {
        return {
            backends: {
                spring: {
                    protocol: 'http',
                    host: 'localhost',
                    port: 8080,
                    basePath: '',
                    endpoints: {
                        auth: '/api/auth/login',
                        sendMessage: '/api/message/send',
                        getMessages: '/api/message/message',
                        health: '/api/health'
                    }
                },
                node: {
                    protocol: 'http',
                    host: 'localhost', 
                    port: 5000,
                    basePath: '',
                    endpoints: {
                        auth: '/api/auth/login',
                        sendMessage: '/api/message/send',
                        getMessages: '/api/message/message',
                        health: '/api/health'
                    }
                }
            },
            middleware: {
                go: {
                    protocol: 'http',
                    host: 'localhost',
                    port: 8090,
                    endpoints: {
                        test: '/api/go-test',
                        health: '/api/health'
                    }
                }
            },
            scenarios: {
                post: { name: 'POST Messages', description: 'Send multiple messages via POST' },
                get: { name: 'GET Messages', description: 'Fetch messages via GET' },
                mixed: { name: 'Mixed Workload', description: '50% POST, 50% GET requests' },
                stress: { name: 'Stress Test', description: 'High concurrency rapid fire' }
            }
        };
    }

    // Get backend URL
    getBackendUrl(tech, endpoint) {
        const backend = this.config.backends[tech];
        if (!backend) throw new Error(`Unknown backend: ${tech}`);
        
        const path = backend.endpoints[endpoint];
        if (!path) throw new Error(`Unknown endpoint: ${endpoint} for ${tech}`);
        
        return `${backend.protocol}://${backend.host}:${backend.port}${backend.basePath}${path}`;
    }

    // Get middleware URL
    getMiddlewareUrl(endpoint) {
        const middleware = this.config.middleware.go;
        const path = middleware.endpoints[endpoint];
        
        if (!path) throw new Error(`Unknown middleware endpoint: ${endpoint}`);
        
        return `${middleware.protocol}://${middleware.host}:${middleware.port}${path}`;
    }

    // Get headers for specific backend
    getBackendHeaders(tech, additionalHeaders = {}) {
        // Different backends might have different header requirements
        const baseHeaders = {
            'Content-Type': 'application/json'
        };

        // Add version header if the backend requires it
        // This would be specific to each backend's API contract
        if (tech === 'spring' || tech === 'node') {
            baseHeaders['version'] = '1'; // Backend API version
        }

        return { ...baseHeaders, ...additionalHeaders };
    }

    // Get headers for middleware
    getMiddlewareHeaders(additionalHeaders = {}) {
        return {
            'Content-Type': 'application/json',
            ...additionalHeaders
        };
    }

    // Get scenario configuration
    getScenarioConfig(scenario) {
        return this.config.scenarios[scenario];
    }

    // Get all scenarios
    getAllScenarios() {
        return Object.keys(this.config.scenarios);
    }

    // Get backend configuration for settings
    getBackendConfig(tech) {
        return { ...this.config.backends[tech] };
    }

    // Get middleware configuration
    getMiddlewareConfig() {
        return { ...this.config.middleware.go };
    }
}

// Create and initialize global instance
const endpointsConfig = new EndpointsConfig();
endpointsConfig.initialize();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = endpointsConfig;
} else {
    // Browser global
    window.endpointsConfig = endpointsConfig;
}