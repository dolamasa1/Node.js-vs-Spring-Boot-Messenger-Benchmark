package main

import (
	"fmt"
	"io"
	"net/http"
	"sort"
	"sync"
	"time"
)

type HTTPClient struct {
	client *http.Client
}

type TimingStats struct {
	Avg float64 `json:"avg"`
	Min float64 `json:"min"`
	Max float64 `json:"max"`
	P95 float64 `json:"p95"`
	P99 float64 `json:"p99"`
}

func NewHTTPClient() *HTTPClient {
	return &HTTPClient{
		client: &http.Client{
			Timeout: 30 * time.Second,
			Transport: &http.Transport{
				MaxIdleConns:        100,
				MaxIdleConnsPerHost: 20,
				IdleConnTimeout:     90 * time.Second,
			},
		},
	}
}

type RequestResult struct {
	Success    bool    `json:"success"`
	StatusCode int     `json:"statusCode"`
	Duration   float64 `json:"duration"` // Duration in milliseconds
	Error      string  `json:"error,omitempty"`
}

type Metrics struct {
	TotalRequests      int         `json:"totalRequests"`
	SuccessfulRequests int         `json:"successfulRequests"`
	FailedRequests     int         `json:"failedRequests"`
	SuccessRate        float64     `json:"successRate"`
	Throughput         float64     `json:"throughput"`
	TotalTime          TimingStats `json:"totalTime"`
}

func (h *HTTPClient) ExecuteLoadTest(config TestRequest) ([]RequestResult, time.Duration) {
	var results []RequestResult
	var mu sync.Mutex
	semaphore := make(chan struct{}, config.Concurrency)
	var wg sync.WaitGroup

	startTime := time.Now()

	for i := 0; i < config.Count; i++ {
		wg.Add(1)
		semaphore <- struct{}{}

		go func(index int) {
			defer wg.Done()
			defer func() { <-semaphore }()

			result := h.makeRequest(config, index)

			mu.Lock()
			results = append(results, result)
			mu.Unlock()
		}(i)
	}

	wg.Wait()
	totalDuration := time.Since(startTime)
	return results, totalDuration
}

func (h *HTTPClient) makeRequest(config TestRequest, index int) RequestResult {
	startTime := time.Now()

	result := RequestResult{}

	// Build URL based on scenario
	var url string
	var method string

	if config.Scenario == "post" || (config.Scenario == "mixed" && index%2 == 0) {
		method = "POST"
		url = fmt.Sprintf("%s/api/message/send?toUserId=%s&message=TestMessage_%d_%d",
			config.Endpoint, config.Target, index, time.Now().UnixNano())
	} else {
		method = "GET"
		url = fmt.Sprintf("%s/api/message/message?type=user&target=%s&page=0",
			config.Endpoint, config.Target)
	}

	// Create request
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		result.Success = false
		result.Error = fmt.Sprintf("Request creation failed: %v", err)
		result.Duration = float64(time.Since(startTime).Milliseconds())
		return result
	}

	// Set headers
	req.Header.Set("Authorization", "Bearer "+config.Token)
	req.Header.Set("version", "1")
	req.Header.Set("Content-Type", "application/json")

	// Execute request
	resp, err := h.client.Do(req)
	duration := time.Since(startTime)

	if err != nil {
		result.Success = false
		result.Error = err.Error()
		result.Duration = float64(duration.Milliseconds())
		return result
	}
	defer resp.Body.Close()

	// Read response body
	_, err = io.ReadAll(resp.Body)
	if err != nil {
		result.Success = false
		result.Error = fmt.Sprintf("Response read failed: %v", err)
		result.Duration = float64(duration.Milliseconds())
		return result
	}

	result.Success = resp.StatusCode >= 200 && resp.StatusCode < 300
	result.StatusCode = resp.StatusCode
	result.Duration = float64(duration.Milliseconds())

	return result
}

func (h *HTTPClient) CalculateMetrics(results []RequestResult, totalDuration time.Duration) Metrics {
	metrics := Metrics{
		TotalRequests: len(results),
	}

	if len(results) == 0 {
		return metrics
	}

	// Count successful and failed requests
	var successfulRequests []RequestResult
	for _, result := range results {
		if result.Success {
			successfulRequests = append(successfulRequests, result)
		} else {
			metrics.FailedRequests++
		}
	}

	metrics.SuccessfulRequests = len(successfulRequests)
	if metrics.TotalRequests > 0 {
		metrics.SuccessRate = float64(metrics.SuccessfulRequests) / float64(metrics.TotalRequests) * 100
	}

	// Calculate throughput
	if totalDuration > 0 {
		metrics.Throughput = float64(metrics.TotalRequests) / totalDuration.Seconds()
	}

	// Calculate timing metrics from successful requests
	if len(successfulRequests) > 0 {
		h.calculateTimingMetrics(&metrics, successfulRequests)
	}

	return metrics
}

func (h *HTTPClient) calculateTimingMetrics(metrics *Metrics, results []RequestResult) {
	if len(results) == 0 {
		return
	}

	// Extract durations
	durations := make([]float64, len(results))
	for i, result := range results {
		durations[i] = result.Duration
	}

	// Sort for percentile calculations
	sort.Float64s(durations)

	// Calculate basic statistics
	var sum float64
	min := durations[0]
	max := durations[0]

	for _, d := range durations {
		sum += d
		if d < min {
			min = d
		}
		if d > max {
			max = d
		}
	}

	avg := sum / float64(len(durations))
	p95 := h.calculatePercentile(durations, 95)
	p99 := h.calculatePercentile(durations, 99)

	metrics.TotalTime = TimingStats{
		Avg: avg,
		Min: min,
		Max: max,
		P95: p95,
		P99: p99,
	}
}

func (h *HTTPClient) calculatePercentile(sortedArray []float64, percentile float64) float64 {
	if len(sortedArray) == 0 {
		return 0
	}

	if len(sortedArray) == 1 {
		return sortedArray[0]
	}

	index := (percentile / 100) * float64(len(sortedArray)-1)
	lowerIndex := int(index)
	upperIndex := lowerIndex + 1

	if upperIndex >= len(sortedArray) {
		return sortedArray[lowerIndex]
	}

	weight := index - float64(lowerIndex)
	return sortedArray[lowerIndex]*(1-weight) + sortedArray[upperIndex]*weight
}
