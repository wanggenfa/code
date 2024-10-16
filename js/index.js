document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    const bannerSlider = document.querySelector('.banner-slides');
    console.log('Banner slider element:', bannerSlider);
    
    // 调用全局登录状态更新函数
    updateLoginStatus();

    // Banner轮播图
    const bannerPrev = document.querySelector('.banner-prev');
    const bannerNext = document.querySelector('.banner-next');
    
    if (!bannerSlider) {
        console.error('Banner slider element not found');
        return;
    }

    const bannerSlides = document.querySelectorAll('.banner-slide');
    let currentBannerIndex = 0;

    function changeBanner(direction) {
        bannerSlides[currentBannerIndex].classList.remove('active');
        currentBannerIndex = (currentBannerIndex + direction + bannerSlides.length) % bannerSlides.length;
        bannerSlides[currentBannerIndex].classList.add('active');
    }

    setInterval(() => changeBanner(1), 5000);

    bannerPrev.addEventListener('click', () => changeBanner(-1));
    bannerNext.addEventListener('click', () => changeBanner(1));

    // 新品推荐
    const newProductsGrid = document.querySelector('.new-products .product-grid');
    const newProducts = [
        { name: '草莓奶油蛋糕', description: '新鲜草莓与轻盈奶油的完美结合', price: 188, image: 'path/to/strawberry-cake.jpg' },
        { name: '巧克力慕斯', description: '浓郁巧克力口感，丝滑顺畅', price: 168, image: 'path/to/chocolate-mousse.jpg' },
        { name: '蓝莓芝士蛋糕', description: '酸甜蓝莓与香浓芝士的美妙融合', price: 198, image: 'path/to/blueberry-cheesecake.jpg' },
        { name: '抹茶红豆蛋糕', description: '清新抹茶与甜蜜红豆的东方风味', price: 178, image: 'path/to/matcha-redbean-cake.jpg' },
    ];

    function renderNewProducts() {
        newProductsGrid.innerHTML = newProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="price">¥${product.price}</div>
                    <div class="product-actions">
                        <button class="view-details">查看详情</button>
                        <button class="add-to-cart">入购物车</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderNewProducts();

    // 限时优惠倒计时
    const countdownTimer = document.querySelector('.countdown-timer');
    let timeLeft = 24 * 60 * 60; // 24小时倒计时

    function updateCountdown() {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        countdownTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        timeLeft--;
        if (timeLeft < 0) {
            timeLeft = 24 * 60 * 60; // 重置倒计时
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown(); // 初始化倒计时

    // 限时优惠产品
    const limitedOfferGrid = document.querySelector('.limited-offer .product-grid');
    const limitedOfferProducts = [
        { id: 1, name: "草莓芝士蛋糕", price: 158, discountPrice: 128, image: "path/to/strawberry-cheesecake.jpg" },
        { id: 2, name: "巧克力慕斯", price: 168, discountPrice: 138, image: "path/to/chocolate-mousse.jpg" },
        { id: 3, name: "抹茶红豆蛋糕", price: 148, discountPrice: 118, image: "path/to/matcha-redbean-cake.jpg" },
    ];

    function renderLimitedOfferProducts() {
        limitedOfferGrid.innerHTML = limitedOfferProducts.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">
                        <span class="original-price">¥${product.price}</span>
                        <span class="discount-price">¥${product.discountPrice}</span>
                    </p>
                    <button class="add-to-cart" data-id="${product.id}">加入购物车</button>
                </div>
            </div>
        `).join('');
    }

    renderLimitedOfferProducts();

    // 用户评论轮播
    const reviewSlider = document.querySelector('.review-slider');
    const reviews = [
        { name: '张三', content: '蛋糕非常美味,包装也很精美,很满意!', rating: 5, avatar: 'path/to/avatar1.jpg' },
        { name: '李四', content: '送货速度快,蛋糕新鲜,全家都很喜欢', rating: 4, avatar: 'path/to/avatar2.jpg' },
        { name: '王五', content: '款式很多,选择困难症都治好了,哈哈', rating: 5, avatar: 'path/to/avatar3.jpg' },
    ];

    let currentReviewIndex = 0;

    function renderReviews() {
        reviewSlider.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-content">
                    <img src="${review.avatar}" alt="${review.name}">
                    <div class="review-text">
                        <h4>${review.name}</h4>
                        <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                        <p>${review.content}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function changeReview() {
        currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        reviewSlider.style.transform = `translateX(-${currentReviewIndex * 100}%)`;
    }

    renderReviews();
    setInterval(changeReview, 5000);

    // 添加到购物车按钮动画
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.add('added');
            setTimeout(() => this.classList.remove('added'), 1500);
            showCartNotification('商品已添加到购物车');
            updateCartCount(parseInt(document.querySelector('.cart-count')?.textContent || '0') + 1);
        });
    });

    function showNewProducts() {
        const newProductsSection = document.getElementById('new-products');
        if (newProductsSection) {
            newProductsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // 检查 URL 是否包含 #new-products
    if (window.location.hash === '#new-products') {
        showNewProducts();
    }
});
