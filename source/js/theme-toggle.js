// 主题切换与存储
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