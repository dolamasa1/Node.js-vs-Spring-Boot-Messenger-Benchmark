// Gateway client - only routes to middleware, no testing logic
class PerformanceClient {
    constructor() {
        // No testing logic here - just configuration
    }

    // Only used for JavaScript middleware communication
    async executeJSTest(config) {
        try {
            const response = await fetch('http://localhost:3000/api/js-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }

            return await response.json();
        } catch (error) {
            console.error('JS middleware test failed:', error);
            throw error;
        }
    }

    // Only used for Go middleware communication  
    async executeGoTest(config) {
        try {
            const response = await fetch('http://localhost:8090/api/go-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Go middleware test failed:', error);
            throw error;
        }
    }

    // Simple health check methods
    async checkGoHealth() {
        try {
            const response = await fetch('http://localhost:8090/api/health');
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    async checkJSHealth() {
        try {
            const response = await fetch('http://localhost:3000/api/health');
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}