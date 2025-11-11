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
        
        const tests = [];
        
        if (testConfig.spring.connected) {
            tests.push(this.runGoTest('spring', testConfig));
        }
        
        if (testConfig.node.connected) {
            tests.push(this.runGoTest('node', testConfig));
        }

        await Promise.all(tests);
    }

    async executeJSTests(testConfig) {
        console.log('Executing JS tests with config:', testConfig);
        
        const tests = [];
        
        if (testConfig.spring.connected) {
            tests.push(this.runJSTest('spring', testConfig));
        }
        
        if (testConfig.node.connected) {
            tests.push(this.runJSTest('node', testConfig));
        }

        await Promise.all(tests);
    }

    async runGoTest(tech, testConfig) {
        try {
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
                
                // Update metrics display
                if (window.app && window.app.metricsManager) {
                    window.app.metricsManager.updateMetricsDisplay(tech, result.metrics);
                }
                
                // Log results
                if (window.app && window.app.uiManager) {
                    window.app.uiManager.logToConsole(tech, `📊 Go test completed - Success: ${result.metrics.successRate}%`, 'success');
                    window.app.uiManager.logToConsole(tech, `⏱️  App Runtime: ${result.appRuntime}ms`, 'info');
                }
                
                return result.metrics;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error(`Go test failed for ${tech}:`, error);
            if (window.app && window.app.uiManager) {
                window.app.uiManager.logToConsole(tech, `❌ Go test failed: ${error.message}`, 'error');
            }
            throw error;
        }
    }

    async runJSTest(tech, testConfig) {
        try {
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
            if (window.app && window.app.config) {
                window.app.config.state[tech].results = results;
            }

            // Calculate metrics
            const metrics = this.performanceClient.calculateMetrics(results);
            
            // Measure performance
            const performance = await this.performanceClient.measurePerformance({
                endpoint: testConfig[tech].endpoint,
                token: testConfig[tech].token,
                scenario: testConfig.scenario,
                count: testConfig.count,
                target: testConfig.target,
                concurrency: testConfig.concurrency,
                tech: tech
            });

            // Update UI
            if (window.app && window.app.metricsManager) {
                window.app.metricsManager.updateMetricsDisplay(tech, metrics);
            }

            // Log results
            if (window.app && window.app.uiManager) {
                window.app.uiManager.logToConsole(tech, `📊 JS test completed - Success: ${metrics.successRate}%`, 'success');
                window.app.uiManager.logToConsole(tech, `⏱️  Total Duration: ${performance.totalDuration}ms`, 'info');
            }

            return {
                metrics: {
                    ...metrics,
                    performanceAnalysis: {
                        totalDuration: performance.totalDuration,
                        httpDuration: performance.httpDuration,
                        languageDuration: performance.languageDuration,
                        efficiencyScore: performance.efficiencyScore
                    }
                },
                appRuntime: performance.totalDuration
            };

        } catch (error) {
            console.error(`JS test failed for ${tech}:`, error);
            if (window.app && window.app.uiManager) {
                window.app.uiManager.logToConsole(tech, `❌ JS test failed: ${error.message}`, 'error');
            }
            throw error;
        }
    }

    updateProgress(completed, total, tech) {
        this.state.progress.completed = completed;
        this.state.progress.total = total;
        
        if (window.app && window.app.uiManager) {
            window.app.uiManager.updateProgress(completed, total, tech);
        }
    }

    // Helper method to get test status
    getTestStatus() {
        return this.state.testing ? 'running' : 'idle';
    }

    // Method to cancel ongoing tests
    cancelTests() {
        this.state.testing = false;
        if (window.app && window.app.uiManager) {
            window.app.uiManager.logToConsole('spring', 'Tests cancelled by user', 'warning');
            window.app.uiManager.logToConsole('node', 'Tests cancelled by user', 'warning');
        }
    }
}