// config/endpoints.js - Loads configuration from endpoints.json
class EndpointsConfig {
    constructor() {
        this.config = null;
        this.loaded = false;
    }

    async load() {
        if (this.loaded) return;

        try {
            const response = await fetch('config/endpoints.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.config = await response.json();
            this.loaded = true;
            console.log('✅ Endpoints configuration loaded from JSON');
        } catch (error) {
            console.error('❌ Failed to load endpoints.json:', error);
            // Don't use defaults - fail explicitly so we know config is missing
            throw error;
        }
    }

    // Backend URL builder
    getBackendUrl(tech, endpoint) {
        if (!this.loaded) throw new Error('Configuration not loaded');
        
        const backend = this.config.backends[tech];
        if (!backend) throw new Error(`Unknown backend: ${tech}`);
        
        const path = backend.endpoints[endpoint];
        if (!path) throw new Error(`Unknown endpoint: ${endpoint} for ${tech}`);
        
        return `${backend.protocol}://${backend.host}:${backend.port}${backend.basePath}${path}`;
    }

    // Middleware URL builder  
    getMiddlewareUrl(middlewareType, endpoint) {
        if (!this.loaded) throw new Error('Configuration not loaded');
        
        const middleware = this.config.middleware[middlewareType];
        if (!middleware) throw new Error(`Unknown middleware: ${middlewareType}`);
        
        const path = middleware.endpoints[endpoint];
        if (!path) throw new Error(`Unknown endpoint: ${endpoint} for ${middlewareType}`);
        
        return `${middleware.protocol}://${middleware.host}:${middleware.port}${path}`;
    }

    getSettings() {
        if (!this.loaded) throw new Error('Configuration not loaded');
        return { ...this.config.settings };
    }

    getScenarioConfig(scenario) {
        if (!this.loaded) throw new Error('Configuration not loaded');
        return this.config.scenarios[scenario];
    }

    // Get complete config for debugging
    getConfig() {
        if (!this.loaded) throw new Error('Configuration not loaded');
        return JSON.parse(JSON.stringify(this.config));
    }
}

// Create global instance
const endpointsConfig = new EndpointsConfig();