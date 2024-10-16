document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout script loaded');

    // 从 localStorage 获取购物车数据
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productList = document.getElementById('checkout-product-list');
    
    // 渲染购物车商品
    function renderCheckoutProducts() {
        if (cart.length === 0) {
            productList.innerHTML = '<p>购物车为空，请先添加商品。</p>';
            return;
        }

        productList.innerHTML = cart.map(item => `
            <div class="product-item">
                <img src="${item.image}" alt="${item.name}" class="product-image">
                <div class="product-details">
                    <h3 class="product-name">${item.name}</h3>
                    <p class="product-spec">${item.specification}</p>
                    <p class="product-price">单价：¥${item.price.toFixed(2)}</p>
                </div>
                <span class="product-quantity">x${item.quantity}</span>
                <span class="product-subtotal">¥${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        updateOrderSummary();
    }

    // 更新订单摘要
    function updateOrderSummary() {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shippingFee = subtotal >= 200 ? 0 : 20; // 假设满200免运费
        
        // 应用优惠券
        const couponSelect = document.getElementById('coupon-select');
        const couponValue = parseFloat(couponSelect.value) || 0;

        // 应用积分
        const usePointsCheckbox = document.getElementById('use-points');
        const pointsInput = document.getElementById('points-amount');
        const pointsValue = usePointsCheckbox.checked ? (parseInt(pointsInput.value) || 0) / 100 : 0;

        const total = subtotal + shippingFee - couponValue - pointsValue;

        const totalBreakdown = document.querySelector('.total-breakdown');
        totalBreakdown.innerHTML = `
            <p>商品小计：<span>¥${subtotal.toFixed(2)}</span></p>
            <p>运费：<span>¥${shippingFee.toFixed(2)}</span></p>
            <p>优惠券抵扣：<span>-¥${couponValue.toFixed(2)}</span></p>
            <p>积分抵扣：<span>-¥${pointsValue.toFixed(2)}</span></p>
        `;
        document.querySelector('.final-total span').textContent = `¥${total.toFixed(2)}`;
    }

    // 初始化页面
    renderCheckoutProducts();

    // 添加优惠券和积分相关的事件监听器
    document.getElementById('coupon-select').addEventListener('change', updateOrderSummary);
    document.getElementById('use-points').addEventListener('change', function() {
        document.getElementById('points-amount').disabled = !this.checked;
        updateOrderSummary();
    });
    document.getElementById('points-amount').addEventListener('input', updateOrderSummary);

    const placeOrderButton = document.getElementById('place-order');
    const payLaterButton = document.getElementById('pay-later');

    function handleOrderSubmission(isPaid) {
        console.log(`Order submitted. Paid: ${isPaid}`);
        
        // 保存订单信息
        const orderInfo = {
            isPaid: isPaid,
            orderDate: new Date().toISOString()
            // 添加其他订单信息...
        };

        // 保存订单到 localStorage
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderInfo);
        localStorage.setItem('orders', JSON.stringify(orders));

        // 清空购物车
        localStorage.removeItem('cart');

        // 跳转到首页
        window.location.href = 'index.html';
    }

    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', function(e) {
            e.preventDefault(); // 防止可能的表单提交
            console.log('Place order button clicked');
            handleOrderSubmission(true);
        });
    } else {
        console.error('Place order button not found');
    }

    if (payLaterButton) {
        payLaterButton.addEventListener('click', function(e) {
            e.preventDefault(); // 防止可能的表单提交
            console.log('Pay later button clicked');
            handleOrderSubmission(false);
        });
    } else {
        console.error('Pay later button not found');
    }

    // 处理客服链接
    const customerSupportLink = document.querySelector('.customer-support a');
    if (customerSupportLink) {
        customerSupportLink.addEventListener('click', function(e) {
            // 不阻止默认行为，允许正常跳转
            console.log('Navigating to customer service page');
        });
    }

    // 其他事件监听器和功能...

    const confirmModal = document.getElementById('confirm-modal');
    const confirmYesButton = document.getElementById('confirm-yes');
    const confirmNoButton = document.getElementById('confirm-no');

    payLaterButton.addEventListener('click', function() {
        confirmModal.style.display = 'block';
    });

    confirmYesButton.addEventListener('click', function() {
        // 保存订单信息（稍后支付）
        handleOrderSubmission(false);
        // 跳转到首页
        window.location.href = 'index.html';
    });

    confirmNoButton.addEventListener('click', function() {
        // 关闭模态框，留在当前页面
        confirmModal.style.display = 'none';
    });
});
