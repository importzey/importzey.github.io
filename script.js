document.querySelectorAll('a[href^="#"]').forEach(anchor => {
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
// Form submission handler (works if a .contact-form exists on the page)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
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

// Intersection observer for card animations (works if those elements exist on the page)
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

// Highlight active nav link based on current page
function setActiveNav() {
    const navLinks = document.querySelectorAll('nav a');
    const path = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === path);
    });
}

document.addEventListener('DOMContentLoaded', setActiveNav);
