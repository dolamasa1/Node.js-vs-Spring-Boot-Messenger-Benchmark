// Enhanced module loader with retry mechanism
class SimpleAppLoader {
    constructor() {
        this.loaded = false;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    loadApp() {
        try {
            console.log('🚀 Starting application initialization...');
            
            // Check if all required classes are available
            const requiredClasses = ['UIManager', 'MetricsDisplay', 'PerformanceTester', 'ConfigManager', 'AppController'];
            const missingClasses = requiredClasses.filter(cls => typeof window[cls] === 'undefined');
            
            if (missingClasses.length > 0) {
                console.error('❌ Missing classes:', missingClasses);
                
                if (this.retryCount < this.maxRetries) {
                    this.retryCount++;
                    console.log(`🔄 Retrying initialization (attempt ${this.retryCount}/${this.maxRetries})...`);
                    setTimeout(() => this.loadApp(), 500);
                    return false;
                } else {
                    throw new Error(`Failed to load: ${missingClasses.join(', ')}`);
                }
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

// Enhanced initialization with dependency checking
function initializeApp() {
    // Check if all scripts are loaded
    function areScriptsLoaded() {
        return typeof UIManager !== 'undefined' &&
               typeof MetricsDisplay !== 'undefined' &&
               typeof PerformanceTester !== 'undefined' &&
               typeof ConfigManager !== 'undefined' &&
               typeof AppController !== 'undefined';
    }

    function attemptInitialization() {
        if (areScriptsLoaded()) {
            const loader = new SimpleAppLoader();
            loader.loadApp();
        } else {
            console.log('⏳ Waiting for scripts to load...');
            setTimeout(attemptInitialization, 100);
        }
    }

    // Start initialization
    setTimeout(attemptInitialization, 100);
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}