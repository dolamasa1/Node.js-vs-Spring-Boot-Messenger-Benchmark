package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type TestRequest struct {
	Tech        string `json:"tech"`
	Scenario    string `json:"scenario"`
	Count       int    `json:"count"`
	Target      string `json:"target"`
	Concurrency int    `json:"concurrency"`
	Endpoint    string `json:"endpoint"`
	Token       string `json:"token"`
}

type FrontendMetrics struct {
	TotalRequests      int     `json:"totalRequests"`
	SuccessfulRequests int     `json:"successfulRequests"`
	FailedRequests     int     `json:"failedRequests"`
	SuccessRate        float64 `json:"successRate"`
	Throughput         float64 `json:"throughput"`
	AvgResponseTime    float64 `json:"avgResponseTime"`
	MinResponseTime    float64 `json:"minResponseTime"`
	MaxResponseTime    float64 `json:"maxResponseTime"`
	P95ResponseTime    float64 `json:"p95ResponseTime"`
	P99ResponseTime    float64 `json:"p99ResponseTime"`
	ErrorCount         int     `json:"errorCount"`
}

type TestResponse struct {
	Success    bool            `json:"success"`
	Metrics    FrontendMetrics `json:"metrics"`
	Results    []RequestResult `json:"results"`
	Error      string          `json:"error,omitempty"`
	AppRuntime float64         `json:"appRuntime"`
}

// CORS middleware function
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		// Handle preflight OPTIONS request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next(w, r)
	}
}

func main() {
	fmt.Println("🚀 Go Performance Server starting...")

	// Apply CORS middleware to all endpoints
	http.HandleFunc("/api/go-test", corsMiddleware(handleGoTest))
	http.HandleFunc("/api/health", corsMiddleware(handleHealth))

	port := "8090"
	fmt.Printf("✅ Go Performance Server running on http://localhost:%s\n", port)
	fmt.Printf("📊 Endpoints:\n")
	fmt.Printf("   POST /api/go-test - Execute Go performance tests\n")
	fmt.Printf("   GET  /api/health  - Health check\n")

	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "healthy",
		"service":   "go-performance-server",
		"timestamp": time.Now().UTC(),
		"version":   "1.0.0",
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
		http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
		return
	}

	response := executeGoTest(req)
	json.NewEncoder(w).Encode(response)
}

func executeGoTest(req TestRequest) TestResponse {
	appStart := time.Now()

	client := NewHTTPClient()
	results := client.ExecuteLoadTest(req)
	metrics := client.CalculateMetrics(results)

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

	return TestResponse{
		Success:    true,
		Metrics:    frontendMetrics,
		Results:    results,
		AppRuntime: appRuntime,
	}
}
