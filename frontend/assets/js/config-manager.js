class ConfigManager {
    constructor() {
        this.state = {
            currentLanguage: 'go',
            spring: {
                token: null,
                connected: false,
                endpoint: 'http://localhost:8080',
                results: [],
                config: {
                    protocol: 'http',
                    host: 'localhost',
                    port: 8080,
                    basePath: '',
                    timeout: 30000
                }
            },
            node: {
                token: null,
                connected: false,
                endpoint: 'http://localhost:5000',
                results: [],
                config: {
                    protocol: 'http',
                    host: 'localhost',
                    port: 5000,
                    basePath: '',
                    timeout: 30000
                }
            },
            settings: {
                apiVersion: '1',
                retryEnabled: false,
                maxRetries: 3,
                logLevel: 'all'
            }
        };
        
        this.endpointManager = new EndpointManager();
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
        this.state[tech].config = { ...this.state[tech].config, ...config };
        this.rebuildEndpoint(tech);
    }

    rebuildEndpoint(tech) {
        const config = this.state[tech].config;
        this.state[tech].endpoint = `${config.protocol}://${config.host}:${config.port}${config.basePath}`;
    }

    updateSettings(settings) {
        this.state.settings = { ...this.state.settings, ...settings };
    }

    async authenticate(tech, username, password) {
        try {
            const authUrl = this.endpointManager.getBackendUrl(tech, 'auth');
            
            const response = await fetch(authUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'version': this.state.settings.apiVersion
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                this.state[tech].token = data.token;
                this.state[tech].connected = true;
                return { success: true, token: data.token };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            this.state[tech].connected = false;
            return { success: false, error: error.message };
        }
    }

    isConnected(tech) {
        return this.state[tech].connected;
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
        return { ...this.state[tech].config };
    }

    // Helper method to validate configuration
    validateConfig() {
        const errors = [];
        
        // Validate Spring Boot config
        if (!this.state.spring.config.host) {
            errors.push('Spring Boot host is required');
        }
        if (!this.state.spring.config.port) {
            errors.push('Spring Boot port is required');
        }

        // Validate Node.js config
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
}