// 收藏页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 加载收藏的食谱
    loadBookmarks();
    
    // 绑定搜索事件
    bindSearchEvent();
    
    // 检查在线状态
    checkOnlineStatus();
});

// 加载收藏的食谱
function loadBookmarks() {
    const bookmarkIds = Bookmarks.getAll();
    const bookmarksContainer = document.querySelector('.bookmarks-container');
    const emptyBookmarks = document.querySelector('.empty-bookmarks');
    
    if (!bookmarksContainer) return;
    
    // 清空容器
    bookmarksContainer.innerHTML = '';
    
    // 如果没有收藏，显示空状态
    if (!bookmarkIds || bookmarkIds.length === 0) {
        if (emptyBookmarks) {
            emptyBookmarks.style.display = 'flex';
        }
        return;
    }
    
    // 隐藏空状态
    if (emptyBookmarks) {
        emptyBookmarks.style.display = 'none';
    }
    
    // 获取所有食谱
    const allRecipes = API.getAllRecipes();
    
    // 过滤出收藏的食谱
    const bookmarkedRecipes = allRecipes.filter(recipe => bookmarkIds.includes(recipe.id));
    
    // 渲染收藏的食谱
    bookmarkedRecipes.forEach(recipe => {
        const recipeCard = createBookmarkCard(recipe);
        bookmarksContainer.appendChild(recipeCard);
    });
}

// 创建收藏卡片
function createBookmarkCard(recipe) {
    const card = document.createElement('div');
    card.className = 'bookmark-card';
    card.dataset.id = recipe.id;
    
    card.innerHTML = `
        <div class="bookmark-image" style="background-image: url('images/${recipe.image || 'placeholder.jpg'}');">
            <div class="bookmark-tag">${recipe.category}</div>
        </div>
        <div class="bookmark-info">
            <h3>${recipe.name}</h3>
            <p>${recipe.description.split('\n')[0]}</p>
            <div class="bookmark-meta">
                <div class="bookmark-difficulty">
                    <i class="fas fa-star"></i> ${recipe.difficulty || '★★★'}
                </div>
            </div>
            <div class="bookmark-actions">
                <button class="view-recipe-btn">
                    <i class="fas fa-eye"></i> 查看详情
                </button>
                <button class="remove-bookmark-btn" data-id="${recipe.id}">
                    <i class="fas fa-trash"></i> 移除收藏
                </button>
            </div>
        </div>
    `;
    
    // 绑定查看详情按钮事件
    card.querySelector('.view-recipe-btn').addEventListener('click', function() {
        window.location.href = `recipe-detail.html?id=${recipe.id}`;
    });
    
    // 绑定移除收藏按钮事件
    card.querySelector('.remove-bookmark-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        const recipeId = this.dataset.id;
        Bookmarks.remove(recipeId);
        card.classList.add('removing');
        
        // 动画结束后移除元素
        setTimeout(() => {
            card.remove();
            
            // 检查是否还有收藏
            const bookmarkIds = Bookmarks.getAll();
            if (!bookmarkIds || bookmarkIds.length === 0) {
                const emptyBookmarks = document.querySelector('.empty-bookmarks');
                if (emptyBookmarks) {
                    emptyBookmarks.style.display = 'flex';
                }
            }
        }, 300);
        
        Utils.showNotification('已从收藏中移除', 'info');
    });
    
    return card;
}

// 绑定搜索事件
function bindSearchEvent() {
    const searchInput = document.querySelector('.bookmark-search input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        filterBookmarks(query);
    });
}

// 过滤收藏
function filterBookmarks(query) {
    const bookmarkCards = document.querySelectorAll('.bookmark-card');
    let hasVisibleCards = false;
    
    bookmarkCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const category = card.querySelector('.bookmark-tag').textContent.toLowerCase();
        
        if (title.includes(query) || description.includes(query) || category.includes(query)) {
            card.style.display = 'flex';
            hasVisibleCards = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    // 显示或隐藏无结果提示
    const noResults = document.querySelector('.no-search-results');
    const emptyBookmarks = document.querySelector('.empty-bookmarks');
    
    if (noResults) {
        if (!hasVisibleCards && query && bookmarkCards.length > 0) {
            noResults.style.display = 'flex';
            if (emptyBookmarks) emptyBookmarks.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            
            // 如果没有收藏，显示空状态
            if (bookmarkCards.length === 0 && emptyBookmarks) {
                emptyBookmarks.style.display = 'flex';
            }
        }
    }
}

// 检查在线状态
function checkOnlineStatus() {
    const offlineNotice = document.querySelector('.offline-notice');
    if (!offlineNotice) return;
    
    if (Utils.isOnline()) {
        offlineNotice.style.display = 'none';
    } else {
        offlineNotice.style.display = 'flex';
    }
    
    // 监听在线状态变化
    window.addEventListener('online', function() {
        offlineNotice.style.display = 'none';
    });
    
    window.addEventListener('offline', function() {
        offlineNotice.style.display = 'flex';
    });
}