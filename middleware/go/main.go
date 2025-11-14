// main.go
package main

import (
	"fmt"
	"log"
	"net/http"
)

// CORS middleware
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func main() {
	fmt.Println("🚀 Go Performance Server starting...")

	// Setup routes with CORS
	http.HandleFunc("/api/go-test", enableCORS(handleGoTest))
	http.HandleFunc("/api/health", enableCORS(handleHealth))

	// Use default port
	port := 8090

	fmt.Printf("✅ Go Performance Server running on http://localhost:%d\n", port)
	fmt.Printf("📊 Endpoints:\n")
	fmt.Printf("   POST /api/go-test - Execute Go performance tests\n")
	fmt.Printf("   GET  /api/health  - Health check\n")

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
