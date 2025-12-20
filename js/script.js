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
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        mobileMenu.classList.add('hidden');
    });
});

// Project Modal
const modal = document.getElementById('project-modal');
const projects = {
    hrms: {
        title: "HRMS",
        desc: "Automated HR workflows with role-based access, attendance tracking, and payroll management.",
        tech: ["Django", "SQLite", "Bootstrap"],
        link: "https://github.com/Vasanth242/hrms"
    },
    eqm: {
        title: "EQM",
        desc: "Enterprise Quality Management system with real-time defect tracking and analytics.",
        tech: ["Python", "Django", "Chart.js"],
        link: "https://github.com/Vasanth242/eqm"
    },
    portfolio: {
        title: "Personal Portfolio",
        desc: "Responsive portfolio with dark mode, animations, and project modals.",
        tech: ["HTML", "CSS", "JavaScript"],
        link: "https://vasanth242.github.io/portfolio"
    }
};

// This function opens the modal with project details (based on project ID) for now removed onclick from cards except portfolio card if needed can be added   
function openModal(id) {
    const p = projects[id];
    document.getElementById('modal-title').textContent = p.title;
    document.getElementById('modal-desc').textContent = p.desc;
    document.getElementById('modal-tech').innerHTML = p.tech.map(t => `<span class="tech-badge">${t}</span>`).join('');
    document.getElementById('modal-link').href = p.link;
    modal.classList.add('visible');
}

function closeModal() {
    modal.classList.remove('visible');
}

modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
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
    document.getElementById('pdf-download-btn').href = pdfUrl;
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