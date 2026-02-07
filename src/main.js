import './style.css'

// Mobile Menu Toggle
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    const body = document.body;

    if (menu.classList.contains('opacity-0')) {
        // Open
        menu.classList.remove('opacity-0', 'pointer-events-none');
        menu.classList.add('opacity-100', 'pointer-events-auto');
        icon.setAttribute('icon', 'solar:close-square-linear');
        body.style.overflow = 'hidden';
    } else {
        // Close
        menu.classList.remove('opacity-100', 'pointer-events-auto');
        menu.classList.add('opacity-0', 'pointer-events-none');
        icon.setAttribute('icon', 'solar:hamburger-menu-linear');
        body.style.overflow = 'auto';
    }
}

document.getElementById('mobile-menu-btn').addEventListener('click', toggleMenu);

// Expose globally for inline onclick="" handlers
window.toggleMenu = toggleMenu;

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg', 'bg-neutral-950/95');
        navbar.classList.remove('bg-neutral-950/80');
    } else {
        navbar.classList.remove('shadow-lg', 'bg-neutral-950/95');
        navbar.classList.add('bg-neutral-950/80');
    }
});

// FAQ Toggle Function
function toggleFaq(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('.faq-icon');

    // Toggle current
    const isExpanded = content.classList.contains('grid-rows-[1fr]');

    // Reset all icons
    document.querySelectorAll('.faq-icon').forEach(i => {
        i.setAttribute('icon', 'solar:add-circle-linear');
        i.classList.remove('rotate-45', 'text-orange-500');
        i.classList.add('text-neutral-500');
    });

    // Close all
    document.querySelectorAll('.faq-content').forEach(c => {
        c.classList.remove('grid-rows-[1fr]');
        c.classList.add('grid-rows-[0fr]');
    });

    if (!isExpanded) {
        content.classList.remove('grid-rows-[0fr]');
        content.classList.add('grid-rows-[1fr]');
        icon.setAttribute('icon', 'solar:add-circle-bold');
        icon.classList.add('rotate-45', 'text-orange-500');
        icon.classList.remove('text-neutral-500');
    }
}

// Expose globally for inline onclick="" handlers
window.toggleFaq = toggleFaq;

// Fade Up Animation Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});
