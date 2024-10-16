document.addEventListener('DOMContentLoaded', function() {
    // 模拟从服务器获取的蛋糕详情数据
    const cakeDetails = {
        id: 1,
        name: '巧克力生日蛋糕',
        description: '浓郁巧克力口感，完美的生日选择',
        price: 188,
        originalPrice: 228,
        rating: 4.5,
        reviewCount: 150,
        images: [
            'path/to/cake-main-image.jpg',
            'path/to/cake-image-1.jpg',
            'path/to/cake-image-2.jpg',
            'path/to/cake-image-3.jpg'
        ],
        details: '这款巧克力生日蛋糕采用高品质可可粉和新鲜奶油制作，口感丰富细腻。蛋糕胚蓬松柔软，夹层中的巧克力慕斯清甜不腻。适合各种生日派对场合，是送给巧克力爱好者的完美礼物。',
        reviews: [
            { user: '张三', rating: 5, content: '蛋糕非常美味，包装也很精美，很满意!' },
            { user: '李四', rating: 4, content: '口感不错，但是觉得有点甜。' },
            // 添加更多评论...
        ]
    };

    // 更新页面内容
    document.getElementById('cake-name').textContent = cakeDetails.name;
    document.getElementById('cake-title').textContent = cakeDetails.name;
    document.getElementById('cake-description').textContent = cakeDetails.description;
    document.getElementById('rating-value').textContent = cakeDetails.rating;
    document.getElementById('review-count').textContent = `(${cakeDetails.reviewCount}条评价)`;
    document.getElementById('current-price').textContent = `¥${cakeDetails.price}`;
    document.getElementById('original-price').textContent = `¥${cakeDetails.originalPrice}`;
    document.getElementById('main-cake-image').src = cakeDetails.images[0];
    document.getElementById('cake-details-content').textContent = cakeDetails.details;

    // 添加缩略图
    const thumbnailContainer = document.querySelector('.thumbnail-images');
    cakeDetails.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = `${cakeDetails.name} 图片 ${index + 1}`;
        thumbnail.addEventListener('click', () => {
            document.getElementById('main-cake-image').src = image;
        });
        thumbnailContainer.appendChild(thumbnail);
    });

    // 处理规格选择
    document.querySelectorAll('.size-option, .flavor-option').forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.querySelector('.active').classList.remove('active');
            this.classList.add('active');
            updatePrice();
        });
    });

    // 处理数量选择
    document.getElementById('decrease-quantity').addEventListener('click', () => {
        const quantityInput = document.getElementById('quantity');
        if (quantityInput.value > 1) {
            quantityInput.value--;
            updatePrice();
        }
    });

    document.getElementById('increase-quantity').addEventListener('click', () => {
        const quantityInput = document.getElementById('quantity');
        quantityInput.value++;
        updatePrice();
    });

    document.getElementById('quantity').addEventListener('change', updatePrice);

    function updatePrice() {
        const size = document.querySelector('.size-option.active').dataset.size;
        const quantity = document.getElementById('quantity').value;
        let price = cakeDetails.price;

        if (size === '8') price += 30;
        if (size === '10') price += 60;

        document.getElementById('current-price').textContent = `¥${price * quantity}`;
    }

    // 处理评论过滤
    document.querySelectorAll('.review-filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelector('.review-filter-btn.active').classList.remove('active');
            this.classList.add('active');
            filterReviews(this.dataset.rating);
        });
    });

    function filterReviews(rating) {
        const reviewList = document.getElementById('review-list');
        reviewList.innerHTML = '';
        const filteredReviews = rating === 'all' 
            ? cakeDetails.reviews 
            : cakeDetails.reviews.filter(review => review.rating === parseInt(rating));

        filteredReviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-item';
            reviewElement.innerHTML = `
                <h4>${review.user}</h4>
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                <p>${review.content}</p>
            `;
            reviewList.appendChild(reviewElement);
        });
    }

    // 初始化评论列表
    filterReviews('all');

    // 处理"加入购物车"和"立即购买"按钮
    document.getElementById('add-to-cart').addEventListener('click', () => {
        // 这里应该实现真实的添加到购物车逻辑
        showNotification('已添加到购物车!');
        updateCartCount(1);
    });

    document.getElementById('buy-now').addEventListener('click', () => {
        // 这里应该实现跳转到结算页面的逻辑
        window.location.href = 'checkout.html';
    });

    // 显示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }

    // 更新购物车数量
    function updateCartCount(count) {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const currentCount = parseInt(cartCount.textContent);
            cartCount.textContent = currentCount + count;
        }
    }

    // 图片放大功能
    const mainImage = document.getElementById('main-cake-image');
    mainImage.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        const largeImage = document.createElement('img');
        largeImage.src = mainImage.src;
        overlay.appendChild(largeImage);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    });

    // 添加实时库存和配送提醒功能
    function updateStockAndDelivery() {
        const stockStatus = document.getElementById('stock-status');
        const deliveryEstimate = document.getElementById('delivery-estimate');

        // 这里应该是一个真实的 API 调用来获取库存信息
        // 以下是模拟的逻辑
        const inStock = Math.random() > 0.2; // 80% 的概率��库存
        const stockQuantity = Math.floor(Math.random() * 50) + 1;

        if (inStock) {
            stockStatus.textContent = `库存状态: 有货 (剩余 ${stockQuantity} 件)`;
            stockStatus.style.color = 'green';
        } else {
            stockStatus.textContent = '库存状态: 暂时缺货';
            stockStatus.style.color = 'red';
        }

        // 模拟配送时间估算
        const today = new Date();
        const deliveryDate = new Date(today.setDate(today.getDate() + Math.floor(Math.random() * 5) + 1));
        deliveryEstimate.textContent = `预计配送时间: ${deliveryDate.toLocaleDateString()}`;
    }

    // 在页面加载完成后调用此函数
    updateStockAndDelivery();

    // 处理"喜欢"按钮点击
    document.getElementById('like-cake').addEventListener('click', function() {
        this.classList.toggle('liked');
        if (this.classList.contains('liked')) {
            this.innerHTML = '<i class="fas fa-heart"></i>';
            showNotification('已添加到收藏夹');
        } else {
            this.innerHTML = '<i class="far fa-heart"></i>';
            showNotification('已从收藏夹移除');
        }
    });

    // 处理"分享"按钮点击
    document.getElementById('share-cake').addEventListener('click', function() {
        // 这里应该实现实际的分享功能，例如使用Web Share API
        if (navigator.share) {
            navigator.share({
                title: cakeDetails.name,
                text: cakeDetails.description,
                url: window.location.href,
            })
            .then(() => showNotification('分享成功'))
            .catch((error) => console.log('分享失败:', error));
        } else {
            showNotification('您的浏览器不支持分享功能');
        }
    });

    // 个性化推荐
    function getPersonalizedRecommendations() {
        // 这里应该是一个真实的API调用来获取个性化推荐
        // 以下是模拟的推荐数据
        return [
            { id: 5, name: '巧克力慕斯', price: 198, image: 'path/to/chocolate-mousse.jpg' },
            { id: 6, name: '红丝绒蛋糕', price: 188, image: 'path/to/red-velvet.jpg' },
            { id: 7, name: '提拉米苏', price: 178, image: 'path/to/tiramisu.jpg' },
        ];
    }

    function renderPersonalizedRecommendations() {
        const recommendations = getPersonalizedRecommendations();
        const recommendationsList = document.getElementById('personalized-recommendations-list');
        recommendationsList.innerHTML = recommendations.map(cake => `
            <div class="product-card">
                <img src="${cake.image}" alt="${cake.name}">
                <div class="product-info">
                    <h3>${cake.name}</h3>
                    <p class="price">¥${cake.price}</p>
                    <button class="add-to-cart" data-id="${cake.id}">加入购物车</button>
                </div>
            </div>
        `).join('');
    }

    // 调用函数以渲染个性化推荐
    renderPersonalizedRecommendations();
});
