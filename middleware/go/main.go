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

type TestResponse struct {
	Success    bool                   `json:"success"`
	Metrics    map[string]interface{} `json:"metrics"`
	Error      string                 `json:"error,omitempty"`
	AppRuntime float64                `json:"appRuntime"` // App execution time in ms
}

type PerformanceAnalysis struct {
	BackendMetrics   Metrics      `json:"backendMetrics"`
	MiddlewareTiming TimingResult `json:"middlewareTiming"`
	Efficiency       Efficiency   `json:"efficiency"`
}

type Efficiency struct {
	HTTPPercentage   float64 `json:"httpPercentage"`
	LanguageOverhead float64 `json:"languageOverhead"`
	EfficiencyScore  float64 `json:"efficiencyScore"`
}

func main() {
	fmt.Println("🚀 Go Performance Server starting...")
	http.HandleFunc("/api/go-test", handleGoTest)
	http.HandleFunc("/api/health", handleHealth)

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
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

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
	// Start timing the Go app execution
	appStart := time.Now()

	// Create HTTP client and execute test
	client := NewHTTPClient()
	results := client.ExecuteLoadTest(req)
	metrics := client.CalculateMetrics(results)

	// Calculate app runtime
	appRuntime := time.Since(appStart).Seconds() * 1000

	// Performance analysis
	performance := analyzePerformance(metrics, TimingResult{
		TotalDuration:    time.Duration(appRuntime) * time.Millisecond,
		HTTPDuration:     time.Duration(metrics.HTTPTime.Avg) * time.Millisecond,
		LanguageDuration: time.Duration(metrics.LanguageTime.Avg) * time.Millisecond,
	})

	metricsMap := map[string]interface{}{
		"totalRequests":      metrics.TotalRequests,
		"successfulRequests": metrics.SuccessfulRequests,
		"failedRequests":     metrics.FailedRequests,
		"successRate":        metrics.SuccessRate,
		"throughput":         metrics.Throughput,
		"totalTime":          metrics.TotalTime,
		"httpTime":           metrics.HTTPTime,
		"languageTime":       metrics.LanguageTime,
		"performanceAnalysis": map[string]interface{}{
			"totalDuration":    performance.MiddlewareTiming.TotalDuration.Seconds() * 1000,
			"httpDuration":     performance.MiddlewareTiming.HTTPDuration.Seconds() * 1000,
			"languageDuration": performance.MiddlewareTiming.LanguageDuration.Seconds() * 1000,
			"efficiencyScore":  performance.Efficiency.EfficiencyScore,
		},
	}

	return TestResponse{
		Success:    true,
		Metrics:    metricsMap,
		AppRuntime: appRuntime,
	}
}

func calculateLanguageEfficiency(metrics Metrics) float64 {
	if metrics.TotalTime.Avg == 0 {
		return 0
	}
	return (metrics.LanguageTime.Avg / metrics.TotalTime.Avg) * 100
}

func calculateConcurrencyScore(metrics Metrics, concurrency int) float64 {
	if metrics.Throughput == 0 {
		return 0
	}
	throughputScore := metrics.Throughput / float64(concurrency) * 10
	successScore := metrics.SuccessRate / 10
	return (throughputScore + successScore) / 2
}

func analyzePerformance(backendMetrics Metrics, timing TimingResult) PerformanceAnalysis {
	httpPct := (timing.HTTPDuration.Seconds() / timing.TotalDuration.Seconds()) * 100
	langPct := (timing.LanguageDuration.Seconds() / timing.TotalDuration.Seconds()) * 100

	return PerformanceAnalysis{
		BackendMetrics:   backendMetrics,
		MiddlewareTiming: timing,
		Efficiency: Efficiency{
			HTTPPercentage:   httpPct,
			LanguageOverhead: langPct,
			EfficiencyScore:  httpPct, // Higher is better
		},
	}
}
