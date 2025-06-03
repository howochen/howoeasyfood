// 搜索页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数
    const query = Utils.getUrlParam('query');
    const category = Utils.getUrlParam('category');
    const ingredient = Utils.getUrlParam('ingredient');
    
    // 初始化搜索页面
    initSearchPage(query, category, ingredient);
    
    // 绑定搜索事件
    bindSearchEvents();
    
    // 加载常用食材
    loadCommonIngredients();
});

// 初始化搜索页面
function initSearchPage(query, category, ingredient) {
    // 设置搜索框值
    const searchInput = document.querySelector('.search-input');
    if (searchInput && query) {
        searchInput.value = query;
    }
    
    // 设置分类选中状态
    if (category) {
        const categoryBtn = document.querySelector(`.category-filter[data-category="${category}"]`);
        if (categoryBtn) {
            categoryBtn.classList.add('active');
        }
    }
    
    // 执行搜索
    if (query) {
        // 关键字搜索
        performSearch(query, category);
    } else if (category) {
        // 分类搜索
        performCategorySearch(category);
    } else if (ingredient) {
        // 食材搜索
        performIngredientSearch(ingredient);
    } else {
        // 默认显示所有食谱
        showAllRecipes();
    }
}

// 绑定搜索事件
function bindSearchEvents() {
    // 搜索表单提交
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = document.querySelector('.search-input').value.trim();
            const activeCategory = document.querySelector('.category-filter.active');
            const category = activeCategory ? activeCategory.dataset.category : null;
            
            performSearch(query, category);
            
            // 更新URL，但不刷新页面
            const url = new URL(window.location);
            url.searchParams.set('query', query);
            if (category) {
                url.searchParams.set('category', category);
            } else {
                url.searchParams.delete('category');
            }
            url.searchParams.delete('ingredient');
            window.history.pushState({}, '', url);
        });
    }
    
    // 实时搜索
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            const activeCategory = document.querySelector('.category-filter.active');
            const category = activeCategory ? activeCategory.dataset.category : null;
            
            performSearch(query, category);
        });
    }
    
    // 分类筛选
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除其他按钮的活动状态
            categoryFilters.forEach(b => b.classList.remove('active'));
            
            // 如果点击的是已经激活的按钮，则取消筛选
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                const query = document.querySelector('.search-input').value.trim();
                performSearch(query);
                
                // 更新URL
                const url = new URL(window.location);
                url.searchParams.delete('category');
                window.history.pushState({}, '', url);
            } else {
                // 激活当前按钮
                this.classList.add('active');
                const category = this.dataset.category;
                const query = document.querySelector('.search-input').value.trim();
                
                performSearch(query, category);
                
                // 更新URL
                const url = new URL(window.location);
                url.searchParams.set('category', category);
                window.history.pushState({}, '', url);
            }
        });
    });
    
    // 语音搜索
    const voiceSearchBtn = document.querySelector('.voice-search');
    if (voiceSearchBtn) {
        voiceSearchBtn.addEventListener('click', function() {
            if ('webkitSpeechRecognition' in window) {
                const recognition = new webkitSpeechRecognition();
                recognition.lang = 'zh-TW';
                recognition.start();
                
                Utils.showNotification('请开始说话...', 'info');
                
                recognition.onresult = function(event) {
                    const transcript = event.results[0][0].transcript;
                    searchInput.value = transcript;
                    
                    // 触发搜索
                    const activeCategory = document.querySelector('.category-filter.active');
                    const category = activeCategory ? activeCategory.dataset.category : null;
                    performSearch(transcript, category);
                    
                    Utils.showNotification('语音识别完成', 'success');
                };
                
                recognition.onerror = function(event) {
                    Utils.showNotification('语音识别失败，请重试', 'error');
                };
            } else {
                Utils.showNotification('您的浏览器不支持语音识别功能', 'error');
            }
        });
    }
    
    // 食材点击事件
    document.addEventListener('click', function(e) {
        if (e.target.closest('.ingredient-item')) {
            const ingredientItem = e.target.closest('.ingredient-item');
            const ingredient = ingredientItem.dataset.ingredient;
            
            // 更新UI
            document.querySelectorAll('.ingredient-item').forEach(item => {
                item.classList.remove('active');
            });
            ingredientItem.classList.add('active');
            
            // 执行食材搜索
            performIngredientSearch(ingredient);
            
            // 更新URL
            const url = new URL(window.location);
            url.searchParams.set('ingredient', ingredient);
            url.searchParams.delete('query');
            url.searchParams.delete('category');
            window.history.pushState({}, '', url);
            
            // 清空搜索框
            if (searchInput) {
                searchInput.value = '';
            }
            
            // 取消分类选中状态
            categoryFilters.forEach(btn => btn.classList.remove('active'));
        }
    });
}

// 执行搜索
function performSearch(query, category = null) {
    // 获取所有食谱
    let recipes = API.searchRecipes(query);
    
    // 如果指定了分类，进行过滤
    if (category) {
        recipes = recipes.filter(recipe => recipe.category === category);
    }
    
    // 显示搜索结果
    displaySearchResults(recipes, query);
}

// 执行分类搜索
function performCategorySearch(category) {
    // 获取指定分类的食谱
    const recipes = API.getRecipesByCategory(category);
    
    // 显示搜索结果
    displaySearchResults(recipes, null, category);
}

// 执行食材搜索
function performIngredientSearch(ingredient) {
    // 获取包含指定食材的食谱
    const recipes = API.searchByIngredient(ingredient);
    
    // 显示搜索结果
    displaySearchResults(recipes, null, null, ingredient);
}

// 显示所有食谱
function showAllRecipes() {
    // 获取所有食谱
    const recipes = API.getAllRecipes();
    
    // 显示搜索结果
    displaySearchResults(recipes);
}

// 显示搜索结果
function displaySearchResults(recipes, query = null, category = null, ingredient = null) {
    const resultsContainer = document.querySelector('.search-results');
    const noResults = document.querySelector('.no-results');
    
    if (!resultsContainer) return;
    
    // 清空结果容器
    resultsContainer.innerHTML = '';
    
    // 如果没有结果，显示无结果提示
    if (!recipes || recipes.length === 0) {
        if (noResults) {
            noResults.style.display = 'flex';
            
            // 更新无结果提示文本
            const noResultsText = noResults.querySelector('p');
            if (noResultsText) {
                if (query) {
                    noResultsText.textContent = `没有找到与"${query}"相关的食谱`;
                } else if (category) {
                    noResultsText.textContent = `没有找到${category}分类的食谱`;
                } else if (ingredient) {
                    noResultsText.textContent = `没有找到包含${ingredient}的食谱`;
                } else {
                    noResultsText.textContent = '没有找到任何食谱';
                }
            }
        }
        return;
    }
    
    // 隐藏无结果提示
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    // 更新结果计数
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        let countText = `找到 ${recipes.length} 个结果`;
        if (query) {
            countText += ` 关于"${query}"`;
        }
        if (category) {
            countText += ` 在${category}分类中`;
        }
        if (ingredient) {
            countText += ` 包含"${ingredient}"`;
        }
        resultsCount.textContent = countText;
    }
    
    // 渲染搜索结果
    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card';
        recipeCard.dataset.id = recipe.id;
        
        // 高亮搜索关键字
        let highlightedName = recipe.name;
        let highlightedDescription = recipe.description.split('\n')[0];
        
        if (query) {
            const regex = new RegExp(query, 'gi');
            highlightedName = highlightedName.replace(regex, match => `<mark>${match}</mark>`);
            highlightedDescription = highlightedDescription.replace(regex, match => `<mark>${match}</mark>`);
        }
        
        recipeCard.innerHTML = `
            <div class="recipe-image" style="background-image: url('images/${recipe.image || 'placeholder.jpg'}');">
                <div class="recipe-tag">${recipe.category}</div>
            </div>
            <div class="recipe-info">
                <h3>${highlightedName}</h3>
                <p>${highlightedDescription}</p>
                <div class="recipe-meta">
                    <div class="recipe-difficulty">
                        <i class="fas fa-star"></i> ${recipe.difficulty || '★★★'}
                    </div>
                </div>
                <div class="recipe-actions">
                    <button class="view-recipe-btn">
                        <i class="fas fa-eye"></i> 查看详情
                    </button>
                    <button class="bookmark-btn" data-id="${recipe.id}">
                        <i class="${Bookmarks.isBookmarked(recipe.id) ? 'fas' : 'far'} fa-bookmark"></i> 
                        ${Bookmarks.isBookmarked(recipe.id) ? '已收藏' : '收藏'}
                    </button>
                </div>
            </div>
        `;
        
        // 添加到结果容器
        resultsContainer.appendChild(recipeCard);
    });
}

// 加载常用食材
function loadCommonIngredients() {
    const ingredientsContainer = document.querySelector('.ingredients-list');
    if (!ingredientsContainer) return;
    
    // 获取所有食谱
    const recipes = API.getAllRecipes();
    
    // 提取所有食材
    const allIngredients = [];
    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => {
            allIngredients.push(ing.name);
        });
    });
    
    // 统计食材出现次数
    const ingredientCounts = {};
    allIngredients.forEach(ing => {
        ingredientCounts[ing] = (ingredientCounts[ing] || 0) + 1;
    });
    
    // 转换为数组并排序
    const sortedIngredients = Object.keys(ingredientCounts).sort((a, b) => {
        return ingredientCounts[b] - ingredientCounts[a];
    });
    
    // 取前20个常用食材
    const commonIngredients = sortedIngredients.slice(0, 20);
    
    // 渲染食材列表
    commonIngredients.forEach(ing => {
        const ingredientItem = document.createElement('div');
        ingredientItem.className = 'ingredient-item';
        ingredientItem.dataset.ingredient = ing;
        ingredientItem.textContent = ing;
        
        // 检查是否是当前选中的食材
        const currentIngredient = Utils.getUrlParam('ingredient');
        if (currentIngredient && currentIngredient === ing) {
            ingredientItem.classList.add('active');
        }
        
        ingredientsContainer.appendChild(ingredientItem);
    });
}