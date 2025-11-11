// Simple module loader that doesn't use dynamic imports
class SimpleAppLoader {
    constructor() {
        this.loaded = false;
    }

    loadApp() {
        try {
            console.log('🚀 Starting application initialization...');
            
            // Check if all required classes are available
            if (typeof UIManager === 'undefined') {
                console.error('❌ UIManager not found');
                return false;
            }
            if (typeof MetricsDisplay === 'undefined') {
                console.error('❌ MetricsDisplay not found');
                return false;
            }
            if (typeof PerformanceTester === 'undefined') {
                console.error('❌ PerformanceTester not found');
                return false;
            }
            if (typeof ConfigManager === 'undefined') {
                console.error('❌ ConfigManager not found');
                return false;
            }
            if (typeof AppController === 'undefined') {
                console.error('❌ AppController not found');
                return false;
            }

            console.log('✅ All dependencies loaded, initializing AppController...');
            
            // Initialize the main app controller
            window.app = new AppController();
            this.loaded = true;
            
            console.log('✅ Application initialized successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.showError(error);
            return false;
        }
    }

    showError(error) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ef4444;
            color: white;
            padding: 1rem;
            text-align: center;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        errorDiv.innerHTML = `
            <strong>Application failed to load:</strong> ${error.message}<br>
            <small>Check the browser console for details.</small>
        `;
        document.body.appendChild(errorDiv);
    }
}

// Load the application when all scripts are ready
function initializeApp() {
    // Wait a bit to ensure all scripts are loaded
    setTimeout(() => {
        const loader = new SimpleAppLoader();
        const success = loader.loadApp();
        
        if (!success) {
            console.log('🔄 Retrying application initialization...');
            // Retry after a short delay
            setTimeout(() => {
                loader.loadApp();
            }, 1000);
        }
    }, 100);
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}