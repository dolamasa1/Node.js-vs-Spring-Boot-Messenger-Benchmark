package main

import "time"

type PerformanceResult struct {
	TotalDuration    time.Duration
	HTTPDuration     time.Duration
	LanguageDuration time.Duration
	EfficiencyScore  float64
}

func (h *HTTPClient) MeasurePerformance(config TestRequest) PerformanceResult {
	totalStart := time.Now()

	// Measure HTTP time
	httpStart := time.Now()
	httpDuration := time.Since(httpStart)

	// Calculate language overhead
	totalDuration := time.Since(totalStart)
	languageDuration := totalDuration - httpDuration

	efficiency := (float64(httpDuration) / float64(totalDuration)) * 100

	return PerformanceResult{
		TotalDuration:    totalDuration,
		HTTPDuration:     httpDuration,
		LanguageDuration: languageDuration,
		EfficiencyScore:  efficiency,
	}
}
