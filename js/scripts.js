document.addEventListener("DOMContentLoaded", async function () {
    await loadNavbar();
    setupNavbarBehavior();
    setupMobileMenu();
    highlightActivePage();
    await loadFooter();
    setupCounters();
    setupCarousel();
    setupAccordion();
    await loadComponents();
});

/** ================================
 * ✅ Cargar Navbar Dinámicamente
 * ================================ */
async function loadNavbar() {
    const navbarContainer = document.createElement("div");
    navbarContainer.id = "navbar-container";
    document.body.prepend(navbarContainer);

    try {
        const response = await fetch("components/navbar.html");
        const html = await response.text();
        navbarContainer.innerHTML = html;
    } catch (error) {
        console.error("Error cargando la navbar:", error);
    }
}

/** ================================
 * ✅ Resaltar Página Activa en Navbar
 * ================================ */
function highlightActivePage() {
    const navLinks = document.querySelectorAll("#navbar-container a");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (linkHref && linkHref.endsWith(currentPage)) {
            link.classList.add("font-bold", "underline", "text-sf-blue");
        }
    });
}

/** ================================
 * ✅ Configurar comportamiento de la Navbar (ocultar/mostrar con scroll)
 * ================================ */
function setupNavbarBehavior() {
    let lastScrollTop = 0;
    const navbar = document.getElementById("navbar");

    if (!navbar) return;

    window.addEventListener("scroll", function () {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        navbar.style.transform = scrollTop > lastScrollTop ? "translateY(-100%)" : "translateY(0)";
        lastScrollTop = scrollTop;
    });
}

/** ================================
 * ✅ Configurar Menú Móvil
 * ================================ */
function setupMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");
    });

    document.querySelectorAll("#mobileMenu a").forEach(link => {
        link.addEventListener("click", function () {
            mobileMenu.classList.add("hidden");
        });
    });
}

/** ================================
 * ✅ Cargar Footer Dinámicamente
 * ================================ */
async function loadFooter() {
    const footerContainer = document.getElementById("footer-container");
    if (!footerContainer) return;

    try {
        const response = await fetch("components/footer.html");
        const html = await response.text();
        footerContainer.innerHTML = html;
    } catch (error) {
        console.error("Error cargando el footer:", error);
    }
}

/** ================================
 * ✅ Cargar Componentes Dinámicos
 * ================================ */
async function loadComponents() {
    const components = [
        { id: "rabon1-container", url: "components/rabon1.html" },
        { id: "rabon2-container", url: "components/rabon2.html" },
        { id: "camioneta-container", url: "components/camioneta.html" },
        { id: "torton-container", url: "components/torton.html" }
    ];

    for (const component of components) {
        const container = document.getElementById(component.id);
        if (!container) continue;

        try {
            const response = await fetch(component.url);
            const html = await response.text();
            container.innerHTML = html;

            // Verifica si el componente es un slider y lo inicializa
            initializeSlider(component.id);
        } catch (error) {
            console.error(`Error cargando el componente ${component.url}:`, error);
        }
    }
}

/** ================================
 * ✅ Inicializar Sliders (Carruseles)
 * ================================ */
function initializeSlider(containerId) {
    setTimeout(() => {
        const sliderElement = document.querySelector(`#${containerId} .splide`);
        if (!sliderElement) return;

        new Splide(sliderElement, {
            type: "loop",
            perPage: 1,
            perMove: 1,
            autoplay: true,
            interval: 5000,
            arrows: true,
            pagination: true,
            breakpoints: {
                1024: { perPage: 2 },
                640: { perPage: 1 },
            },
        }).mount();
    }, 100);
}

/** ================================
 * ✅ Animación de Contadores
 * ================================ */
function setupCounters() {
    const counters = document.querySelectorAll(".counter");
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const counter = entry.target;
            let target = parseInt(counter.dataset.target, 10);
            let count = 0, increment = target / 100;

            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    counter.innerText = Math.ceil(count) + (counter.dataset.suffix || "");
                    setTimeout(updateCount, 30);
                } else {
                    counter.innerText = target + (counter.dataset.suffix || "");
                }
            };
            updateCount();
            counterObserver.unobserve(counter);
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

/** ================================
 * ✅ Animación Carrusel de Logos
 * ================================ */
function setupCarousel() {
    const carousel = document.querySelector(".logos-carousel");
    if (carousel) {
        carousel.addEventListener("mouseenter", () => carousel.style.animationPlayState = "paused");
        carousel.addEventListener("mouseleave", () => carousel.style.animationPlayState = "running");
    }
}

/** ================================
 * ✅ Configurar Acordeones
 * ================================ */
function setupAccordion() {
    document.querySelectorAll(".accordion-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector(".icon");

            // Alternar visibilidad
            content.classList.toggle("hidden");

            // Cambiar el icono de la flecha
            icon.classList.toggle("ri-arrow-drop-down-fill");
            icon.classList.toggle("ri-arrow-drop-up-fill");
        });
    });
}
