class ConfigManager {
    constructor() {
        this.state = {
            currentLanguage: 'go',
            spring: {
                connected: false,
                token: null,
                endpoint: '',
                config: {
                    protocol: 'http',
                    host: 'localhost',
                    port: 8080,
                    basePath: '',
                    timeout: 30000
                },
                results: []
            },
            node: {
                connected: false,
                token: null,
                endpoint: '',
                config: {
                    protocol: 'http',
                    host: 'localhost',
                    port: 5000,
                    basePath: '',
                    timeout: 30000
                },
                results: []
            },
            settings: {
                apiVersion: '1',
                retryEnabled: false,
                maxRetries: 3,
                logLevel: 'all'
            }
        };
        
        // Initialize endpoints
        this.rebuildEndpoint('spring');
        this.rebuildEndpoint('node');
    }

async authenticate(tech, username, password) {
    try {
        if (!this.state[tech]) {
            throw new Error(`Technology ${tech} not configured`);
        }

        // Build auth URL directly
        const config = this.state[tech].config;
        const authUrl = `${config.protocol}://${config.host}:${config.port}${config.basePath}/api/auth/login`;
        
        console.log(`Attempting authentication for ${tech} at: ${authUrl}`);

        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'version': this.state.settings.apiVersion
            },
            body: JSON.stringify({ username, password })
        });

        console.log(`Auth response status for ${tech}:`, response.status);

        if (response.ok) {
            const data = await response.json();
            this.state[tech].token = data.token;
            this.state[tech].connected = true;
            console.log(`✓ ${tech} authentication successful`);
            return { success: true, token: data.token };
        } else {
            const errorText = await response.text();
            console.log(`Auth failed for ${tech}:`, errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
    } catch (error) {
        console.error(`Authentication error for ${tech}:`, error);
        this.state[tech].connected = false;
        this.state[tech].token = null;
        return { success: false, error: error.message };
    }
}
    get currentLanguage() {
        return this.state.currentLanguage;
    }

    set currentLanguage(language) {
        this.state.currentLanguage = language;
    }

    get spring() {
        return this.state.spring;
    }

    get node() {
        return this.state.node;
    }

    updateTechConfig(tech, config) {
        if (this.state[tech]) {
            this.state[tech].config = { ...this.state[tech].config, ...config };
            this.rebuildEndpoint(tech);
        }
    }

    rebuildEndpoint(tech) {
        if (this.state[tech]) {
            const config = this.state[tech].config;
            this.state[tech].endpoint = `${config.protocol}://${config.host}:${config.port}${config.basePath}`;
        }
    }

    updateSettings(settings) {
        this.state.settings = { ...this.state.settings, ...settings };
    }

    isConnected(tech) {
        return this.state[tech]?.connected || false;
    }

    getConnectedTechnologies() {
        const connected = [];
        if (this.state.spring.connected) connected.push('spring');
        if (this.state.node.connected) connected.push('node');
        return connected;
    }

    resetAll() {
        this.state.spring.results = [];
        this.state.node.results = [];
        this.state.spring.connected = false;
        this.state.node.connected = false;
        this.state.spring.token = null;
        this.state.node.token = null;
    }

    getSettings() {
        return { ...this.state.settings };
    }

    getTechConfig(tech) {
        return this.state[tech] ? { ...this.state[tech].config } : null;
    }

    // Helper method to validate configuration
    validateConfig() {
        const errors = [];
        
        if (!this.state.spring.config.host) {
            errors.push('Spring Boot host is required');
        }
        if (!this.state.spring.config.port) {
            errors.push('Spring Boot port is required');
        }
        if (!this.state.node.config.host) {
            errors.push('Node.js host is required');
        }
        if (!this.state.node.config.port) {
            errors.push('Node.js port is required');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Method to export configuration
    exportConfig() {
        return {
            spring: { ...this.state.spring },
            node: { ...this.state.node },
            settings: { ...this.state.settings },
            currentLanguage: this.state.currentLanguage
        };
    }

    // Method to import configuration
    importConfig(config) {
        if (config.spring) {
            this.state.spring = { ...this.state.spring, ...config.spring };
            this.rebuildEndpoint('spring');
        }
        if (config.node) {
            this.state.node = { ...this.state.node, ...config.node };
            this.rebuildEndpoint('node');
        }
        if (config.settings) {
            this.state.settings = { ...this.state.settings, ...config.settings };
        }
        if (config.currentLanguage) {
            this.state.currentLanguage = config.currentLanguage;
        }
    }

    // Remove this method since we don't have endpointsConfig
    updateFromEndpointsConfig() {
        console.log('Skipping endpoints config update - using direct configuration');
    }
}