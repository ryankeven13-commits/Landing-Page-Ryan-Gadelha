/* ==========================================================================
   DR. RYAN GADELHA - PREMIUM LANDING PAGE JAVASCRIPT
   Interactivity: Multi-step Scheduler, FAQ Accordion, Mobile Menu, WhatsApp Widget
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. HEADER INTERACTIVITY (SCROLL EFFECT)
       ---------------------------------------------------------------------- */
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once at load


    /* ----------------------------------------------------------------------
       2. MOBILE NAVIGATION MENU
       ---------------------------------------------------------------------- */
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileNavToggle.classList.toggle('active');
            
            // Toggle hamburger animation state
            const bars = mobileNavToggle.querySelectorAll('.bar');
            if (mobileNavToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(6px, -7px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileNavToggle.classList.remove('active');
                
                const bars = mobileNavToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });


    /* ----------------------------------------------------------------------
       3. ACTIVE SECTION HIGHLIGHT (INTERSECTION OBSERVER)
       ---------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    
    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px -50% 0px', // Matches header offset
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));


    /* ----------------------------------------------------------------------
       4. FAQ ACCORDION INTERACTIVITY
       ---------------------------------------------------------------------- */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items for a clean accordion effect
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                otherItem.querySelector('.faq-content').style.maxHeight = '0';
                otherItem.querySelector('.faq-content').setAttribute('aria-hidden', 'true');
            });

            if (!isActive) {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                content.setAttribute('aria-hidden', 'false');
                
                // Set max-height dynamically based on content height
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });


    /* ----------------------------------------------------------------------
       5. MULTI-STEP INTERACTIVE SCHEDULER WIDGET
       ---------------------------------------------------------------------- */
    const form = document.getElementById('appointmentForm');
    const steps = document.querySelectorAll('.form-step');
    const cardWidget = document.querySelector('.booking-widget-card');
    
    let currentStep = 1;

    // Next Step buttons
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                changeStep(currentStep + 1);
            }
        });
    });

    // Previous Step buttons
    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', () => {
            changeStep(currentStep - 1);
        });
    });

    const changeStep = (targetStep) => {
        if (targetStep < 1 || targetStep > steps.length) return;
        
        // Hide current step
        steps[currentStep - 1].classList.remove('active');
        
        // Show target step
        steps[targetStep - 1].classList.add('active');
        
        // Update widget active step indicator (matches CSS progress bar)
        currentStep = targetStep;
        cardWidget.setAttribute('data-step-active', currentStep);
    };

    const validateStep = (step) => {
        if (step === 1) {
            // Treatment is always pre-selected (radio buttons)
            return true;
        }
        if (step === 2) {
            // Validate that at least one preferred day is chosen
            const daysChecked = document.querySelectorAll('input[name="preferred_days"]:checked');
            if (daysChecked.length === 0) {
                alert('Por favor, selecione pelo menos um dia da semana de sua preferência.');
                return false;
            }
            return true;
        }
        return true;
    };

    // Form Submission (Build Message and Redirect to WhatsApp)
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Values
            const selectedTreatment = form.querySelector('input[name="treatment"]:checked').value;
            
            const preferredDaysElements = form.querySelectorAll('input[name="preferred_days"]:checked');
            const preferredDays = Array.from(preferredDaysElements).map(el => el.value).join(', ');
            
            const preferredShift = form.querySelector('input[name="preferred_shift"]:checked').value;
            const clientName = document.getElementById('client_name').value.trim();
            const clientPhone = document.getElementById('client_phone').value.trim();

            if (!clientName || !clientPhone) {
                alert('Por favor, preencha seu nome e celular para prosseguir.');
                return;
            }

            // Build Beautiful WhatsApp Message
            const whatsappNumber = '5588988574834'; // Dr. Ryan Gadelha active WhatsApp
            const message = `Olá, Dr. Ryan Gadelha! Gostaria de solicitar um pré-agendamento de consulta de avaliação:

🦷 *Procedimento:* ${selectedTreatment}
📅 *Dias de Preferência:* ${preferredDays}
⏰ *Turno Preferido:* ${preferredShift}

👤 *Nome do Paciente:* ${clientName}
📱 *WhatsApp:* ${clientPhone}

_Enviado através do Sistema de Agendamento da Landing Page._`;

            // Encode message and open WhatsApp tab
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
            
            window.open(whatsappURL, '_blank');
        });
    }


    /* ----------------------------------------------------------------------
       6. FLOATING WHATSAPP BUTTON & WELCOME POPUP
       ---------------------------------------------------------------------- */
    const whatsappBtn = document.getElementById('whatsappBtn');
    const whatsappPopup = document.getElementById('whatsappPopup');

    if (whatsappBtn && whatsappPopup) {
        // Toggle popup on click
        whatsappBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            whatsappPopup.classList.toggle('active');
        });

        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (!whatsappPopup.contains(e.target) && e.target !== whatsappBtn) {
                whatsappPopup.classList.remove('active');
            }
        });

        // Trigger welcome popup automatically after 6 seconds (hook user attention)
        setTimeout(() => {
            if (!whatsappPopup.classList.contains('active')) {
                whatsappPopup.classList.add('active');
            }
        }, 6000);
    }

    /* ----------------------------------------------------------------------
       7. INTERACTIVE SPECIALTY SELECTOR FOR FACILITY CLINIC
       ---------------------------------------------------------------------- */
    const specialtyButtons = document.querySelectorAll('.specialty-select-btn');
    const bookingIframe = document.querySelector('.booking-iframe');
    const btnOpenNewWindow = document.getElementById('btnOpenNewWindow');
    const bookingPlaceholder = document.getElementById('bookingPlaceholder');
    const bookingWidgetCard = document.getElementById('bookingWidgetCard');
    
    if (specialtyButtons.length > 0 && bookingIframe) {
        const baseUrl = 'https://facilityclinic.com/agendamento/0f855fbd-1289-4da0-8d0a-662bf115b0cd';
        
        specialtyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Stop any default form submission/behaviors
                
                // Remove active class from all buttons
                specialtyButtons.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Get specialty value
                const specialty = btn.getAttribute('data-specialty');
                const specialtyValue = encodeURIComponent(specialty);
                
                // Create robust query params covering common names
                const queryParams = `?obs=${specialtyValue}&observacao=${specialtyValue}&observacoes=${specialtyValue}&mensagem=${specialtyValue}&notes=${specialtyValue}&note=${specialtyValue}&comentario=${specialtyValue}`;
                const newUrl = baseUrl + queryParams;
                
                // Update iframe source
                bookingIframe.src = newUrl;
                
                // Update "Open in new window" button link
                if (btnOpenNewWindow) {
                    btnOpenNewWindow.href = newUrl;
                    btnOpenNewWindow.style.display = 'inline-flex'; // Show the button!
                }
                
                // Hide placeholder and show the live calendar widget card smoothly
                if (bookingPlaceholder) {
                    bookingPlaceholder.style.display = 'none';
                }
                if (bookingWidgetCard) {
                    bookingWidgetCard.style.display = 'block';
                }
            });
        });
    }

    /* ----------------------------------------------------------------------
       8. HYBRID VISITOR COUNTER (LIVE API + LOCAL FALLBACK)
       ---------------------------------------------------------------------- */
    const visitCountEl = document.getElementById('visit-count');
    if (visitCountEl) {
        // Base value representing historical views
        const BASE_VISITS = 15480; 
        
        // Key for local counter simulation
        const LOCAL_STORAGE_KEY = 'dr_ryan_visit_count';
        
        // Fetch from a free public counter API
        const fetchVisits = async () => {
            try {
                // Free, fast public counter endpoint
                const response = await fetch('https://api.counterapi.dev/v1/drryangadelha_visits/hits/increment');
                if (response.ok) {
                    const data = await response.json();
                    // API hit count + base values for high-traffic realism
                    const totalVisits = BASE_VISITS + data.value;
                    animateCounter(totalVisits);
                    localStorage.setItem(LOCAL_STORAGE_KEY, totalVisits);
                    return;
                }
            } catch (err) {
                console.warn('Visitor counter API offline, using premium local simulation fallback.');
            }
            
            // Fallback: Elegant simulation
            let localCount = parseInt(localStorage.getItem(LOCAL_STORAGE_KEY));
            if (isNaN(localCount) || !localCount) {
                localCount = BASE_VISITS + Math.floor(Math.random() * 250);
            } else {
                // Increment on reload to simulate progressive hits
                localCount += 1;
            }
            localStorage.setItem(LOCAL_STORAGE_KEY, localCount);
            animateCounter(localCount);
        };

        // Smooth number animation effect
        const animateCounter = (target) => {
            const start = target - 50 > 0 ? target - 50 : 0;
            let current = start;
            const duration = 1500; // 1.5s
            const intervalTime = Math.max(Math.floor(duration / 50), 15);
            const step = Math.ceil((target - start) / (duration / intervalTime));
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                // Format with period (brazilian dot format for thousands)
                visitCountEl.textContent = current.toLocaleString('pt-BR');
            }, intervalTime);
        };

        fetchVisits();
    }

});

