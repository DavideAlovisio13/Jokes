// Enhanced JavaScript for Jokes App
// Provides better UX, animations, and interactive features

(function () {
    'use strict';

    // App namespace
    const JokesApp = {
        init() {
            this.setupEventListeners();
            this.initializeComponents();
            this.setupAnimations();
        },

        setupEventListeners() {
            document.addEventListener('DOMContentLoaded', () => {
                this.handleFormValidation();
                this.setupTooltips();
                this.handleLoadingStates();
                this.setupScrollEffects();
                this.initializeSearch();
            });
        },

        initializeComponents() {
            // Initialize Bootstrap tooltips
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });

            // Initialize any modals
            const modalElements = document.querySelectorAll('.modal');
            modalElements.forEach(modal => {
                new bootstrap.Modal(modal);
            });
        },

        setupAnimations() {
            // Intersection Observer for fade-in animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observe elements with fade-in class
            document.querySelectorAll('.fade-in').forEach(el => {
                observer.observe(el);
            });
        },

        handleFormValidation() {
            const forms = document.querySelectorAll('form');

            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    if (!form.checkValidity()) {
                        e.preventDefault();
                        e.stopPropagation();

                        // Focus on first invalid field
                        const firstInvalid = form.querySelector(':invalid');
                        if (firstInvalid) {
                            firstInvalid.focus();
                            this.showFieldError(firstInvalid, 'Please fill in this field correctly.');
                        }
                    } else {
                        this.showFormLoading(form);
                    }

                    form.classList.add('was-validated');
                });

                // Real-time validation
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    input.addEventListener('blur', () => {
                        this.validateField(input);
                    });

                    input.addEventListener('input', () => {
                        if (input.classList.contains('is-invalid')) {
                            this.validateField(input);
                        }
                    });
                });
            });
        },

        validateField(field) {
            const isValid = field.checkValidity();

            field.classList.remove('is-valid', 'is-invalid');

            if (isValid) {
                field.classList.add('is-valid');
                this.hideFieldError(field);
            } else {
                field.classList.add('is-invalid');
                this.showFieldError(field, field.validationMessage);
            }
        },

        showFieldError(field, message) {
            let errorDiv = field.parentNode.querySelector('.field-error');

            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'field-error text-danger small mt-1';
                field.parentNode.appendChild(errorDiv);
            }

            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        },

        hideFieldError(field) {
            const errorDiv = field.parentNode.querySelector('.field-error');
            if (errorDiv) {
                errorDiv.style.display = 'none';
            }
        },

        showFormLoading(form) {
            const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');

            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.dataset.originalText = originalText;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
                submitBtn.disabled = true;

                // Re-enable button after 5 seconds (fallback)
                setTimeout(() => {
                    if (submitBtn.disabled) {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }
                }, 5000);
            }
        },

        setupTooltips() {
            // Add tooltips to action buttons
            const actionBtns = document.querySelectorAll('.btn[title]');
            actionBtns.forEach(btn => {
                btn.setAttribute('data-bs-toggle', 'tooltip');
                btn.setAttribute('data-bs-placement', 'top');
            });
        },

        handleLoadingStates() {
            // Add loading states to links that navigate away
            const navLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="javascript:"])');

            navLinks.forEach(link => {
                link.addEventListener('click', function (e) {
                    // Don't add loading to external links
                    if (this.hostname !== window.location.hostname) return;

                    // Don't add loading to download links
                    if (this.download) return;

                    // Don't add loading if it opens in new tab
                    if (this.target === '_blank') return;

                    this.classList.add('loading');

                    // Add spinner if it's a button
                    if (this.classList.contains('btn')) {
                        const icon = this.querySelector('i');
                        if (icon) {
                            icon.className = 'fas fa-spinner fa-spin me-2';
                        }
                    }
                });
            });
        },

        setupScrollEffects() {
            // Smooth scroll for anchor links
            const anchorLinks = document.querySelectorAll('a[href^="#"]');

            anchorLinks.forEach(link => {
                link.addEventListener('click', function (e) {
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Add scroll-to-top button
            this.addScrollToTopButton();
        },

        addScrollToTopButton() {
            const scrollBtn = document.createElement('button');
            scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            scrollBtn.className = 'btn btn-primary position-fixed scroll-to-top';
            scrollBtn.style.cssText = `
                bottom: 2rem;
                right: 2rem;
                z-index: 1000;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                pointer-events: none;
            `;

            document.body.appendChild(scrollBtn);

            // Show/hide on scroll
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollBtn.style.opacity = '1';
                    scrollBtn.style.transform = 'translateY(0)';
                    scrollBtn.style.pointerEvents = 'auto';
                } else {
                    scrollBtn.style.opacity = '0';
                    scrollBtn.style.transform = 'translateY(20px)';
                    scrollBtn.style.pointerEvents = 'none';
                }
            });

            // Scroll to top on click
            scrollBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        },

        initializeSearch() {
            const searchForms = document.querySelectorAll('form[action*="Search"]');

            searchForms.forEach(form => {
                const input = form.querySelector('input[name*="Search"]');

                if (input) {
                    // Add search icon
                    input.style.paddingLeft = '2.5rem';

                    const iconWrapper = document.createElement('div');
                    iconWrapper.style.cssText = `
                        position: absolute;
                        left: 0.75rem;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #6b7280;
                        pointer-events: none;
                    `;
                    iconWrapper.innerHTML = '<i class="fas fa-search"></i>';

                    input.parentNode.style.position = 'relative';
                    input.parentNode.appendChild(iconWrapper);

                    // Auto-submit on enter (with debounce)
                    let searchTimeout;
                    input.addEventListener('input', () => {
                        clearTimeout(searchTimeout);
                        searchTimeout = setTimeout(() => {
                            if (input.value.length >= 3) {
                                // Could trigger auto-search here
                                console.log('Auto-search for:', input.value);
                            }
                        }, 500);
                    });
                }
            });
        },

        // Utility functions
        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `alert alert-${type} position-fixed notification`;
            notification.style.cssText = `
                top: 2rem;
                right: 2rem;
                z-index: 1050;
                min-width: 300px;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            `;
            notification.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="fas fa-${type === 'success' ? 'check' : type === 'danger' ? 'exclamation' : 'info'}-circle me-2"></i>
                    <span>${message}</span>
                    <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
                </div>
            `;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 100);

            // Auto-remove
            setTimeout(() => {
                this.hideNotification(notification);
            }, 5000);

            // Manual close
            notification.querySelector('.btn-close').addEventListener('click', () => {
                this.hideNotification(notification);
            });
        },

        hideNotification(notification) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    };

    // Initialize the app
    JokesApp.init();

    // Make some functions globally available
    window.JokesApp = {
        showNotification: JokesApp.showNotification.bind(JokesApp),
        hideNotification: JokesApp.hideNotification.bind(JokesApp)
    };

})();