const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const themeToggle = document.getElementById("theme-toggle");
let savedTheme = "dark";
try {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") savedTheme = storedTheme;
} catch (error) {
    console.warn("The saved color theme could not be read.", error);
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
    document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#080c14" : "#f5f8fc";
}

applyTheme(savedTheme);
themeToggle.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    try {
        window.localStorage.setItem("theme", theme);
    } catch (error) {
        console.warn("The color theme could not be saved.", error);
    }
});

const menuButton = document.getElementById("menu-btn");
const navPanel = document.getElementById("primary-nav");
const navLinks = document.querySelectorAll(".nav-link");

function closeMenu() {
    navPanel.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
}

menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navPanel.classList.toggle("is-open", !isOpen);
});

navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
    const activeSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => {
                link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: "-25% 0px -65% 0px" });
    sections.forEach((section) => activeSectionObserver.observe(section));
}

const revealElements = document.querySelectorAll(
    ".metric-card, .experience-card, .project-card, .skill-card, .cert-card, .contact-card"
);
if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => {
        element.classList.add("js-reveal");
        revealObserver.observe(element);
    });
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}

const projectDetails = {
    career_tracker: {
        title: "Career Tracker",
        description: "A personal job application tracking system to manage applications, interviews, referrals, and progress. Features user authentication, dashboard analytics, and responsive design.",
        tech: ["Python", "Django", "SQLite", "Tailwind CSS", "JavaScript"],
        link: "https://github.com/Vasanth242/Career_Tracker",
        status: "In Progress",
        screenshots: [
            "assets/screenshots/career-tracker-1.png",
            "assets/screenshots/career-tracker-2.png",
            "assets/screenshots/career-tracker-3.png"
        ]
    },
    eqm: {
        title: "EQM",
        description: "Enterprise Quality Management system with real-time defect tracking, reporting, and interactive analytics dashboard.",
        tech: ["Python", "Django", "Chart.js"],
        link: "https://github.com/Vasanth242/eqm",
        status: "Enterprise",
        screenshots: []
    },
    portfolio: {
        title: "Personal Portfolio",
        description: "This responsive portfolio website featuring dark mode, smooth animations, interactive modals, and PDF certificate viewer.",
        tech: ["HTML5", "CSS3", "JavaScript", "Three.js"],
        link: "https://vasanth242.github.io/Portfolio/",
        status: "Live Build",
        screenshots: [
            "assets/screenshots/portfolio-1.png",
            "assets/screenshots/portfolio-2.png",
            "assets/screenshots/portfolio-3.png",
            "assets/screenshots/portfolio-4.png"
        ]
    }
};

const projectDialog = document.getElementById("project-modal");

function openProjectDialog(projectId) {
    const project = projectDetails[projectId];
    if (!project) {
        console.error(`Project details are missing for "${projectId}".`);
        return;
    }

    document.getElementById("modal-kicker").textContent = `// ${project.status.toUpperCase()}`;
    document.getElementById("modal-title").textContent = project.title;
    document.getElementById("modal-desc").textContent = project.description;

    const screenshots = document.getElementById("modal-screenshots");
    screenshots.replaceChildren();
    project.screenshots.forEach((src, index) => {
        const image = document.createElement("img");
        image.src = src;
        image.alt = `${project.title} screenshot ${index + 1}`;
        image.loading = "lazy";
        screenshots.appendChild(image);
    });

    const techList = document.getElementById("modal-tech");
    techList.replaceChildren();
    project.tech.forEach((technology) => {
        const badge = document.createElement("span");
        badge.className = "tech-pill";
        badge.textContent = technology;
        techList.appendChild(badge);
    });

    const projectLink = document.getElementById("modal-link");
    projectLink.href = project.link;
    projectLink.textContent = project.link.includes("github.com") ? "View on GitHub ↗" : "View Live Project ↗";
    projectDialog.showModal();
}

document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("click", () => openProjectDialog(card.dataset.project));
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => button.closest("dialog").close());
});

projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) projectDialog.close();
});

const backToTop = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
});

document.getElementById("current-year").textContent = String(new Date().getFullYear());

const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formMessage = document.getElementById("form-message");

    submitButton.disabled = true;
    submitButton.textContent = "Sending…";
    formMessage.textContent = "";
    formMessage.className = "form-message";

    try {
        const response = await fetch(contactForm.action, {
            method: "POST",
            body: new FormData(contactForm),
            headers: { Accept: "application/json" }
        });
        if (!response.ok) {
            throw new Error(`Contact form request failed with status ${response.status}.`);
        }
        formMessage.textContent = "Message sent successfully!";
        formMessage.classList.add("success");
        contactForm.reset();
    } catch (error) {
        console.error("Unable to submit the contact form.", error);
        formMessage.textContent = "Your message could not be sent. Please try again or email me directly.";
        formMessage.classList.add("error");
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message <span aria-hidden="true">↗</span>';
    }
});

function initializeHeroScene() {
    const canvas = document.getElementById("hero-canvas");
    const frame = canvas.closest(".scene-frame");
    if (!window.THREE) {
        frame.classList.add("no-webgl");
        console.warn("Three.js did not load; displaying the static hero illustration.");
        return;
    }

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (error) {
        frame.classList.add("no-webgl");
        console.warn("WebGL is unavailable; displaying the static hero illustration.", error);
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const root = new THREE.Group();
    scene.add(root);
    scene.add(new THREE.AmbientLight(0x9bbdff, 1.2));

    const keyLight = new THREE.PointLight(0x38bdf8, 24, 18);
    keyLight.position.set(2.5, 3.2, 4);
    scene.add(keyLight);

    const coreGeometry = new THREE.IcosahedronGeometry(0.9, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0x1d4ed8,
        emissive: 0x102d80,
        emissiveIntensity: 1.1,
        flatShading: true,
        metalness: 0.3,
        roughness: 0.35
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    root.add(core);

    const wireGeometry = new THREE.IcosahedronGeometry(1.22, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.38
    });
    const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    root.add(wireframe);

    const orbitMaterials = [
        new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.7 }),
        new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.72 })
    ];
    const cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.7,
        metalness: 0.45,
        roughness: 0.3
    });
    const cubeGeometry = new THREE.BoxGeometry(0.095, 0.095, 0.095);
    const orbitGroups = [];

    for (let orbitIndex = 0; orbitIndex < 2; orbitIndex += 1) {
        const orbit = new THREE.Group();
        orbit.rotation.x = orbitIndex === 0 ? Math.PI / 3 : Math.PI / 4;
        orbit.rotation.y = orbitIndex === 0 ? Math.PI / 9 : -Math.PI / 7;
        const majorRadius = orbitIndex === 0 ? 1.72 : 1.95;
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(majorRadius, 0.012, 8, 128),
            orbitMaterials[orbitIndex]
        );
        orbit.add(ring);

        for (let nodeIndex = 0; nodeIndex < 8; nodeIndex += 1) {
            const angle = (nodeIndex / 8) * Math.PI * 2 + (orbitIndex * Math.PI / 8);
            const node = new THREE.Mesh(cubeGeometry, cubeMaterial);
            node.position.set(Math.cos(angle) * majorRadius, Math.sin(angle) * majorRadius, 0);
            orbit.add(node);
        }

        root.add(orbit);
        orbitGroups.push(orbit);
    }

    const particlePositions = new Float32Array(180 * 3);
    const particleDrift = new Float32Array(180);
    for (let index = 0; index < particlePositions.length; index += 3) {
        particlePositions[index] = (Math.random() - 0.5) * 8;
        particlePositions[index + 1] = (Math.random() - 0.5) * 6;
        particlePositions[index + 2] = (Math.random() - 0.5) * 5;
        particleDrift[index / 3] = (Math.random() - 0.5) * 0.0012;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.018, transparent: true, opacity: 0.7 })
    );
    scene.add(particles);

    const cursor = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const onPointerMove = (event) => {
        const bounds = canvas.getBoundingClientRect();
        cursor.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        cursor.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", () => {
        cursor.x = 0;
        cursor.y = 0;
    });

    const resizeRenderer = () => {
        const bounds = frame.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(bounds.width, bounds.height, false);
        camera.aspect = bounds.width / bounds.height;
        camera.updateProjectionMatrix();
    };
    if ("ResizeObserver" in window) {
        new ResizeObserver(resizeRenderer).observe(frame);
    } else {
        window.addEventListener("resize", resizeRenderer, { passive: true });
    }
    resizeRenderer();

    let animationFrame;
    const animate = () => {
        animationFrame = window.requestAnimationFrame(animate);
        targetRotation.x += (cursor.y * 0.19 - targetRotation.x) * 0.035;
        targetRotation.y += (cursor.x * 0.28 - targetRotation.y) * 0.035;
        root.rotation.x = targetRotation.x;
        root.rotation.y = targetRotation.y;

        if (!prefersReducedMotion.matches) {
            core.rotation.y += 0.004;
            core.rotation.x += 0.002;
            wireframe.rotation.y -= 0.002;
            orbitGroups[0].rotation.z += 0.0025;
            orbitGroups[1].rotation.z -= 0.0018;
            particles.rotation.y += 0.00025;
            particles.rotation.x += 0.00012;
            const positions = particleGeometry.attributes.position;
            for (let index = 0; index < particleDrift.length; index += 1) {
                const positionIndex = index * 3 + 1;
                positions.array[positionIndex] += particleDrift[index];
                if (positions.array[positionIndex] > 3.2) positions.array[positionIndex] = -3.2;
                if (positions.array[positionIndex] < -3.2) positions.array[positionIndex] = 3.2;
            }
            positions.needsUpdate = true;
        }

        renderer.render(scene, camera);
    };

    const setSceneMotion = () => {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = window.requestAnimationFrame(animate);
    };
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            window.cancelAnimationFrame(animationFrame);
        } else {
            setSceneMotion();
        }
    });
    prefersReducedMotion.addEventListener("change", () => {
        if (document.hidden) return;
        setSceneMotion();
    });
    setSceneMotion();
}

initializeHeroScene();
