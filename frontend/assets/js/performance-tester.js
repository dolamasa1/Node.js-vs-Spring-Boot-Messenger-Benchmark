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
        console.log('Executing Go tests with config:', testConfig);
        this.state.testing = true;
        this.updateProgress(0, testConfig.count, 'both');
        
        const tests = [];
        
        if (testConfig.spring.connected) {
            tests.push(this.runGoTest('spring', testConfig));
        }
        
        if (testConfig.node.connected) {
            tests.push(this.runGoTest('node', testConfig));
        }

        try {
            const results = await Promise.all(tests);
            console.log('All Go tests completed:', results);
        } catch (error) {
            console.error('Error in Go tests:', error);
        } finally {
            this.state.testing = false;
            this.updateProgress(testConfig.count, testConfig.count, 'both');
        }
    }

    async executeJSTests(testConfig) {
        console.log('Executing JS tests with config:', testConfig);
        this.state.testing = true;
        this.updateProgress(0, testConfig.count, 'both');
        
        const tests = [];
        
        if (testConfig.spring.connected) {
            tests.push(this.runJSTest('spring', testConfig));
        }
        
        if (testConfig.node.connected) {
            tests.push(this.runJSTest('node', testConfig));
        }

        try {
            const results = await Promise.all(tests);
            console.log('All JS tests completed:', results);
        } catch (error) {
            console.error('Error in JS tests:', error);
        } finally {
            this.state.testing = false;
            this.updateProgress(testConfig.count, testConfig.count, 'both');
        }
    }

    async runGoTest(tech, testConfig) {
        try {
            console.log(`Starting Go test for ${tech} with ${testConfig.count} requests`);
            
            const response = await fetch('http://localhost:8090/api/go-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tech: tech,
                    scenario: testConfig.scenario,
                    count: testConfig.count,
                    target: testConfig.target,
                    concurrency: testConfig.concurrency,
                    endpoint: testConfig[tech].endpoint,
                    token: testConfig[tech].token
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${await response.text()}`);
            }

            const result = await response.json();
            
            if (result.success) {
                console.log(`Go test completed for ${tech}:`, result.metrics);
                
                // Store results in config
                if (window.app?.config) {
                    window.app.config.state[tech].results = result.results || [];
                }
                
                // Update metrics display
                if (window.app?.metricsManager) {
                    window.app.metricsManager.updateMetricsDisplay(tech, result.metrics);
                }
                
                // Log results
                if (window.app?.uiManager) {
                    window.app.uiManager.logToConsole(tech, `✅ Go test completed - Success: ${result.metrics.successRate}%`, 'success');
                }
                
                return result.metrics;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error(`Go test failed for ${tech}:`, error);
            if (window.app?.uiManager) {
                window.app.uiManager.logToConsole(tech, `❌ Go test failed: ${error.message}`, 'error');
            }
            
            // Update with empty metrics on failure
            if (window.app?.metricsManager) {
                window.app.metricsManager.updateMetricsDisplay(tech, window.app.metricsManager.createEmptyMetrics());
            }
            throw error;
        }
    }

    async runJSTest(tech, testConfig) {
        try {
            console.log(`Starting JS test for ${tech} with ${testConfig.count} requests`);
            
            // Execute load test and get results
            const results = await this.performanceClient.executeLoadTest({
                endpoint: testConfig[tech].endpoint,
                token: testConfig[tech].token,
                scenario: testConfig.scenario,
                count: testConfig.count,
                target: testConfig.target,
                concurrency: testConfig.concurrency,
                tech: tech
            });

            // Store results in config
            if (window.app?.config) {
                window.app.config.state[tech].results = results;
            }

            // Calculate metrics
            const metrics = this.performanceClient.calculateMetrics(results);
            
            // Update UI
            if (window.app?.metricsManager) {
                window.app.metricsManager.updateMetricsDisplay(tech, metrics);
            }

            // Log results
            if (window.app?.uiManager) {
                window.app.uiManager.logToConsole(tech, `✅ JS test completed - Success: ${metrics.successRate}%`, 'success');
                window.app.uiManager.logToConsole(tech, `⚡ Total Requests: ${metrics.totalRequests}`, 'info');
            }

            return {
                metrics: metrics,
                results: results
            };

        } catch (error) {
            console.error(`JS test failed for ${tech}:`, error);
            if (window.app?.uiManager) {
                window.app.uiManager.logToConsole(tech, `❌ JS test failed: ${error.message}`, 'error');
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