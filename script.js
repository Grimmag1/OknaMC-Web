const HEADER_HTML = `
<header>
    <nav>
        <a href="index.html" class="logo">
            <img src="images/icon.png" alt="Logo">
            <span>OKNA & DVEŘE</span>
        </a>
        <ul class="desktop-menu">
            <li><a href="index.html">Hlavní stránka</a></li>
            <li><a href="services.html">Služby</a></li>
            <li><a href="about.html">O nás</a></li>
            <li><a href="contact.html">Kontakt</a></li>
        </ul>
        <button id="menu-btn" aria-label="Menu">☰</button>
    </nav>
    <div id="mobile-menu" class="mobile-menu hidden">
        <a href="index.html">Hlavní stránka</a>
        <a href="services.html">Služby</a>
        <a href="about.html">O nás</a>
        <a href="contact.html">Kontakt</a>
    </div>
</header>`;

const FOOTER_HTML = `
<footer>
    <div class="footer-content">
        <div class="footer-section">
            <h4>Kontaktní údaje</h4>
            <p>E-mail: martin.cepica@email.cz</p>
            <p>Tel: +420 739 249 434</p>
            <p>IČ: 72987324 DIČ: CZ7202135699</p>
        </div>
        <div class="footer-section">
            <h4>MC OKNA & DVEŘE</h4>
            <p>Poctivé řešení, na které se můžete spolehnout</p>
        </div>
    </div>
    <div class="footer-bottom">
        © 2026 MC OKNA & DVEŘE – Všechna práva vyhrazena
    </div>
</footer>`;

function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

    document.addEventListener('click', (event) => {
        if (!menuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
}

function initCarousel() {
    const wrapper = document.querySelector('.services-carousels');
    if (!wrapper) return;

    const tracks = wrapper.querySelectorAll('.carousel-track');
    if (!tracks.length) return;

    const imageGroups = Array.from(tracks).map(t => t.querySelectorAll('img'));
    const total = imageGroups[0].length;
    let current = 0;

    imageGroups.forEach(imgs => imgs[0].classList.add('active'));

    function goTo(index) {
        imageGroups.forEach(imgs => {
            imgs[current].classList.remove('active');
            imgs[index].classList.add('active');
        });
        current = index;
    }

    wrapper.querySelector('.carousel-prev').addEventListener('click', () => {
        goTo((current - 1 + total) % total);
    });

    wrapper.querySelector('.carousel-next').addEventListener('click', () => {
        goTo((current + 1) % total);
    });

    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 150) {
            goTo(diff > 0 ? (current + 1) % total : (current - 1 + total) % total);
        }
    }, { passive: true });

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') goTo((current + 1) % total);
        if (e.key === 'ArrowLeft') goTo((current - 1 + total) % total);
    });
}

function setActiveNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    document.querySelectorAll('.desktop-menu a').forEach(link => {
        if (link.getAttribute('href') === page) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {

    // Inject shared header and footer
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (headerPlaceholder) headerPlaceholder.innerHTML = HEADER_HTML;
    if (footerPlaceholder) footerPlaceholder.innerHTML = FOOTER_HTML;
    setActiveNav();
    initMobileMenu();
    initCarousel();

    // Contact form handling via Formspree
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Odesílání...';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    contactForm.innerHTML = '<p class="form-success">Vaše zpráva byla úspěšně odeslána.</p>';
                } else {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Odeslat zprávu';
                    alert('Odeslání se nezdařilo. Zkuste to prosím znovu.');
                }
            } catch {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Odeslat zprávu';
                alert('Chyba sítě. Zkuste to prosím znovu.');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});
