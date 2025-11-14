class PerformanceTester {
    constructor() {
        this.state = {
            testing: false,
            progress: {
                completed: 0,
                total: 0
            }
        };
        this.performanceClient = new PerformanceClient();
    }

async executeGoTests(testConfig) {
    console.log('Orchestrating Go tests with config:', testConfig);
    this.state.testing = true;
    this.updateProgress(0, 100, 'both');
    
    const tests = [];
    
    // Check if services are connected before running tests
    const connectedTechs = [];
    if (testConfig.spring.connected && testConfig.spring.token) {
        tests.push(this.runMiddlewareTest('spring', testConfig, 'go'));
        connectedTechs.push('spring');
    }
    
    if (testConfig.node.connected && testConfig.node.token) {
        tests.push(this.runMiddlewareTest('node', testConfig, 'go'));
        connectedTechs.push('node');
    }

    if (tests.length === 0) {
        this.uiManager.logToConsole('spring', '❌ No connected services available for testing', 'error');
        this.uiManager.logToConsole('node', '❌ No connected services available for testing', 'error');
        this.state.testing = false;
        return;
    }

    console.log(`Running tests for: ${connectedTechs.join(', ')}`);

    try {
        const results = await Promise.all(tests);
        console.log('All Go middleware tests completed:', results);
    } catch (error) {
        console.error('Error in Go middleware tests:', error);
    } finally {
        this.state.testing = false;
        this.updateProgress(100, 100, 'both');
    }
}


    async runMiddlewareTest(tech, testConfig, middlewareType) {
        try {
            console.log(`Routing ${tech} test to ${middlewareType.toUpperCase()} middleware`);
            
            const middlewareConfig = {
                tech: tech,
                scenario: testConfig.scenario,
                count: testConfig.count,
                target: testConfig.target,
                concurrency: testConfig.concurrency,
                endpoint: testConfig[tech].endpoint,
                token: testConfig[tech].token
            };

            let result;
            if (middlewareType === 'go') {
                result = await this.performanceClient.executeGoTest(middlewareConfig);
            } else {
                result = await this.performanceClient.executeJSTest(middlewareConfig);
            }
            
            if (result.success) {
                console.log(`${middlewareType.toUpperCase()} middleware completed for ${tech}:`, result.metrics);
                
                // Store results from middleware
                if (window.app?.config) {
                    window.app.config.state[tech].results = result.results || [];
                }
                
                // Update metrics display with middleware results
                if (window.app?.metricsManager) {
                    window.app.metricsManager.updateMetricsDisplay(tech, result.metrics);
                }
                
                // Log results from middleware
                if (window.app?.uiManager) {
                    window.app.uiManager.logToConsole(tech, 
                        `✅ ${middlewareType.toUpperCase()} test completed - Success: ${result.metrics.successRate}%`, 
                        'success'
                    );
                }
                
                return result.metrics;
            } else {
                throw new Error(result.error || `Middleware test failed for ${tech}`);
            }
        } catch (error) {
            console.error(`${middlewareType.toUpperCase()} middleware test failed for ${tech}:`, error);
            if (window.app?.uiManager) {
                window.app.uiManager.logToConsole(tech, 
                    `❌ ${middlewareType.toUpperCase()} test failed: ${error.message}`, 
                    'error'
                );
            }
            
            // Update with empty metrics on failure
            if (window.app?.metricsManager) {
                window.app.metricsManager.updateMetricsDisplay(tech, window.app.metricsManager.createEmptyMetrics());
            }
            throw error;
        }
    }

    updateProgress(completed, total, tech) {
        this.state.progress.completed = completed;
        this.state.progress.total = total;
        
        if (window.app?.uiManager) {
            window.app.uiManager.updateProgress(completed, total, tech);
        }
    }

    getTestStatus() {
        return this.state.testing ? 'running' : 'idle';
    }

    cancelTests() {
        this.state.testing = false;
        if (window.app?.uiManager) {
            window.app.uiManager.logToConsole('spring', 'Tests cancelled by user', 'warning');
            window.app.uiManager.logToConsole('node', 'Tests cancelled by user', 'warning');
        }
    }
}