document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cake-customization-form');
    const priceElement = document.getElementById('estimated-price');
    const previewImage = document.getElementById('cake-preview-image');

    // 模拟价格计算
    function calculatePrice() {
        const size = document.getElementById('cake-size').value;
        const layers = document.getElementById('cake-layers').value;
        const toppings = document.querySelectorAll('input[name="toppings"]:checked').length;

        let price = 100; // 基础价格
        price += (size - 6) * 20; // 尺寸加价
        price += (layers - 1) * 30; // 层数加价
        price += toppings * 10; // 配料加价

        return price;
    }

    // 更新预览图片
    function updatePreview() {
        const flavor = document.getElementById('cake-flavor').value;
        const size = document.getElementById('cake-size').value;
        previewImage.src = `path/to/${flavor}-${size}.jpg`;
    }

    // 更新价格和预览
    function updatePriceAndPreview() {
        priceElement.textContent = `¥${calculatePrice()}`;
        updatePreview();
    }

    // 为所有可能影响价格的元素添加事件监听器
    ['cake-size', 'cake-layers', 'cake-flavor'].forEach(id => {
        document.getElementById(id).addEventListener('change', updatePriceAndPreview);
    });

    document.querySelectorAll('input[name="toppings"]').forEach(checkbox => {
        checkbox.addEventListener('change', updatePriceAndPreview);
    });

    // 表单提交处理
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // 这里应该有将定制蛋糕添加到购物车的逻辑
        alert('定制蛋糕已添加到购物车！');
    });

    // 初始化价格和预览
    updatePriceAndPreview();
});
