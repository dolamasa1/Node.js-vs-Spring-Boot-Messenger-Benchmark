class PerformanceClient {
    constructor() {
        // Simple gateway client
    }

    async checkGoHealth() {
        try {
            // Direct health check without relying on endpointsConfig
            const response = await fetch('http://localhost:8090/api/health');
            if (response.ok) {
                const data = await response.json();
                return data.status === 'healthy';
            }
            return false;
        } catch (error) {
            console.log('Go health check failed:', error.message);
            return false;
        }
    }

    async executeGoTest(testConfig) {
        try {
            const response = await fetch('http://localhost:8090/api/go-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testConfig)
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

    // Remove JavaScript-related methods since we're ignoring JS middleware
}