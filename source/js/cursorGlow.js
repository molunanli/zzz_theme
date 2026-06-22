const cursorGlow = document.getElementById('cursorGlow');
let glowTargetX = -500;
let glowTargetY = -500;
let glowCurrentX = -500;
let glowCurrentY = -500;
let isDesktop = window.innerWidth > 768;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (isDesktop) {
        glowTargetX = e.clientX;
        glowTargetY = e.clientY;
    }
});
document.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
    if (isDesktop) {
        glowTargetX = -500;
        glowTargetY = -500;
    }
});
window.addEventListener('resize', () => {
    isDesktop = window.innerWidth > 768;
    if (!isDesktop) {
        cursorGlow.style.opacity = '0';
    }
});

function animateGlow() {
    if (isDesktop) {
        glowCurrentX += (glowTargetX - glowCurrentX) * 0.08;
        glowCurrentY += (glowTargetY - glowCurrentY) * 0.08;
        cursorGlow.style.left = glowCurrentX + 'px';
        cursorGlow.style.top = glowCurrentY + 'px';
        const distFromCenter = Math.hypot(glowCurrentX - glowTargetX, glowCurrentY - glowTargetY);
        cursorGlow.style.opacity = distFromCenter > 300 ? '0.3' : '0.8';
    }
    requestAnimationFrame(animateGlow);
}
animateGlow();