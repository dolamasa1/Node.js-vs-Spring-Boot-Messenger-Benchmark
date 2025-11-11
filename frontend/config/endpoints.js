const API_ENDPOINTS = {
    // Backend endpoints
    backends: {
        spring: {
            baseUrl: 'http://localhost:8080',
            endpoints: {
                auth: '/api/auth/login',
                sendMessage: '/api/message/send',
                getMessages: '/api/message/message',
                health: '/api/health'
            }
        },
        node: {
            baseUrl: 'http://localhost:5000', 
            endpoints: {
                auth: '/api/auth/login',
                sendMessage: '/api/message/send',
                getMessages: '/api/message/message',
                health: '/api/health'
            }
        }
    },
    
    // Middleware endpoints
    middleware: {
        go: {
            baseUrl: 'http://localhost:8090',
            endpoints: {
                test: '/api/go-test',
                health: '/api/health'
            }
        },
        js: {
            baseUrl: 'http://localhost:3000',
            endpoints: {
                test: '/api/js-test',
                health: '/api/health'
            }
        }
    },

    // Test scenarios
    scenarios: {
        post: {
            name: 'POST Messages',
            description: 'Send multiple messages via POST'
        },
        get: {
            name: 'GET Messages', 
            description: 'Fetch messages via GET'
        },
        mixed: {
            name: 'Mixed Workload',
            description: '50% POST, 50% GET requests'
        },
        stress: {
            name: 'Stress Test',
            description: 'High concurrency rapid fire'
        }
    }
};

class EndpointManager {
    constructor() {
        this.endpoints = API_ENDPOINTS;
    }

    getBackendUrl(tech, endpoint) {
        const backend = this.endpoints.backends[tech];
        return `${backend.baseUrl}${backend.endpoints[endpoint]}`;
    }

    getMiddlewareUrl(middleware, endpoint) {
        const mw = this.endpoints.middleware[middleware];
        return `${mw.baseUrl}${mw.endpoints[endpoint]}`;
    }

    getScenarioConfig(scenario) {
        return this.endpoints.scenarios[scenario];
    }

    getAllScenarios() {
        return Object.keys(this.endpoints.scenarios);
    }
}