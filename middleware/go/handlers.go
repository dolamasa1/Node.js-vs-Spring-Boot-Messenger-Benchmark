// handlers.go
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "healthy",
		"service":   "go-performance-server",
		"timestamp": time.Now().UTC(),
		"version":   "1.0.0",
		"config":    "loaded",
	})
}

func handleGoTest(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != "POST" {
		http.Error(w, `{"error": "Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var req TestRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error": "Invalid JSON: `+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	// Validate request
	if req.Tech == "" || req.Endpoint == "" {
		http.Error(w, `{"error": "Missing required fields: tech, endpoint"}`, http.StatusBadRequest)
		return
	}

	response := executeGoTest(req)
	json.NewEncoder(w).Encode(response)
}

func executeGoTest(req TestRequest) TestResponse {
	appStart := time.Now()

	client := NewHTTPClient()
	results, totalDuration := client.ExecuteLoadTest(req)
	metrics := client.CalculateMetrics(results, totalDuration)

	appRuntime := time.Since(appStart).Seconds() * 1000

	// Convert to frontend-compatible metrics
	frontendMetrics := FrontendMetrics{
		TotalRequests:      metrics.TotalRequests,
		SuccessfulRequests: metrics.SuccessfulRequests,
		FailedRequests:     metrics.FailedRequests,
		SuccessRate:        metrics.SuccessRate,
		Throughput:         metrics.Throughput,
		AvgResponseTime:    metrics.TotalTime.Avg,
		MinResponseTime:    metrics.TotalTime.Min,
		MaxResponseTime:    metrics.TotalTime.Max,
		P95ResponseTime:    metrics.TotalTime.P95,
		P99ResponseTime:    metrics.TotalTime.P99,
		ErrorCount:         metrics.FailedRequests,
	}

	// Log the actual metrics for debugging
	fmt.Printf("📊 Calculated metrics for %s: Avg=%.2fms, Min=%.2fms, Max=%.2fms, Throughput=%.2f req/s\n",
		req.Tech, frontendMetrics.AvgResponseTime, frontendMetrics.MinResponseTime,
		frontendMetrics.MaxResponseTime, frontendMetrics.Throughput)

	return TestResponse{
		Success:    true,
		Metrics:    frontendMetrics,
		Results:    results,
		AppRuntime: appRuntime,
	}
}
