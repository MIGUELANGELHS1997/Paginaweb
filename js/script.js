document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips de Bootstrap
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Inicializar popovers de Bootstrap
    if (typeof bootstrap !== 'undefined' && bootstrap.Popover) {
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }

    // Variables globales
    const yearBtns = document.querySelectorAll('.year-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;
    
    // Función para inicializar la línea de tiempo
    function initTimeline() {
        if (!yearBtns.length) return;
        
        // Navegación con botones de año
        yearBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                setActiveYear(index);
            });
        });
        
        // Navegación con flechas
        prevBtn?.addEventListener('click', function() {
            if (currentIndex > 0) {
                setActiveYear(currentIndex - 1);
            }
        });
        
        nextBtn?.addEventListener('click', function() {
            if (currentIndex < yearBtns.length - 1) {
                setActiveYear(currentIndex + 1);
            }
        });
        
        // Activar el primer año por defecto
        setActiveYear(0);
    }
    
    // Función para establecer año activo
    function setActiveYear(index) {
        currentIndex = index;
        
        // Actualizar botones activos
        yearBtns.forEach((b, i) => {
            b.classList.toggle('active', i === currentIndex);
            const bsActiveClass = 'btn-primary';
            const bsInactiveClass = 'btn-outline-secondary';
            b.classList.toggle(bsActiveClass, i === currentIndex);
            b.classList.toggle(bsInactiveClass, i !== currentIndex);
        });
        
        // Centrar el botón activo
        yearBtns[currentIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
    
    // Manejar el formulario de comentarios con validación Bootstrap
    function initCommentForm() {
        const commentForm = document.getElementById('commentForm');
        if (!commentForm) return;
        
        // Inicializar validación de Bootstrap
        if (typeof bootstrap !== 'undefined' && bootstrap.FormValidation) {
            const formValidation = new bootstrap.FormValidation(commentForm, {
                fields: {
                    commentName: {
                        validators: {
                            notEmpty: {
                                message: 'El nombre es requerido'
                            }
                        }
                    },
                    commentText: {
                        validators: {
                            notEmpty: {
                                message: 'El comentario es requerido'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new bootstrap.FormValidation.plugins.Trigger(),
                    bootstrap5: new bootstrap.FormValidation.plugins.Bootstrap5({
                        rowSelector: '.mb-3',
                        eleValidClass: '',
                        eleInvalidClass: 'is-invalid',
                        feedbackClass: 'invalid-feedback'
                    })
                }
            });
        }
        
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('commentName')?.value.trim();
            const text = document.getElementById('commentText')?.value.trim();
            const year = document.getElementById('commentYear')?.value.trim();
            
            if (name && text) {
                addComment(name, text, year);
                this.reset();
                
                // Mostrar toast de éxito
                showBootstrapToast('Comentario añadido correctamente', 'success');
            }
        });
    }
    
    // Función para mostrar toasts de Bootstrap
    function showBootstrapToast(message, type = 'success') {
        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            const toastContainer = document.getElementById('toastContainer') || createToastContainer();
            const toastId = 'toast-' + Date.now();
            
            const toastEl = document.createElement('div');
            toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
            toastEl.setAttribute('role', 'alert');
            toastEl.setAttribute('aria-live', 'assertive');
            toastEl.setAttribute('aria-atomic', 'true');
            toastEl.id = toastId;
            
            toastEl.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            `;
            
            toastContainer.appendChild(toastEl);
            const toast = new bootstrap.Toast(toastEl, { autohide: true, delay: 5000 });
            toast.show();
            
            // Eliminar el toast después de ocultarse
            toastEl.addEventListener('hidden.bs.toast', function() {
                toastEl.remove();
            });
        } else {
            // Fallback si Bootstrap no está disponible
            alert(message);
        }
    }
    
    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'position-fixed bottom-0 end-0 p-3';
        container.style.zIndex = '11';
        document.body.appendChild(container);
        return container;
    }
    
    // Función para añadir comentarios
    function addComment(name, text, year = '') {
        const commentsList = document.querySelector('.comments-list');
        if (!commentsList) return;
        
        const commentDiv = document.createElement('div');
        commentDiv.className = 'visitor-comment card mb-3';
        
        commentDiv.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="card-title mb-0">${escapeHTML(name)}</h5>
                    ${year ? `<span class="badge bg-primary">${escapeHTML(year)}</span>` : ''}
                </div>
                <p class="card-text">${escapeHTML(text)}</p>
                <div class="text-end">
                    <small class="text-muted">Ahora mismo</small>
                </div>
            </div>
        `;
        
        // Insertar después del título h4 o al principio si no hay otros comentarios
        const firstComment = commentsList.querySelector('.visitor-comment');
        if (firstComment) {
            commentsList.insertBefore(commentDiv, firstComment);
        } else {
            const h4 = commentsList.querySelector('h4');
            if (h4) {
                commentsList.insertBefore(commentDiv, h4.nextElementSibling);
            } else {
                commentsList.appendChild(commentDiv);
            }
        }
        
        // Animación de entrada con Bootstrap
        commentDiv.style.opacity = '0';
        commentDiv.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        commentDiv.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            commentDiv.style.opacity = '1';
            commentDiv.style.transform = 'translateY(0)';
        });
    }
    
    // Función para escapar HTML (seguridad)
    function escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag]));
    }
    
    // Menú responsive con Bootstrap
    function initResponsiveMenu() {
        const menuToggler = document.querySelector('[data-bs-toggle="offcanvas"]');
        if (menuToggler && typeof bootstrap !== 'undefined' && bootstrap.Offcanvas) {
            const offcanvas = new bootstrap.Offcanvas(menuToggler);
            
            // Cerrar offcanvas al hacer clic en un enlace
            document.querySelectorAll('.offcanvas a').forEach(link => {
                link.addEventListener('click', () => {
                    offcanvas.hide();
                });
            });
        }
    }
    
    // Efecto scroll en navbar con Bootstrap
    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled', 'shadow');
                navbar.classList.remove('navbar-transparent');
            } else {
                navbar.classList.remove('navbar-scrolled', 'shadow');
                navbar.classList.add('navbar-transparent');
            }
        });
        
        // Activar al cargar por si la página no está en top
        window.dispatchEvent(new Event('scroll'));
    }
    
    // Filtro de galería mejorado con Bootstrap y Isotope (si está disponible)
    function initGalleryFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        const galleryContainer = document.querySelector('.gallery-container');
        
        if (!filterButtons.length || !galleryItems.length || !galleryContainer) return;
        
        // Verificar si Isotope está disponible para filtros más avanzados
        if (typeof Isotope !== 'undefined') {
            const iso = new Isotope(galleryContainer, {
                itemSelector: '.gallery-item',
                layoutMode: 'fitRows',
                transitionDuration: '0.7s'
            });
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remover clase active de todos los botones
                    filterButtons.forEach(btn => {
                        btn.classList.remove('active', 'btn-primary');
                        btn.classList.add('btn-outline-primary');
                    });
                    
                    // Agregar clase active al botón clickeado
                    this.classList.add('active', 'btn-primary');
                    this.classList.remove('btn-outline-primary');
                    
                    const filterValue = this.getAttribute('data-filter');
                    iso.arrange({ filter: filterValue === 'all' ? '*' : filterValue });
                });
            });
            
            // Activar el primer filtro por defecto
            filterButtons[0]?.click();
        } else {
            // Fallback sin Isotope
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remover clase active de todos los botones
                    filterButtons.forEach(btn => {
                        btn.classList.remove('active', 'btn-primary');
                        btn.classList.add('btn-outline-primary');
                    });
                    
                    // Agregar clase active al botón clickeado
                    this.classList.add('active', 'btn-primary');
                    this.classList.remove('btn-outline-primary');
                    
                    const filterValue = this.getAttribute('data-filter');
                    
                    galleryItems.forEach(item => {
                        const shouldShow = filterValue === 'all' || 
                                         item.getAttribute('data-category') === filterValue;
                        
                        // Usar clases de Bootstrap para mostrar/ocultar
                        if (shouldShow) {
                            item.classList.remove('d-none');
                            item.classList.add('animate__animated', 'animate__fadeIn');
                        } else {
                            item.classList.add('d-none');
                            item.classList.remove('animate__animated', 'animate__fadeIn');
                        }
                    });
                });
            });
            
            // Activar el primer filtro por defecto
            filterButtons[0]?.click();
        }
    }
    
    // Animación de contadores con Bootstrap
    function initCounterAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (!statNumbers.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }
    
    function animateCounters(container) {
        const statNumbers = container.querySelectorAll('.stat-number');
        const speed = 200;
        
        statNumbers.forEach(statNumber => {
            const target = parseInt(statNumber.getAttribute('data-count')) || 0;
            let count = parseInt(statNumber.innerText) || 0;
            const increment = Math.ceil(target / speed);
            
            const updateCounter = () => {
                if (count < target) {
                    count += increment;
                    statNumber.innerText = count > target ? target : count;
                    requestAnimationFrame(updateCounter);
                } else {
                    statNumber.innerText = target + '+';
                    
                    // Añadir efecto de finalización
                    statNumber.classList.add('text-success');
                    setTimeout(() => {
                        statNumber.classList.remove('text-success');
                    }, 1000);
                }
            };
            
            updateCounter();
        });
    }
    
    // Animación para los miembros del equipo con Bootstrap
    function initTeamAnimation() {
        const teamCards = document.querySelectorAll('.team-member-card');
        if (!teamCards.length) return;
        
        const teamObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                        entry.target.style.setProperty('--animate-delay', `${index * 0.1}s`);
                    }, 100 * index);
                }
            });
        }, { threshold: 0.1 });
        
        teamCards.forEach(card => {
            teamObserver.observe(card);
        });
    }
    
    // Smooth scrolling para anclas con Bootstrap
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                const navbar = document.querySelector('.navbar');
                
                if (targetElement) {
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - navbarHeight,
                        behavior: 'smooth'
                    });
                    
                    // Cerrar offcanvas si está abierto
                    const offcanvas = document.querySelector('.offcanvas.show');
                    if (offcanvas && typeof bootstrap !== 'undefined' && bootstrap.Offcanvas) {
                        const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
                        if (bsOffcanvas) bsOffcanvas.hide();
                    }
                    
                    // Actualizar URL sin recargar la página
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        location.hash = targetId;
                    }
                }
            });
        });
    }
    
    // Formulario de contacto con Bootstrap
    function initContactForm() {
        const contactReason = document.getElementById('contactReason');
        if (contactReason) {
            contactReason.addEventListener('change', function() {
                const horariosBox = document.getElementById('horarios-box');
                if (horariosBox) {
                    horariosBox.style.display = this.value === 'citas' ? 'block' : 'none';
                }
            });
        }
        
        // Manejar el formulario de contacto
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            // Inicializar validación de Bootstrap
            if (typeof bootstrap !== 'undefined' && bootstrap.FormValidation) {
                const formValidation = new bootstrap.FormValidation(contactForm, {
                    fields: {
                        contactName: {
                            validators: {
                                notEmpty: {
                                    message: 'El nombre es requerido'
                                }
                            }
                        },
                        contactEmail: {
                            validators: {
                                notEmpty: {
                                    message: 'El email es requerido'
                                },
                                emailAddress: {
                                    message: 'El email no es válido'
                                }
                            }
                        },
                        contactMessage: {
                            validators: {
                                notEmpty: {
                                    message: 'El mensaje es requerido'
                                }
                            }
                        }
                    },
                    plugins: {
                        trigger: new bootstrap.FormValidation.plugins.Trigger(),
                        bootstrap5: new bootstrap.FormValidation.plugins.Bootstrap5({
                            rowSelector: '.mb-3',
                            eleValidClass: '',
                            eleInvalidClass: 'is-invalid',
                            feedbackClass: 'invalid-feedback'
                        })
                    }
                });
            }
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Simular envío
                const submitButton = this.querySelector('[type="submit"]');
                const originalText = submitButton.innerHTML;
                
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                    
                    // Mostrar modal de éxito
                    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                        const successModal = new bootstrap.Modal(document.getElementById('contactSuccessModal'));
                        successModal.show();
                    } else {
                        alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
                    }
                    
                    this.reset();
                }, 1500);
            });
        }
    }
    
    // Funcionalidad para preguntas frecuentes con Bootstrap
    function initFAQ() {
        const faqAccordion = document.getElementById('faqAccordion');
        if (faqAccordion && typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
            // Inicializar accordion de Bootstrap
            const accordionItems = faqAccordion.querySelectorAll('.accordion-item');
            
            accordionItems.forEach(item => {
                const button = item.querySelector('.accordion-button');
                const collapse = item.querySelector('.accordion-collapse');
                
                if (button && collapse) {
                    button.addEventListener('click', function() {
                        // Cerrar otros items si es necesario
                        if (!this.classList.contains('collapsed')) {
                            const bsCollapse = bootstrap.Collapse.getInstance(collapse);
                            if (bsCollapse) {
                                bsCollapse.hide();
                            }
                        }
                    });
                }
            });
        } else {
            // Fallback sin Bootstrap Accordion
            document.querySelectorAll('.faq-question').forEach(question => {
                question.addEventListener('click', function() {
                    const faqItem = this.parentElement;
                    const answer = this.nextElementSibling;
                    
                    // Cerrar otros FAQs abiertos
                    if (!this.classList.contains('active')) {
                        document.querySelectorAll('.faq-question.active').forEach(activeQ => {
                            activeQ.classList.remove('active');
                            activeQ.nextElementSibling.classList.remove('show');
                            activeQ.setAttribute('aria-expanded', 'false');
                        });
                    }
                    
                    // Alternar la pregunta actual
                    this.classList.toggle('active');
                    answer.classList.toggle('show');
                    
                    // Actualizar atributo ARIA
                    const isExpanded = this.classList.contains('active');
                    this.setAttribute('aria-expanded', isExpanded);
                });
            });
        }
    }
    
    // Inicializar todas las funciones
    function initAll() {
        initTimeline();
        initCommentForm();
        initResponsiveMenu();
        initNavbarScroll();
        initGalleryFilter();
        initCounterAnimation();
        initTeamAnimation();
        initSmoothScrolling();
        initContactForm();
        initFAQ();
    }
    
    // Ejecutar inicialización
    initAll();
});
