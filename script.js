// 产品图片悬停效果
document.querySelectorAll('.product-image').forEach(img => {
    img.addEventListener('mouseover', () => {
        img.style.transform = 'scale(1.1)';
        img.querySelector('.quick-view').style.display = 'block';
    });
    img.addEventListener('mouseout', () => {
        img.style.transform = 'scale(1)';
        img.querySelector('.quick-view').style.display = 'none';
    });
});

// 滚动加载
window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // 加载更多产品
        loadMoreProducts();
    }
});

function loadMoreProducts() {
    // 实现加载更多产品的逻辑
}

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // 减去导航栏的高度
                behavior: 'smooth'
            });
        }
    });
});
