const express = require('express');
const cors = require('cors');
const { PerformanceClient } = require('./performance-client');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize performance client
const performanceClient = new PerformanceClient();

app.post('/api/js-test', async (req, res) => {
    try {
        const { tech, scenario, count, target, concurrency, endpoint, token } = req.body;
        
        console.log(`Received JS test request for ${tech}:`, { scenario, count, target, concurrency });

        if (!endpoint || !token) {
            return res.status(400).json({
                success: false,
                error: 'Missing endpoint or token'
            });
        }

        // Execute load test
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
        console.error('JS test error:', error);
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
    console.error('Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

app.listen(port, () => {
    console.log(`🚀 JS Performance Server running on http://localhost:${port}`);
    console.log(`📊 Endpoints:`);
    console.log(`   POST /api/js-test - Execute JS performance tests`);
    console.log(`   GET  /api/health  - Health check`);
});

module.exports = app;