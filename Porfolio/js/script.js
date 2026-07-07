document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader with fallback to prevent visual freezing
    const loader = document.getElementById('preloader');
    const hideLoader = () => {
        if (loader && loader.style.display !== 'none') {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    };

    // Hide when page is fully loaded
    window.addEventListener('load', hideLoader);

    // Fallback: Force hide after 1.5 seconds if assets/images are slow to load
    setTimeout(hideLoader, 1500);

    // 2. Typing Effect (Updated roles for graduate status)
    const typingElement = document.querySelector('.typing');
    const roles = ["QA Analyst", "Data Analyst", "BSIT Graduate", "Magna Cum Laude Graduate"];
    let roleIdx = 0, charIdx = 0, isDeleting = false;

    function type() {
        const current = roles[roleIdx];
        typingElement.textContent = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);

        if (!isDeleting && charIdx > current.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    type();

    // 3. Navbar & Sticky Logic
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    menuToggle.onclick = () => {
        const isOpen = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    };

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.onclick = () => {
            navLinks.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            const icon = menuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        };
    });

    window.onscroll = () => {
        navbar.classList.toggle('sticky', window.scrollY > 100);
        document.getElementById('toTop').style.display = window.scrollY > 800 ? 'flex' : 'none';
    };

    // 4. Scrollspy (Active Navigation Highlighting) & Scroll Reveal
    const sections = document.querySelectorAll('header, section');
    const navItems = document.querySelectorAll('.nav-links a');

    // Scrollspy observer options (requires strict bounds to highlight correct section)
    const scrollspyOptions = {
        threshold: 0.2,
        rootMargin: "-15% 0px -65% 0px"
    };

    const scrollspyObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    const href = item.getAttribute('href');
                    if (href === `#${id}`) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, scrollspyOptions);

    sections.forEach(sec => scrollspyObserver.observe(sec));

    // Separate Reveal Observer for faster and smoother animation triggers
    const revealOptions = {
        threshold: 0.05, // Animates as soon as 5% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Triggers slightly before rolling fully into viewport
    };

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.classList.contains('reveal')) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Stop observing once loaded to save CPU cycles
            }
        });
    }, revealOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 5. Gallery Carousel Logic
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    let currentIndex = 0;
    let autoSlideInterval;

    function getSlideWidth() {
        const style = window.getComputedStyle(track);
        const gap = parseInt(style.gap) || 25;
        return slides[0].offsetWidth + gap;
    }

    function moveToIndex(index) {
        const slideWidth = getSlideWidth();
        const visibleSlides = Math.round(track.parentElement.offsetWidth / slides[0].offsetWidth);
        const maxIndex = slides.length - visibleSlides;
        
        if (index > maxIndex) currentIndex = 0;
        else if (index < 0) currentIndex = Math.max(0, maxIndex);
        else currentIndex = index;

        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    nextBtn.onclick = () => { stopAutoSlide(); moveToIndex(currentIndex + 1); startAutoSlide(); };
    prevBtn.onclick = () => { stopAutoSlide(); moveToIndex(currentIndex - 1); startAutoSlide(); };

    function startAutoSlide() { autoSlideInterval = setInterval(() => moveToIndex(currentIndex + 1), 4000); }
    function stopAutoSlide() { clearInterval(autoSlideInterval); }

    startAutoSlide();
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);
    window.addEventListener('resize', () => moveToIndex(currentIndex));

    // 6. SHARED LIGHTBOX LOGIC
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('full-cert-img');
    const closeModal = document.querySelector('.close-modal');
    const lightboxTriggers = document.querySelectorAll('.cert-item, .gallery-item');

    lightboxTriggers.forEach(item => {
        item.style.cursor = 'pointer';
        item.onclick = () => {
            modal.style.display = 'flex';
            modalImg.src = item.dataset.img;
        };
    });

    const closeLightbox = () => { modal.style.display = 'none'; };
    closeModal.onclick = closeLightbox;
    window.onclick = (e) => { if (e.target == modal) closeLightbox(); };

    // Escape Key Support for Lightbox closing
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeLightbox();
        }
    });

    // 7. Scroll Top
    document.getElementById('toTop').onclick = () => window.scrollTo({top:0, behavior:'smooth'});

    // 8. WORKING SEND MESSAGE FORM (AJAX)
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const btn = document.getElementById('submit-btn');

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        btn.innerHTML = "Sending... <i class='fas fa-spinner fa-spin'></i>";
        btn.disabled = true;

        const data = new FormData(event.target);
        
        fetch(event.target.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                status.style.display = "block";
                status.style.color = "var(--primary)";
                status.textContent = "Success! Message sent to Ruel.";
                form.reset();
                btn.innerHTML = "Sent! <i class='fas fa-check'></i>";
            } else {
                status.textContent = "Oops! Submission error.";
                status.style.display = "block";
                status.style.color = "red";
                btn.disabled = false;
                btn.innerHTML = "Send Message <i class='fas fa-paper-plane'></i>";
            }
        }).catch(() => {
            status.style.display = "block";
            status.style.color = "red";
            status.textContent = "Communication error.";
            btn.disabled = false;
        });
    });

    // 9. PROJECT FILTERING LOGIC
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.onclick = () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        };
    });
});