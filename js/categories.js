document.addEventListener('DOMContentLoaded', function() {
    const productList = document.getElementById('product-list');
    const pagination = document.getElementById('pagination');
    const sortSelect = document.getElementById('sort-select');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const priceRange = document.getElementById('price-range');
    const priceOutput = document.querySelector('output[for="price-range"]');

    let currentPage = 1;
    const productsPerPage = 12;

    // 模拟从服务器获取产品数据
    function fetchProducts(page, sort, filters) {
        // 这里应该是一个真实的API调用
        return new Promise((resolve) => {
            setTimeout(() => {
                const products = [
                    { id: 1, name: '巧克力蛋糕', price: 188, image: 'path/to/chocolate-cake.jpg' },
                    { id: 2, name: '草莓蛋糕', price: 168, image: 'path/to/strawberry-cake.jpg' },
                    // 添加更多产品...
                ];

                // 应用筛选和排序
                let filteredProducts = products.filter(product => {
                    return product.price <= filters.maxPrice;
                });

                if (sort === 'price-asc') {
                    filteredProducts.sort((a, b) => a.price - b.price);
                } else if (sort === 'price-desc') {
                    filteredProducts.sort((a, b) => b.price - a.price);
                }

                const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
                const start = (page - 1) * productsPerPage;
                const end = start + productsPerPage;

                resolve({
                    products: filteredProducts.slice(start, end),
                    totalPages: totalPages
                });
            }, 500);
        });
    }

    function renderProducts(products) {
        productList.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">¥${product.price}</p>
                    <button class="btn-add-to-cart" data-id="${product.id}">加入购物车</button>
                </div>
            </div>
        `).join('');
    }

    function renderPagination(totalPages) {
        pagination.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.toggle('active', i === currentPage);
            button.addEventListener('click', () => loadProducts(i));
            pagination.appendChild(button);
        }
    }

    function loadProducts(page = 1) {
        currentPage = page;
        const sort = sortSelect.value;
        const filters = {
            maxPrice: parseInt(priceRange.value)
        };

        fetchProducts(page, sort, filters).then(({ products, totalPages }) => {
            renderProducts(products);
            renderPagination(totalPages);
        });
    }

    sortSelect.addEventListener('change', () => loadProducts());
    applyFiltersBtn.addEventListener('click', () => loadProducts());

    priceRange.addEventListener('input', function() {
        priceOutput.textContent = `¥0 - ¥${this.value}`;
    });

    // 初始加载产品
    loadProducts();
});
