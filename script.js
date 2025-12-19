(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        setActiveNav();
        initContactForm();
        initObservers();
        initInterestsInteractions();
    });

    function setActiveNav() {
        const navLinks = document.querySelectorAll('nav a');
        const path = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === path);
        });
    }

    function initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = (document.getElementById('name') || {}).value || '';
            const email = (document.getElementById('email') || {}).value || '';
            const message = (document.getElementById('message') || {}).value || '';

            if (!name.trim() || !email.trim() || !message.trim()) {
                alert('Please fill in all fields');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            alert(`Thank you ${name}! Your message has been received. I'll get back to you soon.`);
            this.reset();
        });
    }

    function initObservers() {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.skill-card, .project-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    /* ----------------- Interests page interactions ----------------- */
    function initInterestsInteractions() {
        const page = document.querySelector('.interests-page');
        if (!page) return; // bail out when not on interests page

        const cards = Array.from(page.querySelectorAll('.interest-card'));
        const surpriseBtn = document.getElementById('surpriseBtn');
        const shuffleBtn = document.getElementById('shuffleBtn');
        const actionMsg = document.getElementById('actionMsg');
        const emojis = ['🎉','✨','🎈','🔥','🎮','🐶','🐱','🐎','🕹️'];

        // click + keyboard
        cards.forEach(card => {
            card.addEventListener('click', () => activateCard(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateCard(card); }
            });
        });

        if (shuffleBtn) shuffleBtn.addEventListener('click', () => { shuffleAll(); flashMessage('Shuffled!'); });
        if (surpriseBtn) surpriseBtn.addEventListener('click', () => {
            const pick = cards[Math.floor(Math.random() * cards.length)];
            if (!pick) return;
            pick.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => { activateCard(pick); flashMessage(`Surprise: ${pick.querySelector('.interest-label')?.textContent || '✨'}`); }, 420);
        });

        // activate (show fact + burst + highlight)
        function activateCard(card) {
            showFact(card);
            burstEmojis(card, 8);
            pulse(card);
        }

        function showFact(card) {
            const text = card.dataset.fact || 'Fun fact: I love this!';
            // remove any existing popover quickly
            const existing = card.querySelector('.fact-popover');
            if (existing) existing.remove();

            const pop = document.createElement('div');
            pop.className = 'fact-popover';
            pop.textContent = text;
            card.appendChild(pop);

            setTimeout(() => pop.classList.add('visible'), 20);
            setTimeout(() => pop.remove(), 3500);
        }

        function burstEmojis(card, amount = 6) {
            const wrapper = document.createElement('div');
            wrapper.className = 'emoji-burst';
            card.appendChild(wrapper);

            for (let i = 0; i < amount; i++) {
                const span = document.createElement('span');
                span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                const tx = (Math.random() * 120 - 60).toFixed(0) + 'px';
                span.style.setProperty('--tx', tx);
                span.style.left = (40 + Math.random() * 40) + '%';
                span.style.animationDelay = (i * 30) + 'ms';
                wrapper.appendChild(span);
            }

            // remove after animation
            setTimeout(() => wrapper.remove(), 1200);
        }

        function pulse(card) {
            card.classList.remove('active-anim');
            // trigger reflow
            void card.offsetWidth;
            card.classList.add('active-anim');
            setTimeout(() => card.classList.remove('active-anim'), 900);
        }

        function shuffleAll() {
            const grids = page.querySelectorAll('.interests-grid');
            grids.forEach(grid => {
                const items = Array.from(grid.children);
                // Fisher-Yates
                for (let i = items.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [items[i], items[j]] = [items[j], items[i]];
                }
                items.forEach(item => grid.appendChild(item));
            });
        }

        function flashMessage(text) {
            if (!actionMsg) return;
            actionMsg.textContent = text;
            clearTimeout(actionMsg._timeout);
            actionMsg._timeout = setTimeout(() => { actionMsg.textContent = ''; }, 3000);
        }
    }

})();
