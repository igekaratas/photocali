// -------------------------
// Mobile menu
// -------------------------
const burger = document.querySelector(".burger");
const mobileNav = document.querySelector(".nav--mobile");

if (burger && mobileNav) {
    burger.addEventListener("click", () => {
        const isOpen = mobileNav.classList.toggle("open");
        burger.setAttribute("aria-expanded", String(isOpen));
        mobileNav.setAttribute("aria-hidden", String(!isOpen));
    });

    mobileNav.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
            mobileNav.classList.remove("open");
            burger.setAttribute("aria-expanded", "false");
            mobileNav.setAttribute("aria-hidden", "true");
        });
    });
}

// -------------------------
// Lightbox (full screen viewer)
// -------------------------
const tiles = Array.from(document.querySelectorAll(".tile img"));
const lightbox = document.querySelector(".lightbox");
const lbImg = document.querySelector(".lb-img");
const lbCaption = document.querySelector(".lb-caption");
const btnClose = document.querySelector(".lb-close");
const btnPrev = document.querySelector(".lb-prev");
const btnNext = document.querySelector(".lb-next");

let currentIndex = 0;

function getFullSrc(imgEl) {
    // Optional: <img src="thumb.jpg" data-full="full.jpg">
    return imgEl.getAttribute("data-full") || imgEl.src;
}

function render(index) {
    const imgEl = tiles[index];
    if (!imgEl) return;

    lbImg.src = getFullSrc(imgEl);
    lbImg.alt = imgEl.alt || "Photo";
    lbCaption.textContent = imgEl.alt || "";
}

function openLightbox(index) {
    if (!lightbox) return;
    currentIndex = index;

    render(currentIndex);

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    // Clear image to prevent showing old image flash
    lbImg.src = "";
    lbImg.alt = "";
    lbCaption.textContent = "";

    document.body.style.overflow = "";
}

function prev() {
    if (!tiles.length) return;
    currentIndex = (currentIndex - 1 + tiles.length) % tiles.length;
    render(currentIndex);
}

function next() {
    if (!tiles.length) return;
    currentIndex = (currentIndex + 1) % tiles.length;
    render(currentIndex);
}

// Open on click
tiles.forEach((img, idx) => {
    img.addEventListener("click", () => openLightbox(idx));
});

// Buttons
if (btnPrev) btnPrev.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); prev(); });
if (btnNext) btnNext.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); next(); });

if (btnClose) {
    btnClose.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeLightbox();
    });
}

// Close when clicking background (not image or buttons)
if (lightbox) {
    lightbox.addEventListener("click", (e) => {
        const clickedImage = (e.target === lbImg);
        const clickedButton = e.target.closest(".lb-close, .lb-prev, .lb-next");
        if (!clickedImage && !clickedButton) closeLightbox();
    });
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
});

// Swipe controls (mobile)
let startX = 0;
let startY = 0;

if (lightbox) {
    lightbox.addEventListener("touchstart", (e) => {
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
    }, { passive: true });

    lightbox.addEventListener("touchend", (e) => {
        if (!startX && !startY) return;

        const t = e.changedTouches[0];
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;

        // Horizontal swipe
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) prev();
            else next();
        }

        startX = 0;
        startY = 0;
    }, { passive: true });
}

// Site Footer
document.getElementById("year").textContent = new Date().getFullYear();

