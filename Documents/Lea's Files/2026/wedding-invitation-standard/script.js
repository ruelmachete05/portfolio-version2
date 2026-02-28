AOS.init({ duration: 1200, once: true });

// --- MUSIC LOGIC ---
const bgMusic = document.getElementById("bg-music");
const musicIcon = document.getElementById("music-icon");
const enterBtn = document.getElementById('enter-btn');
let isPlaying = false;

enterBtn.addEventListener('click', () => {
    document.getElementById('entrance-overlay').classList.add('hidden');
    bgMusic.play().then(() => {
        isPlaying = true;
        musicIcon.innerText = "🎵";
    });
    AOS.refresh();
});

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.innerText = "🔇";
    } else {
        bgMusic.play();
        musicIcon.innerText = "🎵";
    }
    isPlaying = !isPlaying;
}

// --- COUNTDOWN LOGIC ---
const weddingDate = new Date("June 14, 2026 15:30:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const gap = weddingDate - now;
    const d = Math.floor(gap / (1000 * 60 * 60 * 24));
    const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((gap % (1000 * 60)) / 1000);
    document.getElementById("countdown").innerText = `${d} Days : ${h}h : ${m}m : ${s}s`;
}, 1000);

// --- PETAL RAIN ---
const petalContainer = document.getElementById('petal-container');
function createPetal() {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    const items = ['🌸', '🌿', '✨'];
    petal.innerHTML = items[Math.floor(Math.random() * items.length)];
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.animationDuration = (Math.random() * 3 + 6) + 's';
    petal.style.fontSize = (Math.random() * 10 + 12) + 'px';
    petal.style.opacity = Math.random() * 0.4 + 0.2;
    petalContainer.appendChild(petal);
    setTimeout(() => petal.remove(), 9000);
}
setInterval(createPetal, 800);


// --- SCROLL GUIDE (BACK TO TOP) LOGIC ---
const backToTopBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
    if (window.pageYOffset > 400) {
        backToTopBtn.classList.add("show");
    } else {
        backToTopBtn.classList.remove("show");
    }
});

backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});