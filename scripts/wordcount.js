hexo.extend.helper.register('word_count', function (content) {
    // 去除 HTML 标签
    const text = content.replace(/<[^>]*>/g, '');
    // 统计中文字符 + 英文单词数量
    const chinese = text.match(/[\u4e00-\u9fa5]/g) || [];
    const english = text.match(/\b[a-zA-Z0-9]+\b/g) || [];
    return chinese.length + english.length;
});

// 统计所有文章的总字数（原始数字）
hexo.extend.helper.register('total_words', function () {
    let total = 0;
    const posts = this.site.posts.toArray();
    posts.forEach(post => {
        if (post.content) {
            // 调用已有的 word_count 辅助函数
            total += this.word_count(post.content);
        }
    });
    return total;
});

// 格式化输出（如 3.2w, 1.5k 等）
hexo.extend.helper.register('total_words_formatted', function () {
    const total = this.total_words();
    if (total >= 10000) {
        return (total / 10000).toFixed(1) + 'w';
    } else if (total >= 1000) {
        return (total / 1000).toFixed(1) + 'k';
    } else {
        return total.toString();
    }
});

hexo.extend.helper.register('read_time', function (content, speed = 300) {
    const count = this.word_count(content);
    return Math.max(1, Math.ceil(count / speed)); // 至少显示 1 分钟
});