document.addEventListener('DOMContentLoaded', function() {
    const cartContent = document.getElementById('cart-content');
    const cartSummary = document.getElementById('cart-summary');
    const proceedToCheckout = document.getElementById('proceed-to-checkout');
    const continueShopping = document.getElementById('continue-shopping');

    function updateCartSummary() {
        const items = document.querySelectorAll('.cart-item');
        let totalQuantity = 0;
        let subtotal = 0;

        items.forEach(item => {
            const quantity = parseInt(item.querySelector('.quantity-control input').value);
            const price = parseFloat(item.querySelector('.item-price').textContent.replace('¥', ''));
            totalQuantity += quantity;
            subtotal += quantity * price;
        });

        const shipping = subtotal >= 200 ? 0 : 20; // 假设满200包邮

        // 应用优惠券
        const couponSelect = document.getElementById('coupon-select');
        const couponValue = parseFloat(couponSelect.value) || 0;

        // 应用积分
        const usePointsCheckbox = document.getElementById('use-points');
        const pointsInput = document.getElementById('points-amount');
        const pointsValue = usePointsCheckbox.checked ? (parseInt(pointsInput.value) || 0) / 100 : 0;

        // 更新总金额
        const total = subtotal + shipping - couponValue - pointsValue;

        document.querySelector('#cart-summary .summary-item:nth-child(1) span:last-child').textContent = totalQuantity;
        document.querySelector('#cart-summary .summary-item:nth-child(2) span:last-child').textContent = `¥${subtotal.toFixed(2)}`;
        document.querySelector('#cart-summary .summary-item:nth-child(3) span:last-child').textContent = `¥${shipping.toFixed(2)}`;
        document.querySelector('#cart-summary .total span:last-child').textContent = `¥${total.toFixed(2)}`;
    }

    function proceedToCheckoutHandler() {
        const cartItems = document.querySelectorAll('.cart-item');
        const cart = Array.from(cartItems).map(item => ({
            id: item.dataset.id,
            name: item.querySelector('.item-info h3').textContent,
            specification: item.querySelector('.item-info p').textContent,
            price: parseFloat(item.querySelector('.item-price').textContent.replace('¥', '')),
            quantity: parseInt(item.querySelector('.quantity-control input').value),
            image: item.querySelector('img').src
        }));

        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'checkout.html';
    }

    if (proceedToCheckout) {
        proceedToCheckout.addEventListener('click', proceedToCheckoutHandler);
    } else {
        console.error('Checkout button not found');
    }

    cartContent.addEventListener('click', function(e) {
        const target = e.target;
        const cartItem = target.closest('.cart-item');
        if (!cartItem) return;

        if (target.classList.contains('decrease')) {
            const input = cartItem.querySelector('.quantity-control input');
            if (input.value > 1) {
                input.value = parseInt(input.value) - 1;
                updateCartSummary();
            }
        } else if (target.classList.contains('increase')) {
            const input = cartItem.querySelector('.quantity-control input');
            if (input.value < parseInt(input.max)) {
                input.value = parseInt(input.value) + 1;
                updateCartSummary();
            }
        } else if (target.classList.contains('remove-item') || target.closest('.remove-item')) {
            if (confirm('确定要删除这个商品吗？')) {
                cartItem.remove();
                updateCartSummary();
            }
        } else if (target.classList.contains('move-to-wishlist') || target.closest('.move-to-wishlist')) {
            alert('商品已移入收藏夹');
            cartItem.remove();
            updateCartSummary();
        }
    });

    document.getElementById('select-all').addEventListener('change', function(e) {
        const isChecked = e.target.checked;
        document.querySelectorAll('.item-select').forEach(checkbox => checkbox.checked = isChecked);
    });

    document.getElementById('coupon-select').addEventListener('change', updateCartSummary);
    document.getElementById('use-points').addEventListener('change', function() {
        document.getElementById('points-amount').disabled = !this.checked;
        updateCartSummary();
    });
    document.getElementById('points-amount').addEventListener('input', updateCartSummary);
    document.getElementById('shipping-method').addEventListener('change', updateCartSummary);

    continueShopping.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    updateCartSummary();
});
