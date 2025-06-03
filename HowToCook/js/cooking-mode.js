// 做菜模式脚本
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
    
    // 初始化做菜模式
    initCookingMode(recipe);
});

// 初始化做菜模式
function initCookingMode(recipe) {
    // 全局变量
    let currentStep = 0;
    let totalSteps = recipe.steps.length;
    let autoPlayEnabled = false;
    let autoPlayTimer = null;
    
    // 更新页面标题
    document.title = `做菜模式 - ${recipe.name}`;
    
    // 更新食谱标题
    const recipeTitle = document.querySelector('.recipe-title');
    if (recipeTitle) {
        recipeTitle.textContent = recipe.name;
    }
    
    // 显示第一步
    showStep(0);
    
    // 绑定事件
    bindEvents();
    
    // 显示指定步骤
    function showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= totalSteps) return;
        
        currentStep = stepIndex;
        const step = recipe.steps[stepIndex];
        
        // 更新步骤内容
        const stepContent = document.querySelector('.step-content');
        if (stepContent) {
            stepContent.innerHTML = `
                <h2>${step.instruction}</h2>
                <p>${step.detail || ''}</p>
            `;
        }
        
        // 更新步骤计数
        const stepCounter = document.querySelector('.step-counter');
        if (stepCounter) {
            stepCounter.textContent = `${currentStep + 1} / ${totalSteps}`;
        }
        
        // 更新导航按钮状态
        const prevBtn = document.querySelector('.prev-step');
        const nextBtn = document.querySelector('.next-step');
        
        if (prevBtn) {
            prevBtn.disabled = currentStep === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentStep === totalSteps - 1;
        }
        
        // 自动朗读当前步骤
        const stepText = `${step.instruction}. ${step.detail || ''}`;
        SpeechHelper.stop();
        SpeechHelper.speak(stepText);
    }
    
    // 绑定事件
    function bindEvents() {
        // 上一步按钮
        const prevBtn = document.querySelector('.prev-step');
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (currentStep > 0) {
                    showStep(currentStep - 1);
                }
            });
        }
        
        // 下一步按钮
        const nextBtn = document.querySelector('.next-step');
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                if (currentStep < totalSteps - 1) {
                    showStep(currentStep + 1);
                }
            });
        }
        
        // 退出按钮
        const exitBtn = document.querySelector('.exit-cooking-mode');
        if (exitBtn) {
            exitBtn.addEventListener('click', function() {
                // 停止自动播放和语音
                stopAutoPlay();
                SpeechHelper.stop();
                
                // 返回详情页
                window.location.href = `recipe-detail.html?id=${recipe.id}`;
            });
        }
        
        // 朗读按钮
        const readBtn = document.querySelector('.read-step');
        if (readBtn) {
            readBtn.addEventListener('click', function() {
                const step = recipe.steps[currentStep];
                const stepText = `${step.instruction}. ${step.detail || ''}`;
                SpeechHelper.stop();
                SpeechHelper.speak(stepText);
            });
        }
        
        // 自动播放按钮
        const autoPlayBtn = document.querySelector('.auto-play');
        if (autoPlayBtn) {
            autoPlayBtn.addEventListener('click', function() {
                if (autoPlayEnabled) {
                    stopAutoPlay();
                    autoPlayBtn.innerHTML = '<i class="fas fa-play"></i> 自动播放';
                    autoPlayBtn.classList.remove('active');
                } else {
                    startAutoPlay();
                    autoPlayBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停播放';
                    autoPlayBtn.classList.add('active');
                }
            });
        }
        
        // 键盘快捷键
        document.addEventListener('keydown', function(e) {
            switch(e.key) {
                case 'ArrowLeft':
                    // 左箭头 - 上一步
                    if (currentStep > 0) {
                        showStep(currentStep - 1);
                    }
                    break;
                case 'ArrowRight':
                    // 右箭头 - 下一步
                    if (currentStep < totalSteps - 1) {
                        showStep(currentStep + 1);
                    }
                    break;
                case ' ':
                    // 空格 - 朗读当前步骤
                    e.preventDefault();
                    const step = recipe.steps[currentStep];
                    const stepText = `${step.instruction}. ${step.detail || ''}`;
                    SpeechHelper.stop();
                    SpeechHelper.speak(stepText);
                    break;
                case 'Escape':
                    // ESC - 退出做菜模式
                    stopAutoPlay();
                    SpeechHelper.stop();
                    window.location.href = `recipe-detail.html?id=${recipe.id}`;
                    break;
            }
        });
        
        // 语音合成结束事件
        if ('speechSynthesis' in window) {
            speechSynthesis.onend = function(event) {
                // 如果自动播放已启用且不是最后一步，则自动进入下一步
                if (autoPlayEnabled && currentStep < totalSteps - 1) {
                    setTimeout(() => {
                        showStep(currentStep + 1);
                    }, 1500); // 延迟1.5秒后进入下一步
                }
            };
        }
    }
    
    // 启动自动播放
    function startAutoPlay() {
        autoPlayEnabled = true;
        
        // 如果当前是最后一步，则从头开始
        if (currentStep === totalSteps - 1) {
            showStep(0);
        } else {
            // 朗读当前步骤
            const step = recipe.steps[currentStep];
            const stepText = `${step.instruction}. ${step.detail || ''}`;
            SpeechHelper.stop();
            SpeechHelper.speak(stepText);
        }
    }
    
    // 停止自动播放
    function stopAutoPlay() {
        autoPlayEnabled = false;
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
            autoPlayTimer = null;
        }
    }
}