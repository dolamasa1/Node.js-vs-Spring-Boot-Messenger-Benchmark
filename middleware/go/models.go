// models.go
package main

// TestRequest matches the frontend structure
type TestRequest struct {
	Tech        string `json:"tech"`
	Scenario    string `json:"scenario"`
	Count       int    `json:"count"`
	Target      string `json:"target"`
	Concurrency int    `json:"concurrency"`
	Endpoint    string `json:"endpoint"`
	Token       string `json:"token"`
}

// FrontendMetrics matches what frontend expects
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

// TestResponse matches frontend expectations
type TestResponse struct {
	Success    bool            `json:"success"`
	Metrics    FrontendMetrics `json:"metrics"`
	Results    []RequestResult `json:"results"`
	Error      string          `json:"error,omitempty"`
	AppRuntime float64         `json:"appRuntime"`
}
