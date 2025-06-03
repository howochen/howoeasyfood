// 全局变量和配置
const API = {
    // 模拟API端点，实际项目中应替换为真实API
    getAllRecipes: function() {
        return JSON.parse(localStorage.getItem('allRecipes')) || [];
    },
    getRecipesByCategory: function(category) {
        const allRecipes = this.getAllRecipes();
        return allRecipes.filter(recipe => recipe.category === category);
    },
    getRecipeById: function(id) {
        const allRecipes = this.getAllRecipes();
        return allRecipes.find(recipe => recipe.id === id);
    },
    searchRecipes: function(query) {
        const allRecipes = this.getAllRecipes();
        if (!query) return allRecipes;
        
        query = query.toLowerCase();
        return allRecipes.filter(recipe => {
            return recipe.name.toLowerCase().includes(query) || 
                   recipe.description.toLowerCase().includes(query) ||
                   recipe.ingredients.some(ing => ing.name.toLowerCase().includes(query));
        });
    },
    searchByIngredient: function(ingredient) {
        const allRecipes = this.getAllRecipes();
        if (!ingredient) return allRecipes;
        
        ingredient = ingredient.toLowerCase();
        return allRecipes.filter(recipe => {
            return recipe.ingredients.some(ing => ing.name.toLowerCase().includes(ingredient));
        });
    },
    // 初始化示例数据
    initSampleData: function() {
        // 检查是否已经初始化
        if (localStorage.getItem('dataInitialized')) return;
        
        // 示例数据
        const sampleRecipes = [
            {
                id: "dishes-meat-可乐鸡翅",
                name: "可乐鸡翅的做法",
                description: "可乐鸡翅是一道以鸡翅和可乐为主要食材的菜品，口味甜咸适中，色泽红亮，肉质鲜嫩。初学者需要约 30 分钟完成。\n\n预估烹饪难度：★★★",
                category: "荤菜",
                ingredients: [
                    { name: "鸡翅中", text_quantity: "- 鸡翅中 500g" },
                    { name: "可乐", text_quantity: "- 可乐 200ml" },
                    { name: "姜片", text_quantity: "- 姜片 适量" },
                    { name: "料酒", text_quantity: "- 料酒 适量" },
                    { name: "生抽", text_quantity: "- 生抽 适量" },
                    { name: "老抽", text_quantity: "- 老抽 少许" },
                    { name: "盐", text_quantity: "- 盐 适量" },
                    { name: "白糖", text_quantity: "- 白糖 适量" },
                    { name: "植物油", text_quantity: "- 植物油 适量" }
                ],
                steps: [
                    { instruction: "鸡翅洗净，沥干水分", detail: "用厨房纸巾擦干表面水分，这样可以防止下锅时油溅出" },
                    { instruction: "锅中倒入适量油，烧至五成热", detail: "油温不要太高，避免鸡翅表面焦糊" },
                    { instruction: "放入鸡翅，煎至两面金黄", detail: "中小火慢煎，每面约3-4分钟，直到表面呈现金黄色" },
                    { instruction: "加入姜片爆香", detail: "姜片可以去除鸡肉的腥味，增加香气" },
                    { instruction: "倒入料酒、生抽、老抽", detail: "料酒去腥，生抽提鲜，老抽上色" },
                    { instruction: "加入可乐，没过鸡翅", detail: "可乐含有糖分和焦糖色，能使鸡翅呈现漂亮的红褐色" },
                    { instruction: "大火烧开后转小火慢炖", detail: "小火慢炖可以让鸡翅更入味，肉质更嫩" },
                    { instruction: "加入适量盐和白糖调味", detail: "根据个人口味添加，一般加入少量即可，因为可乐本身已有甜味" },
                    { instruction: "大火收汁", detail: "当汤汁剩余约三分之一时，转大火收汁，不断翻动鸡翅，使其均匀裹上浓稠的汁液" },
                    { instruction: "出锅装盘", detail: "将鸡翅和浓稠的汁液一起盛出，可以撒上少许葱花点缀" }
                ],
                notes: "1. 可乐最好选择普通可乐，不要使用无糖可乐\n2. 收汁时注意不要收得太干，保留少量汁液会更入味\n3. 如果喜欢口味更浓郁，可以在煮好后焖10分钟再食用",
                difficulty: "★★★",
                image: "cola-chicken-wings.jpg"
            },
            {
                id: "dishes-vegetable-西红柿炒鸡蛋",
                name: "西红柿炒鸡蛋的做法",
                description: "西红柿炒鸡蛋是一道家常菜，酸甜可口，色彩鲜艳，营养丰富。初学者只需要约15分钟即可完成。\n\n预估烹饪难度：★★",
                category: "素菜",
                ingredients: [
                    { name: "西红柿", text_quantity: "- 西红柿 2个" },
                    { name: "鸡蛋", text_quantity: "- 鸡蛋 3个" },
                    { name: "葱", text_quantity: "- 葱 适量" },
                    { name: "盐", text_quantity: "- 盐 适量" },
                    { name: "糖", text_quantity: "- 糖 少许" },
                    { name: "食用油", text_quantity: "- 食用油 适量" }
                ],
                steps: [
                    { instruction: "西红柿洗净，切成块状", detail: "切成大小适中的块，便于入味和烹饪" },
                    { instruction: "鸡蛋打散，加入少许盐搅拌均匀", detail: "加盐可以使蛋液更鲜美，搅拌均匀使蛋黄蛋白充分混合" },
                    { instruction: "热锅倒油，油热后倒入蛋液", detail: "油要足够热，这样炒出的鸡蛋才会蓬松" },
                    { instruction: "用铲子快速划散蛋液", detail: "不要过度搅拌，保持蛋块的形状" },
                    { instruction: "蛋液凝固后盛出备用", detail: "鸡蛋七八分熟即可盛出，避免过度煎炸导致口感发硬" },
                    { instruction: "锅中再加少许油，放入葱花爆香", detail: "葱花可以增加香气，提升菜品风味" },
                    { instruction: "倒入西红柿块，翻炒出汁", detail: "中火翻炒，让西红柿充分出汁，呈现半透明状态" },
                    { instruction: "加入适量盐和糖调味", detail: "糖可以中和西红柿的酸味，使口感更加平衡" },
                    { instruction: "倒入炒好的鸡蛋，翻炒均匀", detail: "快速翻炒，使鸡蛋和西红柿汁充分融合" },
                    { instruction: "出锅装盘", detail: "可以撒上少许葱花点缀，增加色彩和香气" }
                ],
                notes: "1. 西红柿最好选择成熟的，这样炒出来的菜会有自然的甜味\n2. 鸡蛋不要炒得太老，保持嫩滑的口感\n3. 可以根据个人口味调整盐和糖的用量",
                difficulty: "★★",
                image: "tomato-egg.jpg"
            },
            {
                id: "dishes-dessert-提拉米苏",
                name: "提拉米苏的做法",
                description: "提拉米苏是一道意大利经典甜点，口感绵密，咖啡和可可的香气浓郁。制作需要一定耐心，但步骤不复杂。\n\n预估烹饪难度：★★★★",
                category: "甜品",
                ingredients: [
                    { name: "马斯卡彭奶酪", text_quantity: "- 马斯卡彭奶酪 250g" },
                    { name: "手指饼干", text_quantity: "- 手指饼干 200g" },
                    { name: "咖啡", text_quantity: "- 咖啡 200ml" },
                    { name: "鸡蛋", text_quantity: "- 鸡蛋 3个" },
                    { name: "细砂糖", text_quantity: "- 细砂糖 60g" },
                    { name: "可可粉", text_quantity: "- 可可粉 适量" },
                    { name: "朗姆酒", text_quantity: "- 朗姆酒 15ml（可选）" }
                ],
                steps: [
                    { instruction: "将鸡蛋分离蛋黄和蛋白", detail: "分离时注意不要让蛋黄混入蛋白中，否则会影响打发效果" },
                    { instruction: "蛋黄中加入30g糖，打发至颜色变浅", detail: "打发至蛋黄体积增大，颜色变浅，质地变得浓稠" },
                    { instruction: "加入马斯卡彭奶酪，搅拌均匀", detail: "奶酪应提前从冰箱取出回温，这样更容易搅拌均匀" },
                    { instruction: "蛋白中加入30g糖，打发至硬性发泡", detail: "打发至提起打蛋器蛋白能形成直立的尖角" },
                    { instruction: "将打发的蛋白分次轻折入奶酪蛋黄糊中", detail: "用切拌的方式轻轻混合，保持蛋白的气泡" },
                    { instruction: "咖啡中加入朗姆酒（可选）", detail: "朗姆酒可以增加风味，不喜欢可以不加" },
                    { instruction: "手指饼干快速蘸咖啡液", detail: "蘸取时间不要太长，避免饼干过于湿软" },
                    { instruction: "在容器底部铺一层蘸过咖啡的饼干", detail: "饼干之间可以稍微重叠，确保底部被完全覆盖" },
                    { instruction: "铺一层奶酪糊在饼干上", detail: "奶酪糊要均匀铺满整个表面" },
                    { instruction: "重复饼干层和奶酪层，最上层为奶酪糊", detail: "通常做2-3层即可，最后一层必须是奶酪糊" },
                    { instruction: "冷藏至少4小时或过夜", detail: "冷藏可以让各层风味充分融合，口感更佳" },
                    { instruction: "食用前撒上可可粉", detail: "用筛子均匀撒上可可粉，增加风味和美观" }
                ],
                notes: "1. 马斯卡彭奶酪如果没有，可以用奶油奶酪+淡奶油混合代替\n2. 手指饼干蘸咖啡的时间要控制好，太久会导致饼干太软\n3. 冷藏时间越长，味道越好，但不要超过3天",
                difficulty: "★★★★",
                image: "tiramisu.jpg"
            },
            {
                id: "dishes-soup-紫菜蛋花汤",
                name: "紫菜蛋花汤的做法",
                description: "紫菜蛋花汤是一道简单易做的家常汤品，鲜美可口，营养丰富。初学者只需约10分钟即可完成。\n\n预估烹饪难度：★★",
                category: "汤羹",
                ingredients: [
                    { name: "紫菜", text_quantity: "- 紫菜 10g" },
                    { name: "鸡蛋", text_quantity: "- 鸡蛋 2个" },
                    { name: "葱花", text_quantity: "- 葱花 适量" },
                    { name: "盐", text_quantity: "- 盐 适量" },
                    { name: "鸡精", text_quantity: "- 鸡精 少许" },
                    { name: "香油", text_quantity: "- 香油 少许" },
                    { name: "胡椒粉", text_quantity: "- 胡椒粉 少许" }
                ],
                steps: [
                    { instruction: "紫菜用温水泡发", detail: "泡发约2-3分钟即可，不需要太久" },
                    { instruction: "鸡蛋打散，加入少许盐搅拌均匀", detail: "充分搅拌使蛋液更均匀，加盐可以使蛋花更嫩" },
                    { instruction: "锅中加入适量清水煮沸", detail: "水量根据需要的汤量决定，一般为每人200-300ml" },
                    { instruction: "水沸后加入泡发的紫菜", detail: "紫菜下锅后会继续膨胀，不要加入太多" },
                    { instruction: "转中小火，慢慢倒入蛋液", detail: "一边倒入蛋液一边用筷子轻轻搅动，这样形成的蛋花更加漂亮" },
                    { instruction: "加入盐、鸡精调味", detail: "根据个人口味添加，注意鸡精含有盐分，应适量添加" },
                    { instruction: "撒上葱花", detail: "葱花增添香气和色彩" },
                    { instruction: "淋上少许香油，撒上胡椒粉", detail: "香油增添香气，胡椒粉增添风味" },
                    { instruction: "出锅装碗", detail: "趁热食用口感最佳" }
                ],
                notes: "1. 倒蛋液时水温不要太高，否则蛋花会成团而不够散开\n2. 紫菜最好选择干净的包装紫菜，避免杂质\n3. 如果喜欢更浓郁的味道，可以用鸡汤代替清水",
                difficulty: "★★",
                image: "seaweed-egg-soup.jpg"
            },
            {
                id: "dishes-staple-蛋炒饭",
                name: "蛋炒饭的做法",
                description: "蛋炒饭是一道简单美味的主食，香气扑鼻，口感丰富。初学者只需约15分钟即可完成。\n\n预估烹饪难度：★★★",
                category: "主食",
                ingredients: [
                    { name: "冷饭", text_quantity: "- 冷饭 500ml" },
                    { name: "鸡蛋", text_quantity: "- 鸡蛋 2个" },
                    { name: "火腿", text_quantity: "- 火腿 2个" },
                    { name: "黄瓜", text_quantity: "- 黄瓜 30g" },
                    { name: "胡萝卜", text_quantity: "- 胡萝卜 30g" },
                    { name: "油", text_quantity: "- 油 12ml" },
                    { name: "盐", text_quantity: "- 盐 5g" },
                    { name: "胡椒粉", text_quantity: "- 胡椒粉 8g" },
                    { name: "香葱", text_quantity: "- 香葱 1颗" },
                    { name: "生抽", text_quantity: "- 生抽 10ml" }
                ],
                steps: [
                    { instruction: "将冷饭用手指搓散", detail: "冷饭结块，需要提前搓散，这样炒出来的米饭更加松散" },
                    { instruction: "鸡蛋打散，加入少许盐搅拌均匀", detail: "加盐可以使蛋液更鲜美" },
                    { instruction: "火腿、黄瓜、胡萝卜切丁", detail: "切成小丁，大小均匀，便于炒制和入味" },
                    { instruction: "葱切成葱花", detail: "葱花可以增加香气" },
                    { instruction: "热锅倒油，油热后倒入蛋液", detail: "油温要够热，这样炒出的鸡蛋才会蓬松" },
                    { instruction: "蛋液半凝固时加入米饭", detail: "这个时机很重要，蛋液半凝固能更好地包裹米粒" },
                    { instruction: "用铲子不断翻炒，使米饭和鸡蛋充分混合", detail: "翻炒时注意力度，避免米饭粒碎裂" },
                    { instruction: "加入火腿丁、黄瓜丁、胡萝卜丁", detail: "这些配料增添色彩和口感" },
                    { instruction: "继续翻炒均匀", detail: "确保所有材料混合均匀" },
                    { instruction: "加入盐、胡椒粉、生抽调味", detail: "根据个人口味添加，注意生抽含有盐分" },
                    { instruction: "最后加入葱花翻炒几下", detail: "葱花最后加入，保持香气" },
                    { instruction: "出锅装盘", detail: "可以用碗扣出漂亮的形状，或者直接盛盘" }
                ],
                notes: "1. 炒饭最好用隔夜冷饭，米粒更加分明\n2. 炒饭的火候要大，这样炒出来的饭粒才会有'锅气'\n3. 如果喜欢更丰富的口感，可以加入青豆、玉米粒等食材",
                difficulty: "★★★",
                image: "egg-fried-rice.jpg"
            }
        ];
        
        // 将示例数据存储到localStorage
        localStorage.setItem('allRecipes', JSON.stringify(sampleRecipes));
        localStorage.setItem('dataInitialized', 'true');
    }
};

// 收藏功能
const Bookmarks = {
    getAll: function() {
        return JSON.parse(localStorage.getItem('bookmarks')) || [];
    },
    add: function(recipeId) {
        const bookmarks = this.getAll();
        if (!bookmarks.includes(recipeId)) {
            bookmarks.push(recipeId);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            return true;
        }
        return false;
    },
    remove: function(recipeId) {
        let bookmarks = this.getAll();
        bookmarks = bookmarks.filter(id => id !== recipeId);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        return true;
    },
    isBookmarked: function(recipeId) {
        const bookmarks = this.getAll();
        return bookmarks.includes(recipeId);
    }
};

// 语音功能
const SpeechHelper = {
    speak: function(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-TW';
            speechSynthesis.speak(utterance);
            return true;
        }
        return false;
    },
    stop: function() {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            return true;
        }
        return false;
    }
};

// 工具函数
const Utils = {
    // 获取URL参数
    getUrlParam: function(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },
    // 创建食谱卡片HTML
    createRecipeCard: function(recipe) {
        const isBookmarked = Bookmarks.isBookmarked(recipe.id);
        const bookmarkIconClass = isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';
        
        return `
            <div class="recipe-card" data-id="${recipe.id}">
                <div class="recipe-image" style="background-image: url('images/${recipe.image || 'placeholder.jpg'}');">
                    <div class="recipe-tag">${recipe.category}</div>
                </div>
                <div class="recipe-info">
                    <h3>${recipe.name}</h3>
                    <p>${recipe.description.split('\n')[0]}</p>
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
                            <i class="${bookmarkIconClass}"></i> ${isBookmarked ? '已收藏' : '收藏'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    // 检测设备是否在线
    isOnline: function() {
        return navigator.onLine;
    },
    // 显示通知
    showNotification: function(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
                <button class="close-notification"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 添加关闭按钮事件
        notification.querySelector('.close-notification').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // 自动关闭
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
};

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化示例数据
    API.initSampleData();
    
    // 移动端菜单切换
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // 语音搜索功能
    const voiceSearchBtns = document.querySelectorAll('.voice-search');
    
    voiceSearchBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if ('webkitSpeechRecognition' in window) {
                const recognition = new webkitSpeechRecognition();
                recognition.lang = 'zh-TW';
                recognition.start();
                
                Utils.showNotification('请开始说话...', 'info');
                
                recognition.onresult = function(event) {
                    const transcript = event.results[0][0].transcript;
                    const searchInput = btn.closest('form').querySelector('input[type="text"]');
                    searchInput.value = transcript;
                    Utils.showNotification('语音识别完成', 'success');
                };
                
                recognition.onerror = function(event) {
                    Utils.showNotification('语音识别失败，请重试', 'error');
                };
            } else {
                Utils.showNotification('您的浏览器不支持语音识别功能', 'error');
            }
        });
    });
    
    // 收藏按钮事件委托
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.bookmark-btn')) {
            const btn = e.target.closest('.bookmark-btn');
            const recipeId = btn.dataset.id;
            const icon = btn.querySelector('i');
            
            if (icon.classList.contains('far')) {
                // 添加收藏
                Bookmarks.add(recipeId);
                icon.classList.remove('far');
                icon.classList.add('fas');
                btn.innerHTML = `<i class="fas fa-bookmark"></i> 已收藏`;
                Utils.showNotification('已添加到收藏', 'success');
            } else {
                // 取消收藏
                Bookmarks.remove(recipeId);
                icon.classList.remove('fas');
                icon.classList.add('far');
                btn.innerHTML = `<i class="far fa-bookmark"></i> 收藏`;
                Utils.showNotification('已从收藏中移除', 'info');
            }
        }
    });
    
    // 查看食谱详情
    document.body.addEventListener('click', function(e) {
        if (e.target.closest('.view-recipe-btn') || e.target.closest('.recipe-image') || e.target.closest('.recipe-info h3')) {
            const recipeCard = e.target.closest('.recipe-card');
            if (recipeCard) {
                const recipeId = recipeCard.dataset.id;
                window.location.href = `recipe-detail.html?id=${recipeId}`;
            }
        }
    });
    
    // 分类选择
    const categoryItems = document.querySelectorAll('.category-item, .footer-categories a');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            window.location.href = `search.html?category=${category}`;
        });
    });
    
    // 检查在线状态
    function updateOnlineStatus() {
        const offlineNotice = document.querySelector('.offline-notice');
        if (offlineNotice) {
            if (Utils.isOnline()) {
                offlineNotice.style.display = 'none';
            } else {
                offlineNotice.style.display = 'flex';
            }
        }
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
});