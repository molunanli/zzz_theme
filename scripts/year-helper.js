// scripts/year-helper.js
hexo.extend.helper.register('getYearInfo', function() {
    const posts = this.site.posts
    const result = {
        startYear: null,
        endYear: null,
        span: 0,
        hasPosts: false
    };

    if (posts && posts.length > 0) {
        let minDate = null;
        let maxDate = null;
        // 关键修复：使用 .each 替代 forEach
        posts.each(post => {
            const date = post.date;
            if (!date) return;
            if (minDate === null || date < minDate) minDate = date;
            if (maxDate === null || date > maxDate) maxDate = date;
        });

        if (minDate && maxDate) {
            result.startYear = minDate.year();
            result.endYear = maxDate.year();
            result.span = result.endYear - result.startYear;
            result.hasPosts = true;
        }
    }
    return result;
});

hexo.extend.helper.register('getSinceYear', function() {
    const posts = this.site.posts;
    if (posts && posts.length > 0) {
        let minDate = null;
        posts.each(post => {
            const date = post.date;
            if (!date) return;
            if (minDate === null || date < minDate) minDate = date;
        });
        if (minDate) return minDate.year();
    }
    return new Date().getFullYear();
});