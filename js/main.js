// CTA WeChat Button
(function() {
    var btn = document.getElementById('ctaWechatBtn');
    var popup = document.getElementById('ctaWechatPopup');
    if (btn && popup) {
        btn.addEventListener('click', function() {
            popup.style.display = 'flex';
        });
        popup.addEventListener('click', function(e) {
            if (e.target === popup) popup.style.display = 'none';
        });
    }
})();

// Stats Counter Animation
(function() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    function animateCounter(el, target) {
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function getDisplayValue(val, target) {
            const n = parseInt(val, 10);
            if (target === 10) return n;
            if (target === 99) return n;
            return n;
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * ease);
            el.textContent = getDisplayValue(currentValue, target);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = getDisplayValue(target, target);
            }
        }

        requestAnimationFrame(update);
    }

    let started = false;

    function checkVisible() {
        if (started) return;
        const section = document.querySelector('.stats-section');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            started = true;
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'), 10);
                animateCounter(counter, target);
            });
        }
    }

    window.addEventListener('scroll', checkVisible);
    checkVisible();
})();

// Hero Slider Auto-Scroll
(function() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % totalSlides;
        showSlide(next);
    }
    
    // Auto-scroll every 5 seconds
    let autoScrollTimer = setInterval(nextSlide, 5000);
    
    // Click on dots to navigate
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoScrollTimer);
            showSlide(index);
            autoScrollTimer = setInterval(nextSlide, 5000);
        });
    });
    
    // Click arrows
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(autoScrollTimer);
            const prev = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(prev);
            autoScrollTimer = setInterval(nextSlide, 5000);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(autoScrollTimer);
            nextSlide();
            autoScrollTimer = setInterval(nextSlide, 5000);
        });
    }
    
    // Pause on hover
    const slider = document.getElementById('heroSlider');
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoScrollTimer);
        });
        slider.addEventListener('mouseleave', () => {
            autoScrollTimer = setInterval(nextSlide, 5000);
        });
    }
})();

// Back to Top Button
(function() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// Product Tab Switch
(function() {
    const tabs = document.querySelectorAll('.product-tab');
    if (tabs.length === 0) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
})();

// FAQ Accordion
(function() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const answer = item.querySelector('.faq-answer');
                const icon = question.querySelector('i');
                if (answer) {
                    answer.classList.toggle('show');
                    if (icon) {
                        icon.style.transform = answer.classList.contains('show') ? 'rotate(180deg)' : '';
                    }
                }
            });
        }
    });
})();

// WeChat Popup
(function() {
    const wechatBtn = document.getElementById('wechatBtn');
    const wechatPopup = document.getElementById('wechatPopup');
    const wechatClose = document.getElementById('wechatClose');
    
    if (wechatBtn && wechatPopup) {
        wechatBtn.addEventListener('click', () => {
            wechatPopup.classList.add('show');
        });
    }
    
    if (wechatClose && wechatPopup) {
        wechatClose.addEventListener('click', () => {
            wechatPopup.classList.remove('show');
        });
    }
    
    if (wechatPopup) {
        wechatPopup.addEventListener('click', (e) => {
            if (e.target === wechatPopup) {
                wechatPopup.classList.remove('show');
            }
        });
    }
})();