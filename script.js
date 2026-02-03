const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const card = document.getElementById("card");
const result = document.getElementById("result");
const heartsContainer = document.getElementById("hearts-container");

// Create floating hearts
function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = "❤️";
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDelay = Math.random() * 5 + "s";
    heart.style.animationDuration = (Math.random() * 3 + 5) + "s";
    heartsContainer.appendChild(heart);

    // Remove heart after animation
    setTimeout(() => {
        heart.remove();
    }, 8000);
}

// Generate hearts periodically
setInterval(createHeart, 800);

// Initial hearts
for (let i = 0; i < 10; i++) {
    setTimeout(createHeart, i * 200);
}

// Move "No" button on hover
noBtn.addEventListener("mouseenter", () => {
    const x = Math.random() * 300 - 150;
    const y = Math.random() * 300 - 150;

    noBtn.style.transform = `translate(${x}px, ${y}px)`;
});

// Create explosion particles
function createExplosion(x, y) {
    const particleContainer = document.getElementById('particle-container');
    const emojis = ['💖', '❤️', '💕', '💗', '💓', '💝', '💘', '💞', '✨', '⭐', '🌟', '💫'];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        // Random direction
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 200 + Math.random() * 300;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        particleContainer.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => particle.remove(), 2000);
    }
}

// Screen shake effect
function shakeScreen() {
    document.body.classList.add('shake');
    setTimeout(() => {
        document.body.classList.remove('shake');
    }, 500);
}

// Background flash effect
function flashBackground() {
    document.body.classList.add('color-flash');
    setTimeout(() => {
        document.body.classList.remove('color-flash');
    }, 1000);
}

// On Yes click - UNIQUE CELEBRATION
yesBtn.addEventListener("click", () => {
    // 1. Scale burst the card
    card.classList.add('scale-burst');

    // 2. Screen shake
    shakeScreen();

    // 3. Background flash
    flashBackground();

    // 4. Get button position for explosion center
    const rect = yesBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 5. Create particle explosion
    createExplosion(centerX, centerY);

    // 6. Additional explosions at random positions
    setTimeout(() => {
        createExplosion(window.innerWidth * 0.2, window.innerHeight * 0.3);
    }, 150);

    setTimeout(() => {
        createExplosion(window.innerWidth * 0.8, window.innerHeight * 0.3);
    }, 300);

    setTimeout(() => {
        createExplosion(window.innerWidth * 0.5, window.innerHeight * 0.7);
    }, 450);

    // 7. Zoom out card and show result
    setTimeout(() => {
        card.style.animation = "zoomIn 0.4s reverse";
        setTimeout(() => {
            card.classList.add("hidden");
            result.classList.remove("hidden");
        }, 400);
    }, 600);
});
