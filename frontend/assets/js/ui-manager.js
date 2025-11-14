class UIManager {
    constructor() {
        this.elements = {};
        this.currentValues = {
            spring: this.createEmptyCurrentValues(),
            node: this.createEmptyCurrentValues()
        };
        this.initializeElements();
        this.setupEventListeners();
    }

    createEmptyCurrentValues() {
        return {
            response: '0',
            throughput: '0',
            success: '0',
            errors: '0',
            minmax: '0.00 / 0.00',
            p95: '0'
        };
    }
    
    initializeElements() {
        try {
            // Status elements
            this.elements.springStatus = document.getElementById('spring-status');
            this.elements.nodeStatus = document.getElementById('node-status');
            
            // Auth elements
            this.elements.springUser = document.getElementById('spring-user');
            this.elements.springPass = document.getElementById('spring-pass');
            this.elements.springLogin = document.getElementById('spring-login');
            
            this.elements.nodeUser = document.getElementById('node-user');
            this.elements.nodePass = document.getElementById('node-pass');
            this.elements.nodeLogin = document.getElementById('node-login');
            
            // Metric elements
            this.elements.springResponse = document.getElementById('spring-response');
            this.elements.springThroughput = document.getElementById('spring-throughput');
            this.elements.springSuccess = document.getElementById('spring-success');
            this.elements.springErrors = document.getElementById('spring-errors');
            this.elements.springMinmax = document.getElementById('spring-minmax');
            this.elements.springP95 = document.getElementById('spring-p95');
            
            this.elements.nodeResponse = document.getElementById('node-response');
            this.elements.nodeThroughput = document.getElementById('node-throughput');
            this.elements.nodeSuccess = document.getElementById('node-success');
            this.elements.nodeErrors = document.getElementById('node-errors');
            this.elements.nodeMinmax = document.getElementById('node-minmax');
            this.elements.nodeP95 = document.getElementById('node-p95');
            
            // Console elements
            this.elements.springConsole = document.getElementById('spring-console');
            this.elements.nodeConsole = document.getElementById('node-console');
            this.elements.springClearConsole = document.getElementById('spring-clear-console');
            this.elements.nodeClearConsole = document.getElementById('node-clear-console');
            
            // Test control elements
            this.elements.scenario = document.getElementById('scenario');
            this.elements.count = document.getElementById('count');
            this.elements.target = document.getElementById('target');
            this.elements.concurrency = document.getElementById('concurrency');
            this.elements.runBtn = document.getElementById('run-btn');
            this.elements.resetBtn = document.getElementById('reset-btn');
            
            // Progress elements
            this.elements.progress = document.getElementById('progress');
            this.elements.progressFill = document.getElementById('progress-fill');
            this.elements.progressText = document.getElementById('progress-text');
            this.elements.completed = document.getElementById('completed');
            this.elements.remaining = document.getElementById('remaining');
            
            // Settings modal elements
            this.elements.settingsBtn = document.getElementById('settings-btn');
            this.elements.settingsModal = document.getElementById('settings-modal');
            this.elements.closeSettings = document.getElementById('close-settings');
            this.elements.cancelSettings = document.getElementById('cancel-settings');
            this.elements.saveSettings = document.getElementById('save-settings');
            
            // Settings form elements
            this.elements.springProtocol = document.getElementById('spring-protocol');
            this.elements.springHost = document.getElementById('spring-host');
            this.elements.springPort = document.getElementById('spring-port');
            this.elements.springBase = document.getElementById('spring-base');
            this.elements.springTimeout = document.getElementById('spring-timeout');
            
            this.elements.nodeProtocol = document.getElementById('node-protocol');
            this.elements.nodeHost = document.getElementById('node-host');
            this.elements.nodePort = document.getElementById('node-port');
            this.elements.nodeBase = document.getElementById('node-base');
            this.elements.nodeTimeout = document.getElementById('node-timeout');
            
            this.elements.apiVersion = document.getElementById('api-version');
            this.elements.retryEnabled = document.getElementById('retry-enabled');
            this.elements.maxRetries = document.getElementById('max-retries');
            this.elements.logLevel = document.getElementById('log-level');
            
            // Runtime and language switcher elements
            this.elements.runtimeValue = document.getElementById('runtime-value');
            this.elements.runtimeStatus = document.getElementById('runtime-status');
            this.elements.languageSwitcher = document.getElementById('language-switcher');
            this.elements.currentIcon = document.getElementById('current-icon');
            this.elements.currentName = document.getElementById('current-name');
            this.elements.bottomNav = document.getElementById('bottom-nav');

            console.log('UI elements initialized successfully');
        } catch (error) {
            console.error('Error initializing UI elements:', error);
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Authentication - with better error handling
        this.elements.springLogin?.addEventListener('click', () => {
            this.handleAuthClick('spring');
        });
        
        this.elements.nodeLogin?.addEventListener('click', () => {
            this.handleAuthClick('node');
        });
        
        // Console clearing
        this.elements.springClearConsole?.addEventListener('click', () => this.clearConsole('spring'));
        this.elements.nodeClearConsole?.addEventListener('click', () => this.clearConsole('node'));
        
        // Test controls
        this.elements.runBtn?.addEventListener('click', () => {
            this.handleRunTests();
        });
        
        this.elements.resetBtn?.addEventListener('click', () => {
            this.handleResetAll();
        });
        
        // Settings modal
        this.elements.settingsBtn?.addEventListener('click', () => this.openSettings());
        this.elements.closeSettings?.addEventListener('click', () => this.closeSettings());
        this.elements.cancelSettings?.addEventListener('click', () => this.closeSettings());
        this.elements.saveSettings?.addEventListener('click', () => {
            this.handleSaveSettings();
        });
        
        // Close modal when clicking outside
        this.elements.settingsModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.closeSettings();
            }
        });

        // Language switcher
        this.elements.languageSwitcher?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLanguageSwitcher();
        });
        
        // Language option clicks
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.getAttribute('data-lang');
                this.handleLanguageSwitch(lang);
            });
        });
        
        // Close language switcher when clicking outside
        document.addEventListener('click', () => {
            this.closeLanguageSwitcher();
        });
        
        console.log('Event listeners setup complete');
    }

    // Event handler methods
    handleAuthClick(tech) {
        if (window.app && window.app.authenticate) {
            window.app.authenticate(tech);
        } else {
            console.error('App controller not available for authentication');
            this.logToConsole(tech, '❌ Application not ready. Please refresh the page.', 'error');
        }
    }

    handleRunTests() {
        if (window.app && window.app.executeTests) {
            window.app.executeTests();
        } else {
            console.error('App controller not available for test execution');
            this.logToConsole('spring', '❌ Application not ready. Please refresh the page.', 'error');
            this.logToConsole('node', '❌ Application not ready. Please refresh the page.', 'error');
        }
    }

    handleResetAll() {
        if (window.app && window.app.resetAll) {
            window.app.resetAll();
        } else {
            console.error('App controller not available for reset');
            this.logToConsole('spring', '❌ Application not ready. Please refresh the page.', 'error');
            this.logToConsole('node', '❌ Application not ready. Please refresh the page.', 'error');
        }
    }

    handleSaveSettings() {
        if (window.app && window.app.saveSettings) {
            window.app.saveSettings();
        } else {
            console.error('App controller not available for saving settings');
            this.logToConsole('spring', '❌ Application not ready. Please refresh the page.', 'error');
        }
    }

    handleLanguageSwitch(lang) {
        if (window.app && window.app.switchLanguage) {
            window.app.switchLanguage(lang);
        } else {
            console.error('App controller not available for language switch');
            this.logToConsole('spring', '❌ Application not ready. Please refresh the page.', 'error');
        }
    }

    // Enhanced metrics display with counter animations
    updateMetricsDisplay(tech, metrics) {
        try {
            const elements = this.getMetricElements(tech);
            
            // Remove any existing animation classes
            Object.values(elements).forEach(element => {
                if (element) {
                    element.classList.remove('animating', 'pulse', 'live');
                }
            });

            // Use requestAnimationFrame for smooth animations
            requestAnimationFrame(() => {
                // Define metric order for sequential animation
                const metricList = [
                    { 
                        element: elements.response, 
                        value: metrics.avgResponseTime?.toFixed(2) || '0', 
                        current: this.currentValues[tech].response || '0', 
                        isMinMax: false 
                    },
                    { 
                        element: elements.throughput, 
                        value: metrics.throughput?.toFixed(2) || '0', 
                        current: this.currentValues[tech].throughput || '0', 
                        isMinMax: false 
                    },
                    { 
                        element: elements.success, 
                        value: metrics.successRate?.toFixed(1) || '0', 
                        current: this.currentValues[tech].success || '0', 
                        isMinMax: false 
                    },
                    { 
                        element: elements.errors, 
                        value: metrics.errorCount?.toString() || '0', 
                        current: this.currentValues[tech].errors || '0', 
                        isMinMax: false 
                    },
                    { 
                        element: elements.minmax, 
                        value: `${metrics.minResponseTime?.toFixed(2) || '0'} / ${metrics.maxResponseTime?.toFixed(2) || '0'}`, 
                        current: this.currentValues[tech].minmax || '0 / 0', 
                        isMinMax: true 
                    },
                    { 
                        element: elements.p95, 
                        value: metrics.p95ResponseTime?.toFixed(2) || '0', 
                        current: this.currentValues[tech].p95 || '0', 
                        isMinMax: false 
                    }
                ];

                metricList.forEach((metric, index) => {
                    if (metric.element) {
                        const delay = index * 100; // 0.1s sequential delay
                        setTimeout(() => {
                            metric.element.classList.add('animating');
                            if (metric.isMinMax) {
                                this.animateMinMax(metric.element, metric.current, metric.value);
                            } else {
                                this.animateStepCounter(metric.element, metric.value);
                            }
                            
                            setTimeout(() => {
                                metric.element.classList.remove('animating');
                            }, 1200);
                        }, delay);
                    }
                });

                // Update current values
                this.updateCurrentMetricValues(tech, metrics);
            });
        } catch (error) {
            console.error(`Error updating metrics for ${tech}:`, error);
        }
    }

    // Counter animation method
    animateStepCounter(element, targetValue, duration = 1200) {
        const startValue = parseFloat(element.textContent) || 0;
        const target = parseFloat(targetValue) || 0;
        if (startValue === target) return;
        
        const startTime = performance.now();
        const decimalPlaces = targetValue.toString().includes('.') ? targetValue.toString().split('.')[1].length : 0;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = startValue + (target - startValue) * easeOutQuart;
            
            element.textContent = currentValue.toFixed(decimalPlaces);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target.toFixed(decimalPlaces);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Special animation for min/max values with counting
    animateMinMax(element, oldValue, newValue, duration = 1200) {
        const [oldMinStr, oldMaxStr] = oldValue.split(' / ');
        const [newMinStr, newMaxStr] = newValue.split(' / ');
        const oldMin = parseFloat(oldMinStr) || 0;
        const oldMax = parseFloat(oldMaxStr) || 0;
        const newMin = parseFloat(newMinStr) || 0;
        const newMax = parseFloat(newMaxStr) || 0;
        
        if (oldMin === newMin && oldMax === newMax) return;
        
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const currentMin = oldMin + (newMin - oldMin) * easeOutQuart;
            const currentMax = oldMax + (newMax - oldMax) * easeOutQuart;
            
            element.textContent = `${currentMin.toFixed(2)} / ${currentMax.toFixed(2)}`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = newValue;
            }
        };
        
        requestAnimationFrame(animate);
    }

    // Update current metric values storage
    updateCurrentMetricValues(tech, metrics) {
        this.currentValues[tech] = {
            response: metrics.avgResponseTime?.toFixed(2) || '0',
            throughput: metrics.throughput?.toFixed(2) || '0',
            success: metrics.successRate?.toFixed(1) || '0',
            errors: metrics.errorCount?.toString() || '0',
            minmax: `${metrics.minResponseTime?.toFixed(2) || '0'} / ${metrics.maxResponseTime?.toFixed(2) || '0'}`,
            p95: metrics.p95ResponseTime?.toFixed(2) || '0'
        };
    }

    // Enhanced reset with animations
    resetMetrics(tech) {
        const elements = this.getMetricElements(tech);
        
        // Reset current values
        this.currentValues[tech] = this.createEmptyCurrentValues();
        
        // Animate each metric to zero
        const metricList = [
            { element: elements.response, value: '0', isMinMax: false },
            { element: elements.throughput, value: '0', isMinMax: false },
            { element: elements.success, value: '0', isMinMax: false },
            { element: elements.errors, value: '0', isMinMax: false },
            { element: elements.minmax, value: '0.00 / 0.00', isMinMax: true },
            { element: elements.p95, value: '0', isMinMax: false }
        ];

        metricList.forEach((metric, index) => {
            if (metric.element) {
                const delay = index * 100;
                setTimeout(() => {
                    metric.element.classList.add('animating');
                    if (metric.isMinMax) {
                        this.animateMinMax(metric.element, metric.element.textContent, metric.value);
                    } else {
                        this.animateStepCounter(metric.element, metric.value);
                    }
                    setTimeout(() => {
                        metric.element.classList.remove('animating');
                    }, 1200);
                }, delay);
            }
        });
    }

    // Rest of the methods remain the same...
    toggleLanguageSwitcher() {
        this.elements.languageSwitcher?.classList.toggle('open');
    }

    closeLanguageSwitcher() {
        this.elements.languageSwitcher?.classList.remove('open');
    }

    openSettings() {
        try {
            // Load current settings into form
            if (window.app?.config) {
                this.elements.springProtocol.value = window.app.config.spring.config.protocol;
                this.elements.springHost.value = window.app.config.spring.config.host;
                this.elements.springPort.value = window.app.config.spring.config.port;
                this.elements.springBase.value = window.app.config.spring.config.basePath;
                this.elements.springTimeout.value = window.app.config.spring.config.timeout;

                this.elements.nodeProtocol.value = window.app.config.node.config.protocol;
                this.elements.nodeHost.value = window.app.config.node.config.host;
                this.elements.nodePort.value = window.app.config.node.config.port;
                this.elements.nodeBase.value = window.app.config.node.config.basePath;
                this.elements.nodeTimeout.value = window.app.config.node.config.timeout;

                this.elements.apiVersion.value = window.app.config.settings.apiVersion;
                this.elements.retryEnabled.value = window.app.config.settings.retryEnabled.toString();
                this.elements.maxRetries.value = window.app.config.settings.maxRetries;
                this.elements.logLevel.value = window.app.config.settings.logLevel;
            }

            this.elements.settingsModal?.classList.add('active');
        } catch (error) {
            console.error('Error opening settings:', error);
        }
    }

    closeSettings() {
        this.elements.settingsModal?.classList.remove('active');
    }

    getMetricElements(tech) {
        return {
            response: document.getElementById(`${tech}-response`),
            throughput: document.getElementById(`${tech}-throughput`),
            success: document.getElementById(`${tech}-success`),
            errors: document.getElementById(`${tech}-errors`),
            minmax: document.getElementById(`${tech}-minmax`),
            p95: document.getElementById(`${tech}-p95`)
        };
    }

    updateProgress(completed, total, tech) {
        try {
            const progress = total > 0 ? (completed / total) * 100 : 0;
            if (this.elements.progressFill) {
                this.elements.progressFill.style.width = `${progress}%`;
            }
            if (this.elements.progressText) {
                this.elements.progressText.textContent = `Testing ${tech}: ${completed}/${total}`;
            }
            if (this.elements.completed) {
                this.elements.completed.textContent = completed;
            }
            if (this.elements.remaining) {
                this.elements.remaining.textContent = total - completed;
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    }

    clearConsole(tech) {
        const consoleEl = this.elements[`${tech}Console`];
        if (consoleEl) {
            consoleEl.innerHTML = '';
            this.logToConsole(tech, 'Console cleared', 'info');
        }
    }

    logToConsole(tech, message, type = 'info') {
        try {
            const consoleEl = this.elements[`${tech}Console`];
            if (!consoleEl) return;

            const timestamp = new Date().toLocaleTimeString();
            const line = document.createElement('div');
            line.className = `console-line ${type}`;
            
            const timestampSpan = document.createElement('span');
            timestampSpan.className = 'console-timestamp';
            timestampSpan.textContent = `[${timestamp}]`;
            
            const messageSpan = document.createElement('span');
            messageSpan.textContent = ` ${message}`;
            
            line.appendChild(timestampSpan);
            line.appendChild(messageSpan);
            consoleEl.appendChild(line);
            
            // Auto-scroll to bottom
            consoleEl.scrollTop = consoleEl.scrollHeight;
            
            // Limit console lines
            const maxLines = 200;
            while (consoleEl.children.length > maxLines) {
                consoleEl.removeChild(consoleEl.firstChild);
            }
        } catch (error) {
            console.error('Error logging to console:', error);
        }
    }

    // Getters for test configuration
    getScenario() {
        return this.elements.scenario?.value || 'post';
    }

    getRequestCount() {
        return parseInt(this.elements.count?.value) || 1000;
    }

    getTarget() {
        return this.elements.target?.value || '2';
    }

    getConcurrency() {
        return parseInt(this.elements.concurrency?.value) || 10;
    }

    // Status update methods
    updateConnectionStatus(tech, connected, message = '') {
        const statusEl = this.elements[`${tech}Status`];
        if (!statusEl) return;

        if (connected) {
            statusEl.classList.remove('disconnected');
            statusEl.classList.add('connected');
            statusEl.innerHTML = '<span class="status-dot"></span> Connected';
        } else {
            statusEl.classList.remove('connected');
            statusEl.classList.add('disconnected');
            statusEl.innerHTML = '<span class="status-dot"></span> Not Connected';
        }

        if (message) {
            this.logToConsole(tech, message, connected ? 'success' : 'error');
        }
    }
}