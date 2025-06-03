// 详情页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数中的食谱ID
    const recipeId = Utils.getUrlParam('id');
    
    if (!recipeId) {
        Utils.showNotification('未找到食谱信息', 'error');
        return;
    }
    
    // 获取食谱详情
    const recipe = API.getRecipeById(recipeId);
    
    if (!recipe) {
        Utils.showNotification('未找到该食谱', 'error');
        return;
    }
    
    // 渲染食谱详情
    renderRecipeDetail(recipe);
    
    // 设置收藏按钮状态
    updateBookmarkButton(recipe.id);
    
    // 绑定事件
    bindEvents(recipe);
});

// 渲染食谱详情
function renderRecipeDetail(recipe) {
    // 设置标题
    document.title = recipe.name + ' - 食谱详情';
    
    // 设置头部信息
    const recipeHeader = document.querySelector('.recipe-header');
    if (recipeHeader) {
        recipeHeader.innerHTML = `
            <div class="recipe-title">
                <h1>${recipe.name}</h1>
                <div class="recipe-meta">
                    <span class="recipe-difficulty"><i class="fas fa-star"></i> ${recipe.difficulty || '★★★'}</span>
                    <span class="recipe-category"><i class="fas fa-tag"></i> ${recipe.category}</span>
                </div>
            </div>
            <div class="recipe-actions">
                <button id="bookmarkBtn" class="btn" data-id="${recipe.id}">
                    <i class="far fa-bookmark"></i> 收藏
                </button>
                <button id="cookingModeBtn" class="btn primary">
                    <i class="fas fa-utensils"></i> 进入做菜模式
                </button>
            </div>
        `;
    }
    
    // 设置食谱图片
    const recipeImage = document.querySelector('.recipe-image');
    if (recipeImage) {
        recipeImage.style.backgroundImage = `url('images/${recipe.image || 'placeholder.jpg'}')`;
    }
    
    // 设置食谱描述
    const recipeDescription = document.querySelector('.recipe-description');
    if (recipeDescription) {
        recipeDescription.innerHTML = `<p>${recipe.description.replace(/\n/g, '<br>')}</p>`;
    }
    
    // 分类食材
    const mainIngredients = [];
    const seasonings = [];
    
    recipe.ingredients.forEach(ing => {
        // 简单判断是否为调味料
        if (ing.name.includes('盐') || ing.name.includes('糖') || ing.name.includes('酱') || 
            ing.name.includes('醋') || ing.name.includes('油') || ing.name.includes('料酒') || 
            ing.name.includes('鸡精') || ing.name.includes('味精') || ing.name.includes('香料') || 
            ing.name.includes('粉') || ing.name.includes('酒')) {
            seasonings.push(ing);
        } else {
            mainIngredients.push(ing);
        }
    });
    
    // 设置食材列表
    const ingredientsList = document.querySelector('.ingredients-list');
    if (ingredientsList) {
        let mainIngredientsHtml = '';
        let seasoningsHtml = '';
        
        mainIngredients.forEach(ing => {
            mainIngredientsHtml += `<li>${ing.text_quantity}</li>`;
        });
        
        seasonings.forEach(ing => {
            seasoningsHtml += `<li>${ing.text_quantity}</li>`;
        });
        
        ingredientsList.innerHTML = `
            <div class="ingredients-section">
                <h3>主料</h3>
                <ul>${mainIngredientsHtml}</ul>
            </div>
            <div class="ingredients-section">
                <h3>调味料</h3>
                <ul>${seasoningsHtml}</ul>
            </div>
        `;
    }
    
    // 设置步骤列表
    const stepsList = document.querySelector('.steps-list');
    if (stepsList && recipe.steps) {
        let stepsHtml = '';
        
        recipe.steps.forEach((step, index) => {
            stepsHtml += `
                <div class="step-item" data-step="${index + 1}">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-content">
                        <h4>${step.instruction}</h4>
                        <p class="step-detail">${step.detail || ''}</p>
                    </div>
                    <button class="read-step-btn" data-text="${step.instruction}. ${step.detail || ''}">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
            `;
        });
        
        stepsList.innerHTML = stepsHtml;
    }
    
    // 设置备注
    const recipeNotes = document.querySelector('.recipe-notes');
    if (recipeNotes && recipe.notes) {
        recipeNotes.innerHTML = `<p>${recipe.notes.replace(/\n/g, '<br>')}</p>`;
    } else if (recipeNotes) {
        recipeNotes.style.display = 'none';
    }
}

// 更新收藏按钮状态
function updateBookmarkButton(recipeId) {
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    if (bookmarkBtn) {
        const isBookmarked = Bookmarks.isBookmarked(recipeId);
        const icon = bookmarkBtn.querySelector('i');
        
        if (isBookmarked) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            bookmarkBtn.innerHTML = `<i class="fas fa-bookmark"></i> 已收藏`;
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            bookmarkBtn.innerHTML = `<i class="far fa-bookmark"></i> 收藏`;
        }
    }
}

// 绑定事件
function bindEvents(recipe) {
    // 收藏按钮
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', function() {
            const recipeId = this.dataset.id;
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                // 添加收藏
                Bookmarks.add(recipeId);
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.innerHTML = `<i class="fas fa-bookmark"></i> 已收藏`;
                Utils.showNotification('已添加到收藏', 'success');
            } else {
                // 取消收藏
                Bookmarks.remove(recipeId);
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.innerHTML = `<i class="far fa-bookmark"></i> 收藏`;
                Utils.showNotification('已从收藏中移除', 'info');
            }
        });
    }
    
    // 进入做菜模式按钮
    const cookingModeBtn = document.getElementById('cookingModeBtn');
    if (cookingModeBtn) {
        cookingModeBtn.addEventListener('click', function() {
            window.location.href = `cooking-mode.html?id=${recipe.id}`;
        });
    }
    
    // 步骤朗读按钮
    const readStepBtns = document.querySelectorAll('.read-step-btn');
    readStepBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.dataset.text;
            SpeechHelper.stop(); // 停止之前的朗读
            SpeechHelper.speak(text);
        });
    });
    
    // 朗读全部按钮
    const readAllBtn = document.querySelector('.read-all-btn');
    if (readAllBtn) {
        readAllBtn.addEventListener('click', function() {
            SpeechHelper.stop(); // 停止之前的朗读
            
            // 构建完整的朗读文本
            let fullText = `${recipe.name}. `;
            
            // 添加食材
            fullText += '食材准备: ';
            recipe.ingredients.forEach(ing => {
                fullText += `${ing.text_quantity}. `;
            });
            
            // 添加步骤
            fullText += '烹饪步骤: ';
            recipe.steps.forEach((step, index) => {
                fullText += `第${index + 1}步, ${step.instruction}. ${step.detail || ''}. `;
            });
            
            // 添加备注
            if (recipe.notes) {
                fullText += `备注: ${recipe.notes}`;
            }
            
            SpeechHelper.speak(fullText);
        });
    }
}