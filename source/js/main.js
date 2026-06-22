(function () {
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

    const origThemeToggle = document.getElementById('themeToggleFloat');
    if (origThemeToggle) {
        origThemeToggle.addEventListener('click', () => {
            setTimeout(() => {
                const colors = getParticleColors();
                particles.forEach((p, i) => {
                    p.color = colors[i % colors.length];
                });
            }, 50);
        });
    }

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

    const themeToggleFloat = document.getElementById('themeToggleFloat');
    const themeIcon = themeToggleFloat.querySelector('i');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.className = 'fas fa-sun';
    } else {
        document.body.classList.remove('light-theme');
        themeIcon.className = 'fas fa-moon';
    }
    themeToggleFloat.addEventListener('click', () => {
        if (document.body.classList.contains('light-theme')) {
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
            themeIcon.className = 'fas fa-moon';
        } else {
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.className = 'fas fa-sun';
        }
        const colors = getParticleColors();
        particles.forEach((p, i) => {
            p.color = colors[i % colors.length];
        });
    });

    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const menuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    let bodyOverflow = '';

    function toggleMenu(forceState) {
        const isActive = navMenu.classList.contains('active');
        let shouldOpen;
        if (forceState === true) shouldOpen = true;
        else if (forceState === false) shouldOpen = false;
        else shouldOpen = !isActive;
        if (shouldOpen === isActive) return;
        if (shouldOpen) {
            navMenu.classList.add('active');
            bodyOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            const icon = menuBtn.querySelector('i');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            navMenu.classList.remove('active');
            document.body.style.overflow = bodyOverflow || '';
            const icon = menuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
        document.addEventListener('click', function (event) {
            const isInsideMenu = navMenu.contains(event.target);
            const isToggle = menuBtn.contains(event.target);
            if (!isInsideMenu && !isToggle && navMenu.classList.contains('active') && window
                .innerWidth <= 768) {
                toggleMenu(false);
            }
        });
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                    toggleMenu(false);
                }
            });
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    const loadBtn = document.getElementById('loadMoreBtn');
    const postGrid = document.getElementById('postGrid');
    let loadCount = 0;
    const moreArticles = [
        {
            imgId: '42', tag: '潮流企划', date: '2025.06.12', category: '风格解析',
            title: '街头侵蚀 · 绝区零视觉符号考据', desc: '从涂鸦到机能风，深入分析绝区零角色设计中的亚文化元素与叛逆基因。'
        },
        {
            imgId: '76', tag: '音乐电台', date: '2025.06.08', category: '音律空洞',
            title: '混沌节拍｜合成器浪潮与原声带', desc: '专访音乐团队，揭露都市黑暗与潮流重击下的电子配乐魅力。'
        },
        {
            imgId: '29', tag: '同人创作', date: '2025.06.01', category: '二创特区',
            title: '玩家美术集: 新艾利都想象重构', desc: '全球创作者笔下的绝区零视觉盛宴，个性与空洞融合。'
        },
    ];
    if (loadBtn) {
        loadBtn.addEventListener('click', function () {
            if (loadCount >= moreArticles.length) {
                loadBtn.disabled = true;
                loadBtn.textContent = '已无更多信号 ⌛';
                loadBtn.style.opacity = '0.6';
                return;
            }
            const article = moreArticles[loadCount];
            const newCard = document.createElement('article');
            newCard.className = 'post-card';
            newCard.style.animation = 'fadeInUp 0.4s ease';
            newCard.innerHTML = `
                        <div class="card-img">
                            <img src="https://picsum.photos/id/${article.imgId}/400/240" alt="空洞探索" loading="lazy">
                            <div class="card-tag">${article.tag}</div>
                        </div>
                        <div class="card-content">
                            <div class="card-meta">
                                <span><i class="far fa-calendar-alt"></i> ${article.date}</span>
                                <span><i class="fas fa-tag"></i> ${article.category}</span>
                            </div>
                            <h3><a href="#">${article.title}</a></h3>
                            <p>${article.desc}</p>
                            <a href="#" class="read-more">深入空洞 <i class="fas fa-arrow-right"></i></a>
                        </div>
                    `;
            postGrid.appendChild(newCard);
            loadCount++;
            newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
})();