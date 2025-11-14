package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

// Match the JSON structure exactly
type AppConfig struct {
	Backends   map[string]BackendConfig    `json:"backends"`
	Middleware map[string]MiddlewareConfig `json:"middleware"`
	Scenarios  map[string]ScenarioConfig   `json:"scenarios"`
	Settings   map[string]interface{}      `json:"settings"`
}

type BackendConfig struct {
	Protocol  string            `json:"protocol"`
	Host      string            `json:"host"`
	Port      int               `json:"port"`
	BasePath  string            `json:"basePath"`
	Endpoints map[string]string `json:"endpoints"`
	Headers   map[string]string `json:"headers"`
}

type MiddlewareConfig struct {
	Protocol  string            `json:"protocol"`
	Host      string            `json:"host"`
	Port      int               `json:"port"`
	Endpoints map[string]string `json:"endpoints"`
	Headers   map[string]string `json:"headers"`
}

type ScenarioConfig struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func LoadConfig() (*AppConfig, error) {
	// Get the current directory (middleware/go)
	currentDir, err := os.Getwd()
	if err != nil {
		return nil, fmt.Errorf("failed to get current directory: %v", err)
	}

	// Go up two levels: middleware/go -> middleware -> root, then into config
	rootDir := filepath.Dir(filepath.Dir(currentDir))
	configPath := filepath.Join(rootDir, "config", "endpoints.json")

	fmt.Printf("Looking for config at: %s\n", configPath)

	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("config file not found: %s", configPath)
	}

	file, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read config file: %v", err)
	}

	var config AppConfig
	if err := json.Unmarshal(file, &config); err != nil {
		return nil, fmt.Errorf("failed to parse config JSON: %v", err)
	}

	fmt.Printf("✅ Successfully loaded configuration from: %s\n", configPath)
	return &config, nil
}

// Helper to get Go middleware port
func (c *AppConfig) GetGoPort() int {
	if goMiddleware, exists := c.Middleware["go"]; exists {
		return goMiddleware.Port
	}
	return 8090 // default fallback
}

// Helper to get backend URL
func (c *AppConfig) GetBackendURL(tech, endpoint string) string {
	backend, exists := c.Backends[tech]
	if !exists {
		return ""
	}

	path, exists := backend.Endpoints[endpoint]
	if !exists {
		return ""
	}

	return fmt.Sprintf("%s://%s:%d%s%s",
		backend.Protocol, backend.Host, backend.Port, backend.BasePath, path)
}
