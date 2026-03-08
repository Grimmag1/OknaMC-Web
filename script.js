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

function setActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.desktop-menu a').forEach(link => {
        if (link.getAttribute('href') === page) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {

    // Load shared header and footer
    Promise.all([
        fetch('header.html').then(r => r.text()),
        fetch('footer.html').then(r => r.text())
    ]).then(([headerHtml, footerHtml]) => {
        document.getElementById('header-placeholder').innerHTML = headerHtml;
        document.getElementById('footer-placeholder').innerHTML = footerHtml;
        setActiveNav();
        initMobileMenu();
    });

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

    // Gallery population from manifest
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid) {
        fetch('images/realizace/images.json')
            .then(res => res.json())
            .then(files => {
                files.forEach((filename, i) => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.innerHTML = `
                        <img src="images/realizace/${filename}" alt="Realizace ${i + 1}">
                        <div class="gallery-overlay"><h3>Realizace ${i + 1}</h3></div>
                    `;
                    galleryGrid.appendChild(item);
                });
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
