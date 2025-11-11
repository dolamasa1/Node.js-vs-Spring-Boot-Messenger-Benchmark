class PerformanceClient {
    constructor() {
        this.requestCount = 0;
        this.results = [];
    }

    async executeLoadTest(config) {
        const { endpoint, token, scenario, count, target, concurrency } = config;
        
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
            
            // Update progress
            if (window.app?.performanceTester) {
                window.app.performanceTester.updateProgress(i + currentBatchSize, count, config.tech || 'unknown');
            }
            
            // Small delay between batches
            if (i + batchSize < count) {
                await this.delay(10);
            }
        }
        
        return this.results;
    }

    async sendRequest(endpoint, token, scenario, target, index) {
        const startTime = performance.now();
        
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
            
            options = {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'version': '1',
                    'Content-Type': 'application/json'
                }
            };
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            options.signal = controller.signal;
            
            const response = await fetch(url, options);
            clearTimeout(timeoutId);
            
            const duration = performance.now() - startTime;
            
            return {
                success: response.ok,
                status: response.status,
                duration: duration,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            const duration = performance.now() - startTime;
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
        const totalStart = performance.now();
        
        // Measure HTTP time
        const httpStart = performance.now();
        const results = await this.executeLoadTest(config);
        const httpDuration = performance.now() - httpStart;
        
        // Calculate language overhead
        const totalDuration = performance.now() - totalStart;
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