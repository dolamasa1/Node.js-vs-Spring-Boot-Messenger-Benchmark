class MetricsDisplay {
    constructor() {
        this.metrics = {
            spring: this.createEmptyMetrics(),
            node: this.createEmptyMetrics()
        };
    }

    createEmptyMetrics() {
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

calculateMetrics(results) {
    if (!results || results.length === 0) {
        return this.createEmptyMetrics();
    }

    const successfulRequests = results.filter(r => r.success);
    const failedRequests = results.filter(r => !r.success);
    
    // Fix: Check if we have actual timing data
    const hasValidTiming = successfulRequests.some(r => r.duration > 0);
    
    if (!hasValidTiming || successfulRequests.length === 0) {
        const metrics = this.createEmptyMetrics();
        metrics.totalRequests = results.length;
        metrics.successfulRequests = successfulRequests.length;
        metrics.failedRequests = failedRequests.length;
        metrics.successRate = results.length > 0 ? (successfulRequests.length / results.length) * 100 : 0;
        metrics.errorCount = failedRequests.length;
        return metrics;
    }

    const responseTimes = successfulRequests.map(r => r.duration);
    const sortedTimes = [...responseTimes].sort((a, b) => a - b);
    const totalTime = responseTimes.reduce((sum, time) => sum + time, 0);
    const avgResponseTime = totalTime / responseTimes.length;
    const minResponseTime = Math.min(...responseTimes);
    const maxResponseTime = Math.max(...responseTimes);
    const p95ResponseTime = this.calculatePercentile(sortedTimes, 95);
    const p99ResponseTime = this.calculatePercentile(sortedTimes, 99);

    // Estimate throughput based on average response time
    const throughput = avgResponseTime > 0 ? 1000 / avgResponseTime : 0;
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

    updateMetricsDisplay(tech, metrics) {
        const elements = this.getMetricElements(tech);
        
        if (elements.response) elements.response.textContent = metrics.avgResponseTime.toFixed(2);
        if (elements.throughput) elements.throughput.textContent = metrics.throughput.toFixed(2);
        if (elements.success) elements.success.textContent = metrics.successRate.toFixed(1);
        if (elements.errors) elements.errors.textContent = metrics.errorCount;
        if (elements.minmax) elements.minmax.textContent = `${metrics.minResponseTime.toFixed(2)} / ${metrics.maxResponseTime.toFixed(2)}`;
        if (elements.p95) elements.p95.textContent = metrics.p95ResponseTime.toFixed(2);
    }

    getMetricElements(tech) {
        return {
            response: document.getElementById(`${tech}-response`),
            throughput: document.getElementById(`${tech}-throughput`),
            success: document.getElementById(`${tech}-success`),
            errors: document.getElementById(`${tech}-errors`),
            minmax: document.getElementById(`${tech}-minmax`),
            p95: document.getElementById(`${tech}-p95`)
        };
    }
}