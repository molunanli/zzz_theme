
(function () {
    // 1. 把 getElementById 改为 querySelector，用类名获取容器
    const tocList = document.querySelector('.toc-list');

    // 如果容器不存在，直接终止，避免后续报错
    if (!tocList) return;

    const tocLinks = tocList.querySelectorAll('a');

    // 2. 构建 headings 时，对 href 进行 URL 解码
    const headings = [];
    tocLinks.forEach(l => {
        // 关键修复：decodeURIComponent 将 %E4%B8... 转回中文 "一、..."
        const rawId = decodeURIComponent(l.getAttribute('href').slice(1));
        const el = document.getElementById(rawId);
        if (el) headings.push({ el, l });
    });

    let manualLock = false, lockTimer;
    function setManualLock() { manualLock = true; clearTimeout(lockTimer); lockTimer = setTimeout(() => manualLock = false, 1200); }

    window.addEventListener('scroll', () => {
        // 1. 高亮当前可见标题对应的链接
        let cur = '';
        headings.forEach(({ el, l }) => {
            if (el.getBoundingClientRect().top <= 140) {
                cur = '#' + encodeURIComponent(el.id);
            }
        });
        tocLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === cur);
        });

        // 2. 自动展开对应的父级（仅当用户未手动锁定）
        if (!manualLock) {
            // 获取所有带 id 的 h2（可根据需要扩展为 h2, h3 等）
            const h2s = document.querySelectorAll('h2[id]');
            let visibleH2 = null;
            h2s.forEach(h2 => {
                if (h2.getBoundingClientRect().top <= 150) {
                    visibleH2 = h2;
                }
            });

            // 获取所有包含子列表的顶级项（新结构：.toc-item 内有 .toc-child / .toc-sublist）
            const items = document.querySelectorAll('.toc-list .toc-item');
            const parentItems = Array.from(items).filter(item =>
                item.querySelector('.toc-child, .toc-sublist') // 判断是否有子列表
            );

            if (visibleH2) {
                const encodedHref = '#' + encodeURIComponent(visibleH2.id);
                parentItems.forEach(item => {
                    // 找到该 item 内的链接
                    const link = item.querySelector('.toc-link');
                    // 如果链接的 href 匹配当前可见的 h2，则展开，否则折叠
                    if (link && link.getAttribute('href') === encodedHref) {
                        item.classList.remove('collapsed');
                    } else {
                        item.classList.add('collapsed');
                    }
                });
            } else {
                // 没有可见 h2 时全部折叠
                parentItems.forEach(item => item.classList.add('collapsed'));
            }
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        const tocList = document.querySelector('.toc-list');
        if (!tocList) return;

        // 为所有包含子列表的父级添加 'has-children' 类（兼容旧JS中的选择器）
        tocList.querySelectorAll('.toc-item:has(.toc-sublist)').forEach(item => {
            item.classList.add('has-children');
        });

        // 点击任何 .toc-link 处理折叠
        tocList.addEventListener('click', function (e) {
            const link = e.target.closest('.toc-link');
            if (!link) return;
            const item = link.closest('.toc-item.has-children');
            if (!item) return;

            e.preventDefault(); // 阻止锚点跳转（可选，如果你希望跳转就注释掉）

            const wasCollapsed = item.classList.contains('collapsed');
            // 折叠其他所有可折叠项
            tocList.querySelectorAll('.toc-item.has-children').forEach(it => {
                if (it !== item) it.classList.add('collapsed');
            });
            // 切换当前项
            item.classList.toggle('collapsed', !wasCollapsed);
        });

        // 如果你确实想要保留按钮（可选），可以动态插入按钮，并绑定事件
        // 但强烈建议直接用点击链接的方式，更简洁。
    });

    tocList.querySelectorAll('.toc-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            const item = btn.closest('.toc-item');
            const isCollapsed = item.classList.contains('collapsed');
            tocList.querySelectorAll('.toc-item.has-children').forEach(it => { if (it !== item) it.classList.add('collapsed'); });
            item.classList.toggle('collapsed', !isCollapsed);
            setManualLock();
        });
    });

    function convertHighlightBlocks() {
        const figures = document.querySelectorAll('.article-body figure.highlight');
        let index = 0;
        figures.forEach((figure) => {
            const langClass = figure.className.match(/highlight\s+(\w+)/);
            const lang = langClass ? langClass[1] : 'plaintext';
            const gutterLines = figure.querySelectorAll('.gutter .line');
            const lineCount = gutterLines.length || 0;


            let filename = '';
            const caption = figure.querySelector('figcaption');
            if (caption) {
                // 获取纯文本内容（去除内部 span 等）
                filename = caption.textContent.trim();
                // 隐藏原生的 figcaption（你也可以用 caption.style.display = 'none';）
                caption.style.display = 'none';
                // 或者完全移除：caption.remove();
            }

            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            wrapper.dataset.codeId = 'code-' + index;

            const header = document.createElement('div');
            header.className = 'code-header';
            const iconClass = lang === 'python' ? 'fa-python' : 'fa-code';
            // header.innerHTML = `<span class="code-lang-dot"></span><span class="code-lang-tag"><i class="fab ${iconClass}"></i> ${lang}</span><span class="code-filename">example.${lang === 'python' ? 'py' : 'txt'}</span><button class="code-copy-btn"><i class="far fa-copy"></i><span>复制</span></button>`;
            header.innerHTML = `
            <span class="code-lang-dot"></span>
            <span class="code-lang-tag"><i class="fab ${iconClass}"></i> ${lang}</span>
            <span class="code-filename">${filename}</span>
            <button class="code-copy-btn"><i class="far fa-copy"></i><span>复制</span></button>
        `;

            const codeBody = document.createElement('div');
            codeBody.className = 'code-body collapsed';
            codeBody.id = 'codeBody-code-' + index;

            const expandBar = document.createElement('div');
            expandBar.className = 'code-expand-bar';
            expandBar.id = 'expandBar-code-' + index;
            expandBar.innerHTML = `<button class="code-expand-btn" id="expandBtn-code-${index}"><span class="btn-text-expand">展开完整代码</span><span class="btn-text-collapse">收起代码</span><i class="fas fa-chevron-down"></i><span class="code-line-count" id="lineCount-code-${index}">${lineCount} 行</span></button>`;

            wrapper.appendChild(header);
            wrapper.appendChild(codeBody);
            wrapper.appendChild(expandBar);

            const parent = figure.parentNode;
            const next = figure.nextSibling;
            parent.removeChild(figure);
            codeBody.appendChild(figure);
            parent.insertBefore(wrapper, next);

            const FOLD = 16;
            const btn = wrapper.querySelector('.code-expand-btn');
            if (lineCount <= FOLD) {
                codeBody.classList.remove('collapsed');
                codeBody.classList.add('expanded');
                btn.style.display = 'none';
            } else {
                expandBar.classList.add('visible');
            }

            btn.addEventListener('click', () => {
                const isExp = codeBody.classList.contains('expanded');
                codeBody.classList.toggle('collapsed', isExp);
                codeBody.classList.toggle('expanded', !isExp);
                btn.classList.toggle('expanded', !isExp);
            });

            index++;
        });

        document.querySelectorAll('.code-copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const wrapper = btn.closest('.code-block-wrapper');
                const codePre = wrapper?.querySelector('td.code pre');
                let code = '';
                if (codePre) {
                    const clone = codePre.cloneNode(true);
                    clone.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
                    code = clone.textContent || '';
                }
                navigator.clipboard.writeText(code).then(() => {
                    btn.classList.add('copied');
                    const s = btn.querySelector('span');
                    if (s) s.textContent = '已复制';
                    setTimeout(() => { btn.classList.remove('copied'); if (s) s.textContent = '复制'; }, 2000);
                });
            });
        });
    }

    convertHighlightBlocks();
})();
