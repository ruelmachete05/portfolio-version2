document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader
    window.addEventListener('load', () => {
        const loader = document.getElementById('preloader');
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    });

    // 2. Typing Effect
    const typingElement = document.querySelector('.typing');
    const roles = ["QA Analyst", "Data Analyst", "BSIT Student", "Magna Cum Laude Candidate"];
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
        navLinks.classList.toggle('open');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    };

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.onclick = () => {
            navLinks.classList.remove('open');
            const icon = menuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        };
    });

    window.onscroll = () => {
        navbar.classList.toggle('sticky', window.scrollY > 100);
        document.getElementById('toTop').style.display = window.scrollY > 800 ? 'flex' : 'none';
    };

    // 4. Scroll Reveal
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

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

    closeModal.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };

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
});