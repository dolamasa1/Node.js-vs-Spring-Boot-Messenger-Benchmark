const express = require('express');
const cors = require('cors');

// PerformanceClient class - completely self-contained for Node.js middleware
class PerformanceClient {
    constructor() {
        this.requestCount = 0;
        this.results = [];
    }

    async executeLoadTest(config) {
        const { endpoint, token, scenario, count, target, concurrency, tech } = config;
        
        this.results = [];
        const batchSize = concurrency;
        
        for (let i = 0; i < count; i += batchSize) {
            const currentBatchSize = Math.min(batchSize, count - i);
            const batchPromises = [];
            
            for (let j = 0; j < currentBatchSize; j++) {
                const requestIndex = i + j;
                batchPromises.push(this.sendRequest(endpoint, token, scenario, target, requestIndex));
            }
            
            const batchResults = await Promise.all(batchPromises);
            this.results.push(...batchResults);
            
            // Small delay between batches
            if (i + batchSize < count) {
                await this.delay(10);
            }
        }
        
        return this.results;
    }

    async sendRequest(endpoint, token, scenario, target, index) {
        const startTime = Date.now();
        
        try {
            let url, method, options;
            
            if (scenario === 'post' || (scenario === 'mixed' && index % 2 === 0)) {
                // POST request
                method = 'POST';
                url = `${endpoint}/api/message/send?toUserId=${target}&message=TestMessage_${index}_${Date.now()}`;
            } else {
                // GET request
                method = 'GET';
                url = `${endpoint}/api/message/message?type=user&target=${target}&page=0`;
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'version': '1',
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            const duration = Date.now() - startTime;
            
            return {
                success: response.ok,
                status: response.status,
                duration: duration,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            const duration = Date.now() - startTime;
            return {
                success: false,
                error: error.message,
                duration: duration,
                timestamp: new Date().toISOString()
            };
        }
    }

    calculateMetrics(results) {
        if (!results || results.length === 0) {
            return this.getEmptyMetrics();
        }

        const successfulRequests = results.filter(r => r.success);
        const failedRequests = results.filter(r => !r.success);
        const responseTimes = successfulRequests.map(r => r.duration);

        if (responseTimes.length === 0) {
            return this.getEmptyMetrics();
        }

        const sortedTimes = [...responseTimes].sort((a, b) => a - b);
        const totalTime = responseTimes.reduce((sum, time) => sum + time, 0);
        const avgResponseTime = totalTime / responseTimes.length;
        const minResponseTime = Math.min(...responseTimes);
        const maxResponseTime = Math.max(...responseTimes);
        const p95ResponseTime = this.calculatePercentile(sortedTimes, 95);
        const p99ResponseTime = this.calculatePercentile(sortedTimes, 99);

        const timeWindow = Math.max(...results.map(r => new Date(r.timestamp).getTime())) - 
                          Math.min(...results.map(r => new Date(r.timestamp).getTime()));
        const throughput = timeWindow > 0 ? (results.length / (timeWindow / 1000)) : 0;
        const successRate = (successfulRequests.length / results.length) * 100;

        return {
            totalRequests: results.length,
            successfulRequests: successfulRequests.length,
            failedRequests: failedRequests.length,
            successRate: Number(successRate.toFixed(2)),
            throughput: Number(throughput.toFixed(2)),
            avgResponseTime: Number(avgResponseTime.toFixed(2)),
            minResponseTime: Number(minResponseTime.toFixed(2)),
            maxResponseTime: Number(maxResponseTime.toFixed(2)),
            p95ResponseTime: Number(p95ResponseTime.toFixed(2)),
            p99ResponseTime: Number(p99ResponseTime.toFixed(2)),
            errorCount: failedRequests.length
        };
    }

    calculatePercentile(sortedArray, percentile) {
        if (sortedArray.length === 0) return 0;
        
        const index = (percentile / 100) * (sortedArray.length - 1);
        const lowerIndex = Math.floor(index);
        const upperIndex = Math.ceil(index);
        
        if (lowerIndex === upperIndex) {
            return sortedArray[lowerIndex];
        }
        
        const weight = index - lowerIndex;
        return sortedArray[lowerIndex] * (1 - weight) + sortedArray[upperIndex] * weight;
    }

    getEmptyMetrics() {
        return {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            successRate: 0,
            throughput: 0,
            avgResponseTime: 0,
            minResponseTime: 0,
            maxResponseTime: 0,
            p95ResponseTime: 0,
            p99ResponseTime: 0,
            errorCount: 0
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async measurePerformance(config) {
        const totalStart = Date.now();
        
        // Measure HTTP time
        const httpStart = Date.now();
        const results = await this.executeLoadTest(config);
        const httpDuration = Date.now() - httpStart;
        
        // Calculate language overhead
        const totalDuration = Date.now() - totalStart;
        const languageDuration = totalDuration - httpDuration;
        
        const efficiency = (httpDuration / totalDuration) * 100;
        
        return {
            totalDuration,
            httpDuration,
            languageDuration,
            efficiencyScore: efficiency,
            results
        };
    }
}

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize performance client
const performanceClient = new PerformanceClient();

app.post('/api/js-test', async (req, res) => {
    try {
        const { tech, scenario, count, target, concurrency, endpoint, token } = req.body;
        
        console.log(`📨 Received JS test request for ${tech}:`, { 
            scenario, 
            count, 
            target, 
            concurrency,
            endpoint: endpoint ? `${endpoint.substring(0, 30)}...` : 'missing'
        });

        if (!endpoint || !token) {
            return res.status(400).json({
                success: false,
                error: 'Missing endpoint or token'
            });
        }

        // Execute load test
        console.log(`🚀 Starting load test: ${count} requests with concurrency ${concurrency}`);
        const results = await performanceClient.executeLoadTest({
            endpoint,
            token,
            scenario,
            count,
            target,
            concurrency,
            tech
        });

        // Calculate metrics
        const metrics = performanceClient.calculateMetrics(results);
        
        // Measure performance
        const performance = await performanceClient.measurePerformance({
            endpoint,
            token,
            scenario,
            count,
            target,
            concurrency,
            tech
        });

        console.log(`✅ Test completed: ${metrics.successfulRequests}/${metrics.totalRequests} successful`);

        res.json({
            success: true,
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
        });

    } catch (error) {
        console.error('❌ JS test error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'js-performance-server',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('💥 Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Global fetch polyfill for Node.js
if (!global.fetch) {
    global.fetch = require('node-fetch');
}

app.listen(port, () => {
    console.log(`🚀 JS Performance Server running on http://localhost:${port}`);
    console.log(`📊 Endpoints:`);
    console.log(`   POST /api/js-test - Execute JS performance tests`);
    console.log(`   GET  /api/health  - Health check`);
    console.log(`\n💡 Make sure your backend services are running:`);
    console.log(`   Spring Boot: http://localhost:8080`);
    console.log(`   Node.js Express: http://localhost:5000`);
});

// Export for testing
module.exports = app;