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