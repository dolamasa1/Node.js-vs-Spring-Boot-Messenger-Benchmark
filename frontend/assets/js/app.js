class AppController {
    constructor() {
        this.uiManager = new UIManager();
        this.metricsManager = new MetricsDisplay();
        this.performanceTester = new PerformanceTester();
        this.config = new ConfigManager();
        
        this.state = {
            testing: false,
            runtime: {
                startTime: null,
                elapsed: 0,
                intervalId: null
            }
        };
        
        this.initializeApp();
    }

    initializeApp() {
        console.log('App initialized successfully');
        
        // Set default values
        this.uiManager.elements.springUser.value = 'admin';
        this.uiManager.elements.springPass.value = 'password';
        this.uiManager.elements.nodeUser.value = 'admin';
        this.uiManager.elements.nodePass.value = 'password';
        
        this.uiManager.logToConsole('spring', 'Spring Boot service ready...', 'info');
        this.uiManager.logToConsole('node', 'Node.js service ready...', 'info');
        
        this.detectCorsIssues();
        
        // Make app globally available
        window.app = this;
    }

    detectCorsIssues() {
        const currentUrl = window.location.href;
        if (currentUrl.startsWith('file://')) {
            this.uiManager.logToConsole('spring', '⚠️ CORS WARNING: Running from file:// protocol. Use a local HTTP server.', 'warning');
            this.uiManager.logToConsole('node', '⚠️ CORS WARNING: Running from file:// protocol. Use a local HTTP server.', 'warning');
        }
    }

    async authenticate(tech) {
        const username = this.uiManager.elements[`${tech}User`]?.value;
        const password = this.uiManager.elements[`${tech}Pass`]?.value;
        
        if (!username || !password) {
            this.uiManager.logToConsole(tech, '❌ Please enter both username and password', 'error');
            return;
        }

        this.uiManager.updateConnectionStatus(tech, false, 'Connecting...');
        this.uiManager.logToConsole(tech, `🔐 Attempting authentication for user: ${username}`, 'info');
        
        const result = await this.config.authenticate(tech, username, password);
        
        if (result.success) {
            this.uiManager.updateConnectionStatus(tech, true, 'Authentication successful');
        } else {
            this.uiManager.updateConnectionStatus(tech, false, `Authentication failed: ${result.error}`);
        }
    }


    getTestConfig() {
        return {
            scenario: this.uiManager.getScenario(),
            count: this.uiManager.getRequestCount(),
            target: this.uiManager.getTarget(),
            concurrency: this.uiManager.getConcurrency(),
            spring: {
                connected: this.config.spring.connected,
                endpoint: this.config.spring.endpoint,
                token: this.config.spring.token
            },
            node: {
                connected: this.config.node.connected,
                endpoint: this.config.node.endpoint,
                token: this.config.node.token
            }
        };
    }

    resetAll() {
        this.config.resetAll();
        this.metricsManager.updateMetricsDisplay('spring', this.metricsManager.createEmptyMetrics());
        this.metricsManager.updateMetricsDisplay('node', this.metricsManager.createEmptyMetrics());
        
        this.uiManager.updateProgress(0, 0, '');
        this.uiManager.elements.progress.classList.remove('active');
        this.uiManager.elements.progressFill.style.width = '0%';
        this.uiManager.elements.completed.textContent = '0';
        this.uiManager.elements.remaining.textContent = '0';
        this.uiManager.elements.progressText.textContent = 'Initializing...';
        
        this.resetRuntime();
        
        this.uiManager.logToConsole('spring', '🔄 All metrics reset', 'info');
        this.uiManager.logToConsole('node', '🔄 All metrics reset', 'info');
    }

    switchLanguage(language) {
        this.config.currentLanguage = language;
        
        const navBar = this.uiManager.elements.bottomNav;
        const currentIcon = this.uiManager.elements.currentIcon;
        const currentName = this.uiManager.elements.currentName;
        
        if (!navBar || !currentIcon || !currentName) {
            console.error('Language switcher elements not found');
            return;
        }
        
        // Update active state in dropdown
        document.querySelectorAll('.language-option').forEach(option => {
            option.classList.remove('active');
            if (option.getAttribute('data-lang') === language) {
                option.classList.add('active');
            }
        });
        
        // Update theme and display
        if (language === 'go') {
            navBar.classList.remove('js-theme');
            navBar.classList.add('go-theme');
            currentIcon.textContent = '🐹';
            currentName.textContent = 'Golang';
        } else {
            navBar.classList.remove('go-theme');
            navBar.classList.add('js-theme');
            currentIcon.textContent = '⚡';
            currentName.textContent = 'JavaScript';
        }
        
        this.uiManager.closeLanguageSwitcher();
        
        this.uiManager.logToConsole('spring', `Language preference switched to: ${language.toUpperCase()}`, 'info');
        this.uiManager.logToConsole('node', `Language preference switched to: ${language.toUpperCase()}`, 'info');
    }

    saveSettings() {
        try {
            // Update Spring config
            this.config.updateTechConfig('spring', {
                protocol: this.uiManager.elements.springProtocol?.value || 'http',
                host: this.uiManager.elements.springHost?.value || 'localhost',
                port: parseInt(this.uiManager.elements.springPort?.value) || 8080,
                basePath: this.uiManager.elements.springBase?.value || '',
                timeout: parseInt(this.uiManager.elements.springTimeout?.value) || 30000
            });

            // Update Node config
            this.config.updateTechConfig('node', {
                protocol: this.uiManager.elements.nodeProtocol?.value || 'http',
                host: this.uiManager.elements.nodeHost?.value || 'localhost',
                port: parseInt(this.uiManager.elements.nodePort?.value) || 5000,
                basePath: this.uiManager.elements.nodeBase?.value || '',
                timeout: parseInt(this.uiManager.elements.nodeTimeout?.value) || 30000
            });

            // Update general settings
            this.config.updateSettings({
                apiVersion: this.uiManager.elements.apiVersion?.value || '1',
                retryEnabled: this.uiManager.elements.retryEnabled?.value === 'true',
                maxRetries: parseInt(this.uiManager.elements.maxRetries?.value) || 3,
                logLevel: this.uiManager.elements.logLevel?.value || 'all'
            });

            this.uiManager.logToConsole('spring', `✅ Endpoint updated: ${this.config.spring.endpoint}`, 'success');
            this.uiManager.logToConsole('node', `✅ Endpoint updated: ${this.config.node.endpoint}`, 'success');

            this.uiManager.closeSettings();
        } catch (error) {
            console.error('Error saving settings:', error);
            this.uiManager.logToConsole('spring', `Error saving settings: ${error.message}`, 'error');
        }
    }

    // Runtime tracking methods
    formatRuntime(milliseconds) {
        const hours = Math.floor(milliseconds / 3600000);
        const minutes = Math.floor((milliseconds % 3600000) / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        const ms = milliseconds % 1000;
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
    }

    startRuntimeTracking() {
        this.state.runtime.startTime = performance.now();
        if (this.uiManager.elements.runtimeStatus) {
            this.uiManager.elements.runtimeStatus.classList.remove('idle');
            this.uiManager.elements.runtimeStatus.classList.add('running');
            this.uiManager.elements.runtimeStatus.innerHTML = '<span class="runtime-dot"></span><span>Running</span>';
        }
        
        this.state.runtime.intervalId = setInterval(() => {
            this.state.runtime.elapsed = performance.now() - this.state.runtime.startTime;
            if (this.uiManager.elements.runtimeValue) {
                this.uiManager.elements.runtimeValue.textContent = this.formatRuntime(this.state.runtime.elapsed);
            }
        }, 10);
    }

    stopRuntimeTracking() {
        if (this.state.runtime.intervalId) {
            clearInterval(this.state.runtime.intervalId);
            this.state.runtime.intervalId = null;
        }
        if (this.uiManager.elements.runtimeStatus) {
            this.uiManager.elements.runtimeStatus.classList.remove('running');
            this.uiManager.elements.runtimeStatus.classList.add('idle');
            this.uiManager.elements.runtimeStatus.innerHTML = '<span class="runtime-dot"></span><span>Idle</span>';
        }
    }

    resetRuntime() {
        this.stopRuntimeTracking();
        this.state.runtime.elapsed = 0;
        if (this.uiManager.elements.runtimeValue) {
            this.uiManager.elements.runtimeValue.textContent = '00:00:00.000';
        }
    }


    openSettings() {
        this.uiManager.openSettings();
    }

    // Enhanced test execution with better error handling
    async executeTests() {
        if (!this.config.spring.connected && !this.config.node.connected) {
            this.uiManager.logToConsole('spring', '❌ Please connect at least one service before running tests', 'error');
            this.uiManager.logToConsole('node', '❌ Please connect at least one service before running tests', 'error');
            return;
        }

        // Validate configuration
        const configValidation = this.config.validateConfig();
        if (!configValidation.isValid) {
            configValidation.errors.forEach(error => {
                this.uiManager.logToConsole('spring', `❌ Configuration Error: ${error}`, 'error');
                this.uiManager.logToConsole('node', `❌ Configuration Error: ${error}`, 'error');
            });
            return;
        }

        this.state.testing = true;
        this.uiManager.elements.runBtn.disabled = true;
        this.uiManager.elements.progress.classList.add('active');
        this.startRuntimeTracking();
        
        const testConfig = this.getTestConfig();

        try {
            if (this.config.currentLanguage === 'go') {
                await this.performanceTester.executeGoTests(testConfig);
            } else {
                await this.performanceTester.executeJSTests(testConfig);
            }
        } catch (error) {
            this.uiManager.logToConsole('spring', `Test execution error: ${error.message}`, 'error');
            this.uiManager.logToConsole('node', `Test execution error: ${error.message}`, 'error');
        } finally {
            this.state.testing = false;
            this.uiManager.elements.runBtn.disabled = false;
            this.stopRuntimeTracking();

            const runtimeFormatted = this.formatRuntime(this.state.runtime.elapsed);
            this.uiManager.logToConsole('spring', `✅ Benchmark completed | Runtime: ${runtimeFormatted}`, 'success');
            this.uiManager.logToConsole('node', `✅ Benchmark completed | Runtime: ${runtimeFormatted}`, 'success');
        }
    }

    // Enhanced authentication with better feedback
    async authenticate(tech) {
        const username = this.uiManager.elements[`${tech}User`]?.value;
        const password = this.uiManager.elements[`${tech}Pass`]?.value;
        
        if (!username || !password) {
            this.uiManager.logToConsole(tech, '❌ Please enter both username and password', 'error');
            return;
        }

        this.uiManager.updateConnectionStatus(tech, false, 'Connecting...');
        this.uiManager.logToConsole(tech, `🔐 Attempting authentication for user: ${username}`, 'info');
        
        try {
            const result = await this.config.authenticate(tech, username, password);
            
            if (result.success) {
                this.uiManager.updateConnectionStatus(tech, true, 'Connected');
                this.uiManager.logToConsole(tech, '✅ Authentication successful', 'success');
            } else {
                this.uiManager.updateConnectionStatus(tech, false, 'Authentication failed');
                this.uiManager.logToConsole(tech, `❌ Authentication failed: ${result.error}`, 'error');
            }
        } catch (error) {
            this.uiManager.updateConnectionStatus(tech, false, 'Connection error');
            this.uiManager.logToConsole(tech, `❌ Connection error: ${error.message}`, 'error');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.app = new AppController();
        console.log('✅ App initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize app:', error);
    }
});

