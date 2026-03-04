/**
 * Marketing Jur - JavaScript Principal
 * Funcionalidades interativas e animações
 * (Lógica de modais de preços está no script inline do index.html)
 */

// ===================================
// Configurações e Estado Global
// ===================================
const CONFIG = {
    animationDuration: 600,
    scrollOffset: 80,
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024
};

const state = {
    isMobile: window.innerWidth <= CONFIG.mobileBreakpoint,
    currentModule: null,
    scrollPosition: 0
};

// ===================================
// Utilitários
// ===================================
const utils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    isElementInViewport: (element, threshold = 0.1) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        return (
            rect.top >= -threshold * windowHeight &&
            rect.left >= -threshold * windowWidth &&
            rect.bottom <= (1 + threshold) * windowHeight &&
            rect.right <= (1 + threshold) * windowWidth
        );
    },

    smoothScroll: (target, duration = CONFIG.animationDuration) => {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - CONFIG.scrollOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easeInOutQuad = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;
            
            window.scrollTo(0, startPosition + distance * easeInOutQuad);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }
};

// ===================================
// Navegação
// ===================================
const navigation = {
    init: () => {
        navigation.setupMobileMenu();
        navigation.setupSmoothScroll();
        navigation.setupNavbarScroll();
    },

    setupMobileMenu: () => {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Fechar menu ao clicar em links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (state.isMobile) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    },

    setupSmoothScroll: () => {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                if (target !== '#') {
                    utils.smoothScroll(target);
                }
            });
        });
    },

    setupNavbarScroll: () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScrollTop = 0;
        
        window.addEventListener('scroll', utils.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        }, 100));
    }
};

// ===================================
// Animações de Scroll
// ===================================
const scrollAnimations = {
    init: () => {
        scrollAnimations.setupIntersectionObserver();
        scrollAnimations.animateOnLoad();
    },

    setupIntersectionObserver: () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    },

    animateOnLoad: () => {
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-content > *');
            heroElements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
            });
        }, 100);

        const heroCard = document.querySelector('.hero-card');
        if (heroCard) {
            heroCard.style.opacity = '0';
            heroCard.style.transform = 'translateX(50px)';
            heroCard.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';
            setTimeout(() => {
                heroCard.style.opacity = '1';
                heroCard.style.transform = 'translateX(0)';
            }, 300);
        }
    }
};

// ===================================
// Módulos Interativos
// ===================================
const modules = {
    init: () => {
        modules.setupModuleToggle();
        modules.setupProgressBars();
    },

    setupModuleToggle: () => {
        const moduleHeaders = document.querySelectorAll('.module-header');
        
        moduleHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const moduleCard = header.closest('.module-card');
                const isActive = moduleCard.classList.contains('active');
                
                // Fechar todos os módulos
                document.querySelectorAll('.module-card').forEach(card => {
                    card.classList.remove('active');
                });
                
                // Abrir o módulo clicado se não estiver ativo
                if (!isActive) {
                    moduleCard.classList.add('active');
                    state.currentModule = moduleCard.dataset.module;
                    
                    // Scroll suave para o módulo
                    utils.smoothScroll(moduleCard, 400);
                } else {
                    state.currentModule = null;
                }
            });
        });

        // Abrir primeiro módulo por padrão
        const firstModule = document.querySelector('.module-card');
        if (firstModule) {
            firstModule.classList.add('active');
            state.currentModule = firstModule.dataset.module;
        }
    },

    setupProgressBars: () => {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        const animateProgressBars = () => {
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 500);
            });
        };

        // Animação inicial
        setTimeout(animateProgressBars, 1000);
    }
};

// ===================================
// Botões e CTA
// ===================================
const buttons = {
    init: () => {
        buttons.setupButtonAnimations();
        buttons.setupCTAButtons();
    },

    setupButtonAnimations: () => {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    },

    setupCTAButtons: () => {
        const primaryButtons = document.querySelectorAll('.btn-primary');
        
        primaryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Adicionar efeito visual
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    },

    setupPricingFormToggle: () => {
        const configs = [
            {
                triggerSelector: '.pricing-btn-open-form',
                modalId: 'curso-online-modal'
            },
            {
                triggerSelector: '.pricing-btn-open-mentoria',
                modalId: 'mentoria-modal'
            },
            {
                triggerSelector: '.pricing-btn-open-corporate',
                modalId: 'corporate-modal'
            },
            {
                triggerSelector: '.hero-reserve-btn',
                modalId: 'curso-online-modal'
            }
        ];

        const initModal = ({ triggerSelector, modalId }) => {
            const triggers = document.querySelectorAll(triggerSelector);
            const modal = document.getElementById(modalId);
            if (!triggers.length || !modal) return;

            const closeButton = modal.querySelector('.pricing-modal-close');
            const form = modal.querySelector('.pricing-form');

            const openModal = () => {
                modal.classList.add('is-open');
                document.body.style.overflow = 'hidden';
                if (form) {
                    const firstInput = form.querySelector('input');
                    setTimeout(() => {
                        if (firstInput) firstInput.focus();
                    }, 100);
                }
            };

            const closeModal = () => {
                modal.classList.remove('is-open');
                document.body.style.overflow = 'auto';
                if (form) form.reset();
            };

            triggers.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal();
                });
            });

            if (closeButton) {
                closeButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    closeModal();
                });
            }

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                    closeModal();
                }
            });
        };

        configs.forEach(initModal);
    }
};

// ===================================
// Estatísticas Animadas
// ===================================
const stats = {
    init: () => {
        stats.setupAnimatedCounters();
    },

    setupAnimatedCounters: () => {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const suffix = counter.textContent.replace(/\d/g, '');
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            };
            
            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
};

// ===================================
// Resize Handler
// ===================================
const resizeHandler = {
    init: () => {
        window.addEventListener('resize', utils.debounce(() => {
            const wasMobile = state.isMobile;
            state.isMobile = window.innerWidth <= CONFIG.mobileBreakpoint;
            
            if (wasMobile !== state.isMobile) {
                // Recarregar funcionalidades que dependem do tamanho da tela
                navigation.setupMobileMenu();
            }
        }, 250));
    }
};

// ===================================
// Loading e Transições
// ===================================
const loading = {
    init: () => {
        loading.setupPageTransition();
        loading.hideLoader();
    },

    setupPageTransition: () => {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });
    },

    hideLoader: () => {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 300);
        }
    }
};

// ===================================
// Inicialização Principal
// ===================================
const app = {
    init: () => {
        // Ordem importante: configurações básicas primeiro
        loading.init();
        resizeHandler.init();
        
        // Depois funcionalidades específicas
        navigation.init();
        scrollAnimations.init();
        modules.init();
        buttons.init();
        stats.init();
        
        console.log('Marketing Jur - Site inicializado com sucesso!');
    }
};

// ===================================
// Event Listeners
// ===================================
document.addEventListener('DOMContentLoaded', app.init);

// Previne scroll durante carregamento
window.addEventListener('load', () => {
    document.body.style.overflow = 'auto';
});

// Estilos CSS dinâmicos para efeitos
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = [
    '.ripple { position:absolute; border-radius:50%; background:rgba(255,255,255,0.3); transform:scale(0); animation:ripple-animation 0.6s linear; pointer-events:none; }',
    '@keyframes ripple-animation { to { transform:scale(4); opacity:0; } }',
    '.nav-toggle.active span:nth-child(1) { transform:rotate(-45deg) translate(-5px,6px); }',
    '.nav-toggle.active span:nth-child(2) { opacity:0; transform:scaleX(0); }',
    '.nav-toggle.active span:nth-child(3) { transform:rotate(45deg) translate(-5px,-6px); }'
].join('\n');
document.head.appendChild(dynamicStyles);

// Exportar para uso global se necessário
window.MarketingJur = {
    utils,
    navigation,
    scrollAnimations,
    modules,
    buttons,
    stats,
    resizeHandler,
    loading,
    app
};