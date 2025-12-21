// script.js
// Theme Toggle
const toggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Mobile Menu
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenu = document.getElementById('close-menu');
menuBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
closeMenu.addEventListener('click', () => mobileMenu.classList.add('hidden'));

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Only prevent default and smooth scroll if it's an internal anchor link
        if (href.startsWith('#') && href.length > 1) {  // #about, #projects, etc.
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                mobileMenu.classList.add('hidden'); // Close mobile menu
            }
        }
        // External links (GitHub, LinkedIn, etc.) will work normally
    });
});

// Project Modal
const modal = document.getElementById('project-modal');
const projects = {
    career_tracker: {
        title: "Career Tracker",
        desc: "A personal job application tracking system to manage applications, interviews, referrals, and progress. Features user authentication, dashboard analytics, and responsive design.",
        tech: ["Python", "Django", "SQLite", "Tailwind CSS", "JavaScript"],
        link: "https://github.com/Vasanth242/Career_Tracker",
        status: "In Progress"
    },
    eqm: {
        title: "EQM",
        desc: "Enterprise Quality Management system with real-time defect tracking, reporting, and interactive analytics dashboard.",
        tech: ["Python", "Django", "Chart.js"],
        link: "https://github.com/Vasanth242/eqm",
        status: "Completed"
    },
    portfolio: {
        title: "Personal Portfolio",
        desc: "This responsive portfolio website featuring dark mode, smooth animations, interactive modals, and PDF certificate viewer.",
        tech: ["HTML", "CSS", "JavaScript", "Tailwind CSS"],
        link: "https://vasanth242.github.io/Portfolio/",
        status: "Live"
    }
};

function openProjectModal(id) {
    const p = projects[id];
    if (!p) {
        console.error("Project not found:", id);
        return;
    }

    // Set title with status badge
    let titleHtml = p.title;
    if (p.status) {
        titleHtml += ` <span class="badge bg-green-600 ml-2">${p.status}</span>`;
    }
    document.getElementById('modal-title').innerHTML = titleHtml;

    // Set description
    document.getElementById('modal-desc').textContent = p.desc;

    // Set tech badges
    document.getElementById('modal-tech').innerHTML = p.tech.map(t => 
        `<span class="tech-badge">${t}</span>`
    ).join('');

    // Set link button - CORRECT WAY
    const linkBtn = document.getElementById('modal-link');
    linkBtn.setAttribute('href', p.link);
    linkBtn.setAttribute('target', '_blank');
    linkBtn.setAttribute('rel', 'noopener noreferrer');
    linkBtn.textContent = p.link.includes('github.com') ? "View on GitHub →" : "View Live Project →";

    // Show modal
    modal.classList.add('visible');
}

function closeModal() {
    modal.classList.remove('visible');
}

// Close when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Section Observer
const sections = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });
sections.forEach(section => sectionObserver.observe(section));

// PDF Modal Functions
function openPdfModal(pdfUrl, title) {
    document.getElementById('pdf-modal-title').textContent = title;
    document.getElementById('pdf-frame').src = pdfUrl;
    document.getElementById('pdf-modal').classList.add('visible');
}

function closePdfModal() {
    document.getElementById('pdf-modal').classList.remove('visible');
    document.getElementById('pdf-frame').src = '';
}

// Attach click events to all "View" buttons
document.querySelectorAll('.view-pdf').forEach(button => {
    button.addEventListener('click', function() {
        const pdf = this.getAttribute('data-pdf');
        const title = this.getAttribute('data-title');
        openPdfModal(pdf, title);
    });
});

// Close on background click
document.getElementById('pdf-modal').addEventListener('click', function(e) {
    if (e.target === this) closePdfModal();
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.addEventListener('scroll', () => {
    document.getElementById('back-to-top').classList.toggle('opacity-100', window.scrollY > 500);
    document.getElementById('back-to-top').classList.toggle('pointer-events-auto', window.scrollY > 500);
});