// 全屏动态粒子背景画布
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;
let mouseX = -1000;
let mouseY = -1000;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

function getParticleColors() {
    const isLight = document.body.classList.contains('light-theme');
    return isLight ? [
        'rgba(212,25,62,0.4)',
        'rgba(11,110,122,0.38)',
        'rgba(155,26,176,0.28)',
        'rgba(194,85,40,0.22)',
    ] : [
        'rgba(255,42,126,0.6)',
        'rgba(0,242,255,0.55)',
        'rgba(177,0,232,0.45)',
        'rgba(255,107,53,0.35)',
    ];
}

function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 100);
    particles = [];
    const colors = getParticleColors();
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.8,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4 - 0.15,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: Math.random() * 0.7 + 0.3,
            pulseSpeed: Math.random() * 0.02 + 0.005,
            pulseOffset: Math.random() * Math.PI * 2,
        });
    }
}

function drawParticles(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const colors = getParticleColors();
    particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
        p.color = colors[i % colors.length];
        const pulse = Math.sin(timestamp * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7;
        const alpha = p.alpha * pulse;
        const distToMouse = Math.hypot(p.x - mouseX, p.y - mouseY);
        const mouseInfluence = Math.max(0, 1 - distToMouse / 180);
        const radius = p.radius + mouseInfluence * 2.5;
        const finalAlpha = alpha + mouseInfluence * 0.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, Math.min(finalAlpha, 1) + ')');
        ctx.fill();
        if (mouseInfluence > 0.05) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, radius * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(/[\d.]+\)$/, mouseInfluence * 0.18 + ')');
            ctx.fill();
        }
    });
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                const lineAlpha = (1 - dist / 100) * 0.12;
                const isLight = document.body.classList.contains('light-theme');
                const lineColor = isLight ? 'rgba(11,110,122,' : 'rgba(0,242,255,';
                ctx.strokeStyle = lineColor + lineAlpha + ')';
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    animationId = requestAnimationFrame(drawParticles);
}

initParticles();
animationId = requestAnimationFrame(drawParticles);