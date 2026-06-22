// scripts/category-helper.js

/**
 * 按分类获取文章列表，若分类不存在则返回全部文章（可配置）
 * @param {string} categoryName - 分类名称（如 'JavaScript'）
 * @param {number} limit - 返回的文章数量上限（可选，默认全部）
 * @param {string} sort - 排序方式，'asc' 或 'desc'（默认 'desc'）
 * @param {boolean} fallbackAll - 分类不存在时是否返回全部文章，默认 true
 * @returns {Array} 文章数组
 */
hexo.extend.helper.register('getPostsByCategory', function(categoryName, limit, sort = 'desc', fallbackAll = true) {
    // 获取所有分类
    const categories = this.site.categories;
    // 查找名称匹配的分类（注意大小写）
    const category = categories.find(cat => cat.name === categoryName);
    
    let posts;
    if (category) {
        // 分类存在：获取该分类下的文章
        posts = category.posts.sort('date', sort === 'asc' ? 1 : -1);
    } else {
        // 分类不存在：根据 fallbackAll 决定返回全部文章还是空数组
        if (fallbackAll) {
            posts = this.site.posts.sort('date', sort === 'asc' ? 1 : -1);
        } else {
            return [];
        }
    }
    
    if (limit && typeof limit === 'number' && limit > 0) {
        posts = posts.limit(limit);
    }
    return posts.toArray();
});

// 可选：按 slug 查找版本（同样支持 fallbackAll）
hexo.extend.helper.register('getPostsByCategorySlug', function(slug, limit, sort = 'desc', fallbackAll = true) {
    const categories = this.site.categories;
    const category = categories.find(cat => cat.slug === slug);
    let posts;
    if (category) {
        posts = category.posts.sort('date', sort === 'asc' ? 1 : -1);
    } else {
        if (fallbackAll) {
            posts = this.site.posts.sort('date', sort === 'asc' ? 1 : -1);
        } else {
            return [];
        }
    }
    if (limit) posts = posts.limit(limit);
    return posts.toArray();
});

// getPostsGroupedByYear 按年份分组遍历文章
hexo.extend.helper.register('getPostsGroupedByYear', function(options = {}) {
    // 可配置参数：排序、数量限制、分类过滤等
    const { sort = 'desc', limit = null, category = null } = options;
    
    let posts = this.site.posts;
    // 如果指定了分类，先筛选
    if (category) {
        const cat = this.site.categories.find(c => c.name === category);
        if (cat) posts = cat.posts;
        // 如果分类不存在，且不返回任何文章？默认返回空数组
        else return {};
    }
    
    // 排序
    posts = posts.sort('date', sort === 'asc' ? 1 : -1);
    if (limit) posts = posts.limit(limit);
    
    const postsArray = posts.toArray();
    const yearMap = {};
    postsArray.forEach(post => {
        const year = post.date.year();
        if (!yearMap[year]) yearMap[year] = [];
        yearMap[year].push(post);
    });
    
    // 返回按年份降序排列的对象（键为年份，值为文章数组）
    return yearMap;
});