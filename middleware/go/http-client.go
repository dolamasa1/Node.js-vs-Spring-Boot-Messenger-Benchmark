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

type TimingResult struct {
	TotalDuration      time.Duration
	HTTPDuration       time.Duration
	LanguageDuration   time.Duration
	JSONMarshalTime    time.Duration
	JSONUnmarshalTime  time.Duration
	StringFormatTime   time.Duration
	DataProcessingTime time.Duration
}

type RequestResult struct {
	Success    bool
	StatusCode int
	Duration   time.Duration
	Timing     TimingResult
	Error      string
}

type Metrics struct {
	TotalRequests      int
	SuccessfulRequests int
	FailedRequests     int
	SuccessRate        float64
	Throughput         float64
	TotalTime          TimingStats
	HTTPTime           TimingStats
	LanguageTime       TimingStats
	JSONMarshalTime    TimingStats
	JSONUnmarshalTime  TimingStats
}

type TimingStats struct {
	Avg float64 `json:"avg"`
	Min float64 `json:"min"`
	Max float64 `json:"max"`
	P95 float64 `json:"p95"`
	P99 float64 `json:"p99"`
}

func (h *HTTPClient) ExecuteLoadTest(config TestRequest) []RequestResult {
	var results []RequestResult
	var mu sync.Mutex
	semaphore := make(chan struct{}, config.Concurrency)
	var wg sync.WaitGroup

	for i := 0; i < config.Count; i++ {
		wg.Add(1)
		semaphore <- struct{}{}

		go func(index int) {
			defer wg.Done()
			defer func() { <-semaphore }()

			result := h.makeRequestWithTiming(config, index)

			mu.Lock()
			results = append(results, result)
			mu.Unlock()
		}(i)
	}

	wg.Wait()
	return results
}

func (h *HTTPClient) makeRequestWithTiming(config TestRequest, index int) RequestResult {
	var timing TimingResult
	totalStart := time.Now()

	result := RequestResult{}

	defer func() {
		timing.TotalDuration = time.Since(totalStart)
		timing.LanguageDuration = timing.JSONMarshalTime + timing.JSONUnmarshalTime +
			timing.StringFormatTime + timing.DataProcessingTime
		result.Timing = timing
		result.Duration = timing.TotalDuration
	}()

	// String formatting timing
	var url string
	timing.StringFormatTime = measureTime(func() {
		if config.Scenario == "post" || (config.Scenario == "mixed" && index%2 == 0) {
			url = fmt.Sprintf("%s/api/message/send?toUserId=%s&message=TestMessage_%d_%d",
				config.Endpoint, config.Target, index, time.Now().UnixNano())
		} else {
			url = fmt.Sprintf("%s/api/message/message?type=user&target=%s&page=0",
				config.Endpoint, config.Target)
		}
	})

	// Request creation timing
	var req *http.Request
	timing.DataProcessingTime += measureTime(func() {
		var err error
		if config.Scenario == "post" || (config.Scenario == "mixed" && index%2 == 0) {
			req, err = http.NewRequest("POST", url, nil)
		} else {
			req, err = http.NewRequest("GET", url, nil)
		}
		if err != nil {
			result.Error = fmt.Sprintf("Request creation failed: %v", err)
			return
		}

		req.Header.Set("Authorization", "Bearer "+config.Token)
		req.Header.Set("version", "1")
		req.Header.Set("Content-Type", "application/json")
	})

	if result.Error != "" {
		result.Success = false
		return result
	}

	// HTTP request timing
	httpStart := time.Now()
	resp, err := h.client.Do(req)
	timing.HTTPDuration = time.Since(httpStart)

	if err != nil {
		result.Success = false
		result.Error = err.Error()
		return result
	}
	defer resp.Body.Close()

	result.Success = resp.StatusCode >= 200 && resp.StatusCode < 300
	result.StatusCode = resp.StatusCode

	// Response processing timing
	timing.DataProcessingTime += measureTime(func() {
		_, err := io.ReadAll(resp.Body)
		if err != nil {
			result.Error = fmt.Sprintf("Response read failed: %v", err)
		}
	})

	return result
}

func (h *HTTPClient) CalculateMetrics(results []RequestResult) Metrics {
	metrics := Metrics{
		TotalRequests: len(results),
	}

	if len(results) == 0 {
		return metrics
	}

	var successfulRequests []RequestResult
	for _, result := range results {
		if result.Success {
			successfulRequests = append(successfulRequests, result)
		} else {
			metrics.FailedRequests++
		}
	}

	metrics.SuccessfulRequests = len(successfulRequests)
	metrics.SuccessRate = float64(metrics.SuccessfulRequests) / float64(metrics.TotalRequests) * 100

	if len(successfulRequests) == 0 {
		return metrics
	}

	// Calculate timing metrics
	h.calculateTimingMetrics(&metrics, successfulRequests)
	h.calculateThroughput(&metrics, results)

	return metrics
}

func (h *HTTPClient) calculateTimingMetrics(metrics *Metrics, results []RequestResult) {
	totalDurations := make([]float64, len(results))
	httpDurations := make([]float64, len(results))
	languageDurations := make([]float64, len(results))
	jsonMarshalDurations := make([]float64, len(results))
	jsonUnmarshalDurations := make([]float64, len(results))

	for i, result := range results {
		totalDurations[i] = result.Timing.TotalDuration.Seconds() * 1000
		httpDurations[i] = result.Timing.HTTPDuration.Seconds() * 1000
		languageDurations[i] = result.Timing.LanguageDuration.Seconds() * 1000
		jsonMarshalDurations[i] = result.Timing.JSONMarshalTime.Seconds() * 1000
		jsonUnmarshalDurations[i] = result.Timing.JSONUnmarshalTime.Seconds() * 1000
	}

	sort.Float64s(totalDurations)
	sort.Float64s(httpDurations)
	sort.Float64s(languageDurations)
	sort.Float64s(jsonMarshalDurations)
	sort.Float64s(jsonUnmarshalDurations)

	metrics.TotalTime = h.calculateStats(totalDurations)
	metrics.HTTPTime = h.calculateStats(httpDurations)
	metrics.LanguageTime = h.calculateStats(languageDurations)
	metrics.JSONMarshalTime = h.calculateStats(jsonMarshalDurations)
	metrics.JSONUnmarshalTime = h.calculateStats(jsonUnmarshalDurations)
}

func (h *HTTPClient) calculateStats(durations []float64) TimingStats {
	if len(durations) == 0 {
		return TimingStats{}
	}

	var sum float64
	for _, d := range durations {
		sum += d
	}

	return TimingStats{
		Avg: h.calculatePercentile(durations, 50),
		Min: durations[0],
		Max: durations[len(durations)-1],
		P95: h.calculatePercentile(durations, 95),
		P99: h.calculatePercentile(durations, 99),
	}
}

func (h *HTTPClient) calculatePercentile(sortedArray []float64, percentile float64) float64 {
	if len(sortedArray) == 0 {
		return 0
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

func (h *HTTPClient) calculateThroughput(metrics *Metrics, results []RequestResult) {
	if len(results) < 2 {
		metrics.Throughput = 0
		return
	}

	// Calculate time window from first to last request
	if len(results) > 1 {
		startTime := results[0].Timing.TotalDuration
		endTime := results[len(results)-1].Timing.TotalDuration
		timeWindow := (endTime - startTime).Seconds()
		if timeWindow > 0 {
			metrics.Throughput = float64(len(results)) / timeWindow
		}
	}
}

func measureTime(fn func()) time.Duration {
	start := time.Now()
	fn()
	return time.Since(start)
}
