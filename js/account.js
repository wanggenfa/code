// 添加这个调试函数
function debugLog(message) {
    console.log(`[DEBUG] ${message}`);
}

document.addEventListener('DOMContentLoaded', function() {
    debugLog('DOM fully loaded');
    initMenuSwitching();
    initDashboard();
    // 默认显示账户概览
    showSection('dashboard');
    initAccountInfo();
    initAddressBook();
    initPaymentMethods();
    initCouponsAndPoints();
    initWishlist();
    initNotifications();
    initReviewsAndFeedback();
    initAccountSecurity();
});

function initMenuSwitching() {
    debugLog('Initializing menu switching');
    const sidebarLinks = document.querySelectorAll('.account-sidebar a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            debugLog(`Clicked menu item: ${targetId}`);
            showSection(targetId);
        });
    });
}

function showSection(sectionId) {
    debugLog(`Attempting to show section: ${sectionId}`);
    const sections = document.querySelectorAll('.account-section');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
        debugLog(`Section ${section.id} display: ${section.style.display}`);
    });

    // 更新侧边栏活动状态
    const sidebarLinks = document.querySelectorAll('.account-sidebar a');
    sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        debugLog(`Sidebar link ${link.getAttribute('href')} active: ${link.classList.contains('active')}`);
    });

    // 初始化相应的功能
    switch(sectionId) {
        case 'dashboard':
            initDashboard();
            break;
        case 'orders':
            initOrders();
            break;
        case 'address-book':
            initAddressBook();
            break;
        case 'payment-methods':
            initPaymentMethods();
            break;
        case 'coupons-points':
            initCouponsAndPoints();
            break;
        case 'wishlist':
            initWishlist();
            break;
        case 'notifications':
            initNotifications();
            break;
        case 'reviews-feedback':
            initReviewsAndFeedback();
            break;
        case 'account-security':
            initAccountSecurity();
            break;
        default:
            debugLog(`Unknown section: ${sectionId}`);
    }
}

// 确保所有初始化函数都被定义
function initDashboard() {
    console.log('Dashboard initialized');
    const dashboardSection = document.getElementById('dashboard');
    if (!dashboardSection) return;

    // 获取用户信息
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};

    // 渲染欢迎信息和快捷链接
    dashboardSection.innerHTML = `
        <div class="welcome-message">
            <img src="${user.avatar || 'img/default-avatar.png'}" alt="用户头像" class="user-avatar">
            <div class="welcome-text">
                <h2>欢迎回来，${user.username || '尊敬的用户'}！</h2>
                <p>账户等级：${getUserLevel(user.points || 0)}</p>
            </div>
        </div>
        <div class="quick-links">
            <a href="#orders" class="quick-link" data-target="orders">
                <i class="fas fa-shopping-bag"></i>
                我的订单
            </a>
            <a href="#account-info" class="quick-link" data-target="account-info">
                <i class="fas fa-user-edit"></i>
                账户信息
            </a>
            <a href="#address-book" class="quick-link" data-target="address-book">
                <i class="fas fa-address-book"></i>
                地址管理
            </a>
        </div>
    `;

    // 添加快捷链接事件监听器
    const quickLinks = dashboardSection.querySelectorAll('.quick-link');
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-target');
            showSection(targetSection);
        });
    });
}

function getUserLevel(points) {
    if (points >= 10000) return 'VIP会员';
    if (points >= 5000) return '金牌会员';
    if (points >= 1000) return '银牌会员';
    return '普通会员';
}

function initOrders() {
    console.log('Orders initialized');
    const ordersSection = document.getElementById('orders');
    if (!ordersSection) return;

    // 从 localStorage 获取订单数据，如果没有则使用默认数据
    let orders = JSON.parse(localStorage.getItem('userOrders')) || [];

    // 如果没有订单，添加一些示例订单
    if (orders.length === 0) {
        orders = [
            {
                id: 'ORD001',
                status: '待支付',
                date: '2023-06-15',
                items: [{ name: '巧克力蛋糕', quantity: 1 }],
                total: 188,
                address: '北京市朝阳区xxx街道xxx号',
                payment: '微信支付',
                tracking: '',
                invoice: '电子发票'
            },
            {
                id: 'ORD002',
                status: '已发货',
                date: '2023-06-10',
                items: [{ name: '草莓蛋糕', quantity: 2 }],
                total: 336,
                address: '上海市浦东新区xxx路xxx号',
                payment: '支付宝',
                tracking: 'SF1234567890',
                invoice: '纸质发票'
            }
        ];
        localStorage.setItem('userOrders', JSON.stringify(orders));
    }

    // 按时间倒序排列订单
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 渲染订单列表
    ordersSection.innerHTML = `
        <h2>我的订单</h2>
        <div class="order-list">
            ${orders.map(order => `
                <div class="order-item">
                    <div class="order-header">
                        <span>订单号: ${order.id}</span>
                        <span class="order-status">${order.status}</span>
                    </div>
                    <div class="order-content">
                        <p>下单时间: ${order.date}</p>
                        <p>商品: ${order.items.map(item => `${item.name} x ${item.quantity}`).join(', ')}</p>
                        <p>总金额: ¥${order.total}</p>
                    </div>
                    <div class="order-footer">
                        <button class="btn-view-details" data-order-id="${order.id}">查看详情</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // 添加查看详情事件监听器
    ordersSection.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-view-details')) {
            const orderId = e.target.getAttribute('data-order-id');
            showOrderDetails(orderId);
        }
    });
}

function showOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('userOrders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const ordersSection = document.getElementById('orders');
    ordersSection.innerHTML = `
        <h2>订单详情</h2>
        <div class="order-details">
            <p><strong>订单号:</strong> ${order.id}</p>
            <p><strong>订单状态:</strong> ${order.status}</p>
            <p><strong>下单时间:</strong> ${order.date}</p>
            <h3>商品列表:</h3>
            <ul>
                ${order.items.map(item => `<li>${item.name} x ${item.quantity}</li>`).join('')}
            </ul>
            <p><strong>总金额:</strong> ¥${order.total}</p>
            <p><strong>配送地址:</strong> ${order.address}</p>
            <p><strong>支付方式:</strong> ${order.payment}</p>
            ${order.tracking ? `<p><strong>物流单号:</strong> ${order.tracking}</p>` : ''}
            <p><strong>发票信息:</strong> ${order.invoice}</p>
            <div class="order-actions">
                ${order.status === '待支付' ? '<button class="btn-cancel-order">取消订单</button>' : ''}
                ${order.status === '已发货' ? '<button class="btn-apply-refund">申请退款</button>' : ''}
                <button class="btn-reorder">再次购买</button>
            </div>
            <button class="btn-back-to-list">返回订单列表</button>
        </div>
    `;

    // 添加订单操作事件监听器
    ordersSection.querySelector('.order-actions').addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-cancel-order')) {
            cancelOrder(orderId);
        } else if (e.target.classList.contains('btn-apply-refund')) {
            applyRefund(orderId);
        } else if (e.target.classList.contains('btn-reorder')) {
            reorder(orderId);
        }
    });

    ordersSection.querySelector('.btn-back-to-list').addEventListener('click', initOrders);
}

function cancelOrder(orderId) {
    // 实现取消订单的逻辑
    alert(`订单 ${orderId} 已取消`);
    initOrders();
}

function applyRefund(orderId) {
    // 实现申请退款的逻辑
    alert(`已为订单 ${orderId} 申请退款`);
}

function reorder(orderId) {
    // 实现再次购买的逻辑
    alert(`已将订单 ${orderId} 中的商品重新加入购物车`);
}

function initAddressBook() {
    console.log('Address book initialized');
    const addressBookSection = document.getElementById('address-book');
    if (!addressBookSection) return;

    //  localStorage 获取地址数据
    let addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];

    addressBookSection.innerHTML = `
        <h2>地址管理</h2>
        <div class="address-list">
            ${addresses.map((addr, index) => `
                <div class="address-item ${addr.isDefault ? 'default' : ''}">
                    <p><strong>${addr.name}</strong> ${addr.phone}</p>
                    <p>${addr.province} ${addr.city} ${addr.district} ${addr.detailAddress}</p>
                    <p>邮编: ${addr.zipCode}</p>
                    <div class="address-actions">
                        <button class="btn-edit" data-index="${index}">编辑</button>
                        <button class="btn-delete" data-index="${index}">删除</button>
                        ${!addr.isDefault ? `<button class="btn-set-default" data-index="${index}">设为默认</button>` : '<span class="default-badge">默认地址</span>'}
                    </div>
                </div>
            `).join('')}
        </div>
        <button id="add-address" class="btn-primary">添加新地址</button>
    `;

    // 添加事件监听器
    addressBookSection.addEventListener('click', handleAddressAction);
    document.getElementById('add-address').addEventListener('click', () => showAddressForm());
}

function handleAddressAction(e) {
    const target = e.target;
    if (target.classList.contains('btn-edit')) {
        showAddressForm(parseInt(target.dataset.index));
    } else if (target.classList.contains('btn-delete')) {
        deleteAddress(parseInt(target.dataset.index));
    } else if (target.classList.contains('btn-set-default')) {
        setDefaultAddress(parseInt(target.dataset.index));
    }
}

function showAddressForm(index = null) {
    const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    const address = index !== null ? addresses[index] : {};

    const formHTML = `
        <div id="address-form-container">
            <form id="address-form">
                <h3>${index !== null ? '编辑地址' : '添加新地址'}</h3>
                <div class="form-group">
                    <label for="smart-parse">智能识别</label>
                    <textarea id="smart-parse" placeholder="粘贴包含姓名、电话、地址的文本"></textarea>
                    <button type="button" id="parse-address" class="btn-secondary">智能识别</button>
                </div>
                <div class="form-group">
                    <label for="name">收货人姓名</label>
                    <input type="text" id="name" name="name" required value="${address.name || ''}">
                </div>
                <div class="form-group">
                    <label for="phone">手机号码</label>
                    <input type="tel" id="phone" name="phone" required value="${address.phone || ''}">
                </div>
                <div class="form-group">
                    <label for="province">省份</label>
                    <select id="province" name="province" required>
                        <option value="">请选择省份</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="city">城市</label>
                    <select id="city" name="city" required>
                        <option value="">请选择城市</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="district">区/县</label>
                    <select id="district" name="district" required>
                        <option value="">请选择区/县</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="detailAddress">详细地址</label>
                    <input type="text" id="detailAddress" name="detailAddress" required value="${address.detailAddress || ''}">
                </div>
                <div class="form-group checkbox-group">
                    <label>
                        <input type="checkbox" name="isDefault" ${address.isDefault ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        <span>设为默认地址</span>
                    </label>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">保存地址</button>
                    <button type="button" class="btn-secondary" onclick="closeAddressForm()">取消</button>
                </div>
            </form>
        </div>
    `;

    const formContainer = document.createElement('div');
    formContainer.innerHTML = formHTML;
    document.body.appendChild(formContainer);
    document.body.classList.add('address-form-open'); // 添加这行

    // 初始化省市区选择器
    initAreaSelector();

    // 添加智能识别功能
    document.getElementById('parse-address').addEventListener('click', smartParseAddress);

    document.getElementById('address-form').addEventListener('submit', saveAddress);
}

function initAreaSelector() {
    // 这里需要添加省市区数据和联动逻辑
    // 可以使用一个现成的省市区选择器库，或者自己实现
    // 这里仅作为示例，实际实现可能会更复杂
    const provinces = ['北京市', '上海市', '广东省', /* ... */];
    const provinceSelect = document.getElementById('province');
    provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });

    // 添加城市和区县的联动逻辑
}

function smartParseAddress() {
    const smartParseInput = document.getElementById('smart-parse').value;
    // 这里需要实现智能解析逻辑
    // 可以使用正则表达式或其他方法来解析文本
    // 这里仅作为示例，实际实现可能会更复杂
    const parsedResult = {
        name: '张三',
        phone: '13800138000',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detailAddress: 'xx街道xx号'
    };

    // 填充表单
    document.getElementById('name').value = parsedResult.name;
    document.getElementById('phone').value = parsedResult.phone;
    document.getElementById('province').value = parsedResult.province;
    document.getElementById('city').value = parsedResult.city;
    document.getElementById('district').value = parsedResult.district;
    document.getElementById('detailAddress').value = parsedResult.detailAddress;
}

function closeAddressForm() {
    const formContainer = document.getElementById('address-form-container');
    if (formContainer) {
        formContainer.remove();
        document.body.classList.remove('address-form-open'); // 添加这行
    }
}

function saveAddress(e) {
    e.preventDefault();
    const form = e.target;
    const addressData = {
        name: form.name.value,
        phone: form.phone.value,
        province: form.province.value,
        city: form.city.value,
        district: form.district.value,
        detailAddress: form.detailAddress.value,
        zipCode: form.zipCode.value,
        isDefault: form.isDefault.checked
    };

    let addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    const index = form.index.value !== '' ? parseInt(form.index.value) : null;

    if (index !== null) {
        // 编辑现有地址
        addresses[index] = addressData;
    } else {
        // 添加新地址
        addresses.push(addressData);
    }

    // 如果设置为默认地址，更新其他地址的默认状态
    if (addressData.isDefault) {
        addresses.forEach((addr, i) => {
            if (i !== index) {
                addr.isDefault = false;
            }
        });
    }

    localStorage.setItem('userAddresses', JSON.stringify(addresses));
    closeAddressForm();
    initAddressBook(); // 重新渲染地址列表
}

function deleteAddress(index) {
    const addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    if (addresses[index].isDefault) {
        alert('不能删除默认地址，请先设置其他地址为');
        return;
    }

    if (confirm('确定要删除这个地址吗？')) {
        addresses.splice(index, 1);
        localStorage.setItem('userAddresses', JSON.stringify(addresses));
        initAddressBook(); // 重新渲染地址列表
    }
}

function setDefaultAddress(index) {
    let addresses = JSON.parse(localStorage.getItem('userAddresses')) || [];
    addresses.forEach((addr, i) => {
        addr.isDefault = i === index;
    });
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
    initAddressBook(); // 重新渲染地址列表
}

function initAccountInfo() {
    console.log('Account info initialized');
    const accountInfoSection = document.getElementById('account-info');
    if (!accountInfoSection) return;

    // 获取用户信息
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};

    // 确保我们总是使用保存的头像或默认头像
    const avatarSrc = user.avatar || 'img/default-avatar.png';

    accountInfoSection.innerHTML = `
        <h2>账户信息</h2>
        <div class="avatar-upload">
            <img id="current-avatar" src="${avatarSrc}" alt="当前头像">
            <input type="file" id="avatar-upload" accept="image/*">
            <label for="avatar-upload" class="btn-upload">选择新头像</label>
            <button id="upload-avatar" class="btn-secondary">上传头像</button>
        </div>
        <form id="account-info-form">
            <div class="form-group">
                <label for="username">用户</label>
                <input type="text" id="username" name="username" value="${user.username || ''}" readonly>
            </div>
            <div class="form-group">
                <label for="email">邮箱</label>
                <input type="email" id="email" name="email" value="${user.email || ''}">
            </div>
            <div class="form-group">
                <label for="phone">手机号</label>
                <input type="tel" id="phone" name="phone" value="${user.phone || ''}">
            </div>
            <div class="form-group">
                <label for="birthday">生日</label>
                <input type="date" id="birthday" name="birthday" value="${user.birthday || ''}">
            </div>
            <div class="form-group">
                <label for="gender">性别</label>
                <select id="gender" name="gender">
                    <option value="">请选择</option>
                    <option value="male" ${user.gender === 'male' ? 'selected' : ''}>男</option>
                    <option value="female" ${user.gender === 'female' ? 'selected' : ''}>女</option>
                    <option value="other" ${user.gender === 'other' ? 'selected' : ''}>其他</option>
                </select>
            </div>
            <button type="submit" class="btn-primary">保存修改</button>
        </form>
    `;

    // 添加头像上传功能
    document.getElementById('avatar-upload').addEventListener('change', previewAvatar);
    document.getElementById('upload-avatar').addEventListener('click', uploadAvatar);
    
    // 添加事件听器
    document.getElementById('account-info-form').addEventListener('submit', updateAccountInfo);
}

// 确保在 DOMContentLoaded 事件中调用 initAccountInfo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    initAccountInfo();
    // ... 其他初始化函数
});

function updateAccountInfo(e) {
    e.preventDefault();
    console.log('Updating account info');
    const form = e.target;
    const updatedUser = {
        username: form.username.value,
        email: form.email.value,
        phone: form.phone.value,
        birthday: form.birthday.value,
        gender: form.gender.value
    };

    console.log('Updated user info:', updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    alert('账户信息已更新');
}

function previewAvatar(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('current-avatar').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function updateAvatarDisplay() {
    const user = JSON.parse(localStorage.getItem('currentUser')) || {};
    const avatarSrc = user.avatar || 'img/default-avatar.png';
    
    // 更新所有显示用户头像的地方
    const avatarElements = document.querySelectorAll('.user-avatar');
    avatarElements.forEach(element => {
        element.src = avatarSrc;
    });
}

// 在上传头像成功后调用此函数
function uploadAvatar() {
    const fileInput = document.getElementById('avatar-upload');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const avatarImg = document.getElementById('current-avatar');
            avatarImg.src = e.target.result;
            
            // 保存头像到 localStorage
            let user = JSON.parse(localStorage.getItem('currentUser')) || {};
            user.avatar = e.target.result;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // 更新所有头像显示
            updateAvatarDisplay();
            
            alert('头像上传成功！');
        };
        reader.readAsDataURL(file);
    } else {
        alert('请先选择一个图片文件');
    }
}

// 在页面加载时调用此函数
document.addEventListener('DOMContentLoaded', function() {
    initAccountInfo();
    updateAvatarDisplay();
    // ... 其他初始化函数 ...
});

function initPaymentMethods() {
    console.log('Payment methods initialized');
    const paymentMethodsSection = document.getElementById('payment-methods');
    if (!paymentMethodsSection) return;

    // 从 localStorage 获取支付方式数据
    let paymentMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [];

    paymentMethodsSection.innerHTML = `
        <h2>支付方式管理</h2>
        <div class="payment-methods-list">
            ${paymentMethods.map((method, index) => `
                <div class="payment-method-item">
                    <p>${getPaymentMethodDescription(method)}</p>
                    <button class="btn-unbind" data-index="${index}">解绑</button>
                </div>
            `).join('')}
        </div>
        <button id="add-payment-method" class="btn-primary">添加新支付方式</button>
    `;

    // 添加事件监听器
    paymentMethodsSection.addEventListener('click', handlePaymentMethodAction);
    document.getElementById('add-payment-method').addEventListener('click', showAddPaymentMethodForm);
}

function getPaymentMethodDescription(method) {
    switch (method.type) {
        case 'credit_card':
            return `信用卡 (尾号 ${method.lastFour})`;
        case 'debit_card':
            return `借记卡 (尾号 ${method.lastFour})`;
        case 'alipay':
            return `支付宝 (${method.account})`;
        case 'wechat':
            return `微信支付`;
        default:
            return '未知支付方式';
    }
}

function handlePaymentMethodAction(e) {
    if (e.target.classList.contains('btn-unbind')) {
        const index = parseInt(e.target.dataset.index);
        unbindPaymentMethod(index);
    }
}

function showAddPaymentMethodForm() {
    const formHTML = `
        <form id="payment-method-form">
            <div class="form-group">
                <label for="payment-type">支付方式类型</label>
                <select id="payment-type" name="type" required>
                    <option value="">请选择支付方式</option>
                    <option value="credit_card">信用卡</option>
                    <option value="debit_card">借记卡</option>
                    <option value="alipay">支付宝</option>
                    <option value="wechat">微信支付</option>
                </select>
            </div>
            <div id="card-details" style="display: none;">
                <div class="form-group">
                    <label for="card-number">卡号</label>
                    <input type="text" id="card-number" name="cardNumber" pattern="[0-9]{16}" placeholder="16位卡号">
                </div>
                <div class="form-group">
                    <label for="expiry-date">有效期</label>
                    <input type="text" id="expiry-date" name="expiryDate" pattern="(0[1-9]|1[0-2])/[0-9]{2}" placeholder="MM/YY">
                </div>
                <div class="form-group">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" name="cvv" pattern="[0-9]{3,4}" placeholder="3或4位数字">
                </div>
            </div>
            <div id="alipay-details" style="display: none;">
                <div class="form-group">
                    <label for="alipay-account">支付宝账号</label>
                    <input type="text" id="alipay-account" name="alipayAccount">
                </div>
            </div>
            <div id="wechat-details" style="display: none;">
                <p>请使用微信扫描以下二维码进行绑定</p>
                <img src="path/to/wechat-qr-code.png" alt="微信绑定二维码">
            </div>
            <button type="submit" class="btn-primary">保存支付方式</button>
            <button type="button" class="btn-secondary" onclick="closePaymentMethodForm()">取消</button>
        </form>
    `;

    const formContainer = document.createElement('div');
    formContainer.id = 'payment-method-form-container';
    formContainer.innerHTML = formHTML;
    document.body.appendChild(formContainer);

    document.getElementById('payment-type').addEventListener('change', togglePaymentDetails);
    document.getElementById('payment-method-form').addEventListener('submit', savePaymentMethod);
}

function togglePaymentDetails() {
    const paymentType = document.getElementById('payment-type').value;
    document.getElementById('card-details').style.display = (paymentType === 'credit_card' || paymentType === 'debit_card') ? 'block' : 'none';
    document.getElementById('alipay-details').style.display = paymentType === 'alipay' ? 'block' : 'none';
    document.getElementById('wechat-details').style.display = paymentType === 'wechat' ? 'block' : 'none';
}

function closePaymentMethodForm() {
    const formContainer = document.getElementById('payment-method-form-container');
    if (formContainer) {
        formContainer.remove();
    }
}

function savePaymentMethod(e) {
    e.preventDefault();
    const form = e.target;
    const paymentType = form.type.value;
    let paymentData = { type: paymentType };

    switch (paymentType) {
        case 'credit_card':
        case 'debit_card':
            paymentData.lastFour = form.cardNumber.value.slice(-4);
            paymentData.expiryDate = form.expiryDate.value;
            break;
        case 'alipay':
            paymentData.account = form.alipayAccount.value;
            break;
        case 'wechat':
            // 微信支付不需要额外信息
            break;
    }

    let paymentMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [];
    paymentMethods.push(paymentData);
    localStorage.setItem('userPaymentMethods', JSON.stringify(paymentMethods));

    closePaymentMethodForm();
    initPaymentMethods(); // 重新渲染支付方式列表
}

function unbindPaymentMethod(index) {
    if (confirm('确定要解绑这个支付方式吗？')) {
        let paymentMethods = JSON.parse(localStorage.getItem('userPaymentMethods')) || [];
        paymentMethods.splice(index, 1);
        localStorage.setItem('userPaymentMethods', JSON.stringify(paymentMethods));
        initPaymentMethods(); // 重新渲染支付方式列表
    }
}

function initCouponsAndPoints() {
    console.log('Coupons and points initialized');
    const couponsPointsSection = document.getElementById('coupons-points');
    if (!couponsPointsSection) return;

    // 从 localStorage 获取优惠券和积分数据
    let coupons = JSON.parse(localStorage.getItem('userCoupons')) || [];
    let points = parseInt(localStorage.getItem('userPoints')) || 0;
    let pointsHistory = JSON.parse(localStorage.getItem('userPointsHistory')) || [];

    // 如果没有优惠券，添加一些示例数据
    if (coupons.length === 0) {
        coupons = [
            { id: 1, type: '满减券', value: 10, minPurchase: 100, expiry: '2023-12-31', rules: '仅限蛋糕类商品使用' },
            { id: 2, type: '折扣券', value: 0.9, minPurchase: 0, expiry: '2023-11-30', rules: '全场通用' }
        ];
        localStorage.setItem('userCoupons', JSON.stringify(coupons));
    }

    // 如果没有积分历史，添加一些示例数据
    if (pointsHistory.length === 0) {
        pointsHistory = [
            { date: '2023-06-01', description: '购物获得', points: 100 },
            { date: '2023-05-15', description: '兑换礼品', points: -200 }
        ];
        localStorage.setItem('userPointsHistory', JSON.stringify(pointsHistory));
    }

    couponsPointsSection.innerHTML = `
        <h2>优惠券与积分</h2>
        <div class="coupons-container">
            <h3>我的优惠券</h3>
            <div class="coupons-list">
                ${coupons.map(coupon => `
                    <div class="coupon-item">
                        <h4>${coupon.type}</h4>
                        <p>价值: ${getCouponValue(coupon)}</p>
                        <p>最低消费: ¥${coupon.minPurchase}</p>
                        <p>有效期至: ${coupon.expiry}</p>
                        <p>使用规则: ${coupon.rules}</p>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="points-container">
            <h3>我的积分</h3>
            <p>当前积分: ${points}</p>
            <button id="view-points-history" class="btn-secondary">查看积分历史</button>
            <h4>积分兑换</h4>
            <select id="points-exchange-options">
                <option value="">选择兑换选项</option>
                <option value="1">10元代金券 (1000积分)</option>
                <option value="2">20元代金券 (1800积分)</option>
                <option value="3">精美礼品 (2000积分)</option>
            </select>
            <button id="exchange-points" class="btn-primary">兑换</button>
        </div>
    `;

    // 添加事件监听器
    document.getElementById('view-points-history').addEventListener('click', showPointsHistory);
    document.getElementById('exchange-points').addEventListener('click', exchangePoints);
}

function getCouponValue(coupon) {
    return coupon.type === '满减券' ? `¥${coupon.value}` : `${coupon.value * 100}% 折扣`;
}

function showPointsHistory() {
    const pointsHistory = JSON.parse(localStorage.getItem('userPointsHistory')) || [];
    const modalHTML = `
        <div id="points-history-modal" class="modal">
            <div class="modal-content">
                <h3>积分历史</h3>
                <table>
                    <thead>
                        <tr>
                            <th>日期</th>
                            <th>描述</th>
                            <th>积分变动</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pointsHistory.map(record => `
                            <tr>
                                <td>${record.date}</td>
                                <td>${record.description}</td>
                                <td>${record.points > 0 ? '+' : ''}${record.points}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <button id="close-points-history" class="btn-secondary">关闭</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('close-points-history').addEventListener('click', () => {
        document.getElementById('points-history-modal').remove();
    });
}

function exchangePoints() {
    const selectElement = document.getElementById('points-exchange-options');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    if (!selectedOption.value) {
        alert('请选择兑换选项');
        return;
    }

    const exchangeOptions = [
        { id: 1, name: '10元代金券', points: 1000 },
        { id: 2, name: '20元代金券', points: 1800 },
        { id: 3, name: '精美礼品', points: 2000 }
    ];

    const selectedExchange = exchangeOptions.find(option => option.id === parseInt(selectedOption.value));
    let userPoints = parseInt(localStorage.getItem('userPoints')) || 0;

    if (userPoints < selectedExchange.points) {
        alert('积分不足');
        return;
    }

    userPoints -= selectedExchange.points;
    localStorage.setItem('userPoints', userPoints);

    let pointsHistory = JSON.parse(localStorage.getItem('userPointsHistory')) || [];
    pointsHistory.unshift({
        date: new Date().toISOString().split('T')[0],
        description: `兑换 ${selectedExchange.name}`,
        points: -selectedExchange.points
    });
    localStorage.setItem('userPointsHistory', JSON.stringify(pointsHistory));

    alert(`成功兑换 ${selectedExchange.name}`);
    initCouponsAndPoints(); // 重新渲染页面
}

// 确保在 DOMContentLoaded 事件中调用 initCouponsAndPoints
document.addEventListener('DOMContentLoaded', function() {
    // ... 其他初始化函数
    initCouponsAndPoints();
});

function initWishlist() {
    console.log('Wishlist initialized');
    const wishlistSection = document.getElementById('wishlist');
    if (!wishlistSection) return;

    // 从 localStorage 获取收藏夹数据
    let wishlistItems = JSON.parse(localStorage.getItem('userWishlist')) || [];

    // 如果收藏夹为，添加一些示例数据
    if (wishlistItems.length === 0) {
        wishlistItems = [
            { id: 1, name: '巧克力蛋糕', price: 188, image: 'img/chocolate-cake.jpg', stock: 10 },
            { id: 2, name: '草莓蛋糕', price: 168, image: 'img/strawberry-cake.jpg', stock: 5 },
            { id: 3, name: '芒果慕斯', price: 198, image: 'img/mango-mousse.jpg', stock: 0 }
        ];
        localStorage.setItem('userWishlist', JSON.stringify(wishlistItems));
    }

    wishlistSection.innerHTML = `
        <h2>我的收藏</h2>
        <div class="wishlist-items">
            ${wishlistItems.map(item => `
                <div class="wishlist-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="wishlist-item-info">
                        <h3>${item.name}</h3>
                        <p class="price">¥${item.price}</p>
                        <p class="stock">${item.stock > 0 ? `库存: ${item.stock}` : '暂时缺货'}</p>
                        <div class="wishlist-item-actions">
                            <button class="btn-view-details">查看详情</button>
                            <button class="btn-add-to-cart" ${item.stock === 0 ? 'disabled' : ''}>
                                ${item.stock === 0 ? '缺货' : '加入购物车'}
                            </button>
                            <button class="btn-remove-from-wishlist">取消收藏</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // 添加事件监听器
    wishlistSection.addEventListener('click', handleWishlistAction);
}

function handleWishlistAction(e) {
    const target = e.target;
    const wishlistItem = target.closest('.wishlist-item');
    if (!wishlistItem) return;

    const itemId = parseInt(wishlistItem.dataset.id);

    if (target.classList.contains('btn-view-details')) {
        viewItemDetails(itemId);
    } else if (target.classList.contains('btn-add-to-cart')) {
        addToCart(itemId);
    } else if (target.classList.contains('btn-remove-from-wishlist')) {
        removeFromWishlist(itemId);
    }
}

function viewItemDetails(itemId) {
    // 在实际应用中，这里应该跳转到商品详情页
    alert(`查看商品 ${itemId} 的详情`);
}

function addToCart(itemId) {
    let wishlistItems = JSON.parse(localStorage.getItem('userWishlist')) || [];
    const item = wishlistItems.find(item => item.id === itemId);

    if (item && item.stock > 0) {
        // 在实际应用中，这里应该将商品添加到购物车
        alert(`已将 ${item.name} 添加到购物车`);
    } else {
        alert('该商品暂时缺货');
    }
}

function removeFromWishlist(itemId) {
    let wishlistItems = JSON.parse(localStorage.getItem('userWishlist')) || [];
    wishlistItems = wishlistItems.filter(item => item.id !== itemId);
    localStorage.setItem('userWishlist', JSON.stringify(wishlistItems));
    initWishlist(); // 重新渲染收藏夹
}

// 确保在 DOMContentLoaded 事件中调用 initWishlist
document.addEventListener('DOMContentLoaded', function() {
    // ... 其他初始化函数
    initWishlist();
});

function initNotifications() {
    console.log('Notifications initialized');
    const notificationsSection = document.getElementById('notifications');
    if (!notificationsSection) return;

    // 从 localStorage 获取通知数据
    let notifications = JSON.parse(localStorage.getItem('userNotifications')) || [];

    // 如果没有通知，添加一些示例数据
    if (notifications.length === 0) {
        notifications = [
            { id: 1, type: 'order', content: '您的订单 #12345 已发货', date: '2023-06-15', read: false },
            { id: 2, type: 'system', content: '618大促即将开始，敬请期待！', date: '2023-06-10', read: true },
            { id: 3, type: 'order', content: '您的订单 #12346 已完成', date: '2023-06-05', read: true },
            { id: 4, type: 'system', content: '系统升级完成，新功能已上线', date: '2023-06-01', read: false }
        ];
        localStorage.setItem('userNotifications', JSON.stringify(notifications));
    }

    notificationsSection.innerHTML = `
        <h2>消息中心</h2>
        <div class="notification-tabs">
            <button class="tab-button active" data-type="all">全部</button>
            <button class="tab-button" data-type="order">订单通知</button>
            <button class="tab-button" data-type="system">系统通知</button>
        </div>
        <div class="notifications-list">
            ${renderNotifications(notifications)}
        </div>
    `;

    // 添加事件监听器
    const tabButtons = notificationsSection.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const type = this.dataset.type;
            const filteredNotifications = type === 'all' ? notifications : notifications.filter(n => n.type === type);
            notificationsSection.querySelector('.notifications-list').innerHTML = renderNotifications(filteredNotifications);
        });
    });

    notificationsSection.querySelector('.notifications-list').addEventListener('click', handleNotificationClick);
}

function renderNotifications(notifications, type = 'all') {
    return notifications
        .filter(notification => type === 'all' || notification.type === type)
        .map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="notification-header">
                    <span class="notification-type">${notification.type === 'order' ? '订单通知' : '系统通知'}</span>
                    <span class="notification-date">${notification.date}</span>
                </div>
                <div class="notification-content">${notification.content}</div>
                ${!notification.read ? '<button class="mark-as-read">标记为已读</button>' : ''}
            </div>
        `).join('');
}

function handleNotificationClick(e) {
    if (e.target.classList.contains('mark-as-read')) {
        const notificationId = parseInt(e.target.closest('.notification-item').dataset.id);
        markAsRead(notificationId);
    }
}

function markAsRead(notificationId) {
    let notifications = JSON.parse(localStorage.getItem('userNotifications')) || [];
    const notificationIndex = notifications.findIndex(n => n.id === notificationId);
    if (notificationIndex !== -1) {
        notifications[notificationIndex].read = true;
        localStorage.setItem('userNotifications', JSON.stringify(notifications));
        initNotifications(); // 重新渲染通知列表
    }
}

// 确保在 DOMContentLoaded 事件中调用 initNotifications
document.addEventListener('DOMContentLoaded', function() {
    // ... 其他初始化函数
    initNotifications();
});

function initReviewsAndFeedback() {
    console.log('Reviews and feedback initialized');
    const reviewsSection = document.getElementById('reviews-feedback');
    if (!reviewsSection) return;

    // 从 localStorage 取评价和未评价订单数据
    let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    let pendingReviews = JSON.parse(localStorage.getItem('userPendingReviews')) || [];

    // 如果没有评价，添加一些示例数据
    if (reviews.length === 0) {
        reviews = [
            { id: 1, productName: '巧克力蛋糕', orderId: '12345', rating: 5, content: '非常美味，包装也很精美！', date: '2023-06-01' },
            { id: 2, productName: '草蛋糕', orderId: '12346', rating: 4, content: '口感不错，但是有点太甜了。', date: '2023-05-15' }
        ];
        localStorage.setItem('userReviews', JSON.stringify(reviews));
    }

    // 如果没有未评价订单，添加一些示例数据
    if (pendingReviews.length === 0) {
        pendingReviews = [
            { orderId: '12347', productName: '芒果慕斯', purchaseDate: '2023-06-10' },
            { orderId: '12348', productName: '蓝莓芝', purchaseDate: '2023-06-05' }
        ];
        localStorage.setItem('userPendingReviews', JSON.stringify(pendingReviews));
    }

    reviewsSection.innerHTML = `
        <h2>评价与反馈</h2>
        <div class="reviews-container">
            <h3>我的评价</h3>
            <div class="reviews-list">
                ${reviews.map(review => `
                    <div class="review-item" data-id="${review.id}">
                        <h4>${review.productName}</h4>
                        <p>评分: ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</p>
                        <p>评价内容: ${review.content}</p>
                        <p>评价时间: ${review.date}</p>
                        <button class="btn-edit-review">修改评价</button>
                        <button class="btn-delete-review">删除评价</button>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="pending-reviews-container">
            <h3>未评价订单</h3>
            <div class="pending-reviews-list">
                ${pendingReviews.map(order => `
                    <div class="pending-review-item" data-order-id="${order.orderId}">
                        <p>商品: ${order.productName}</p>
                        <p>购买时间: ${order.purchaseDate}</p>
                        <button class="btn-write-review">写评价</button>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="feedback-container">
            <h3>问题反馈</h3>
            <form id="feedback-form">
                <select name="feedbackType" required>
                    <option value="">请选择反馈类型</option>
                    <option value="suggestion">建议</option>
                    <option value="complaint">投诉</option>
                    <option value="inquiry">咨询</option>
                </select>
                <textarea name="feedbackContent" placeholder="请输入您的反馈内容" required></textarea>
                <button type="submit" class="btn-submit-feedback">提交反馈</button>
            </form>
        </div>
    `;

    // 添加事件监听器
    reviewsSection.addEventListener('click', handleReviewAction);
    document.getElementById('feedback-form').addEventListener('submit', handleFeedbackSubmit);
}

function handleReviewAction(e) {
    if (e.target.classList.contains('btn-edit-review')) {
        const reviewId = e.target.closest('.review-item').dataset.id;
        editReview(reviewId);
    } else if (e.target.classList.contains('btn-delete-review')) {
        const reviewId = e.target.closest('.review-item').dataset.id;
        deleteReview(reviewId);
    } else if (e.target.classList.contains('btn-write-review')) {
        const orderId = e.target.closest('.pending-review-item').dataset.orderId;
        writeReview(orderId);
    }
}

function editReview(reviewId) {
    let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
    const review = reviews.find(r => r.id.toString() === reviewId);
    if (!review) return;

    const newContent = prompt('请输入新的评价内容:', review.content);
    if (newContent !== null) {
        review.content = newContent;
        localStorage.setItem('userReviews', JSON.stringify(reviews));
        initReviewsAndFeedback(); // 重新渲染评价列表
    }
}

function deleteReview(reviewId) {
    if (confirm('确定要删除这条评价吗？')) {
        let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
        reviews = reviews.filter(r => r.id.toString() !== reviewId);
        localStorage.setItem('userReviews', JSON.stringify(reviews));
        initReviewsAndFeedback(); // 重新渲染评价列表
    }
}

function writeReview(orderId) {
    let pendingReviews = JSON.parse(localStorage.getItem('userPendingReviews')) || [];
    const order = pendingReviews.find(o => o.orderId === orderId);
    if (!order) return;

    const rating = prompt('请为商品评分 (1-5 星):', '5');
    const content = prompt('请输入您的评价内容:');
    if (rating && content) {
        let reviews = JSON.parse(localStorage.getItem('userReviews')) || [];
        reviews.push({
            id: Date.now(),
            productName: order.productName,
            orderId: order.orderId,
            rating: parseInt(rating),
            content: content,
            date: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('userReviews', JSON.stringify(reviews));

        pendingReviews = pendingReviews.filter(o => o.orderId !== orderId);
        localStorage.setItem('userPendingReviews', JSON.stringify(pendingReviews));

        initReviewsAndFeedback(); // 重新渲染评价列表
    }
}

function handleFeedbackSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const feedbackType = form.feedbackType.value;
    const feedbackContent = form.feedbackContent.value;

    // 在实际应用中，这里应该发送反馈到服务器
    alert(`感谢您的${getFeedbackTypeName(feedbackType)}！\n\n内容：${feedbackContent}`);
    form.reset();
}

function getFeedbackTypeName(type) {
    switch (type) {
        case 'suggestion': return '建议';
        case 'complaint': return '投诉';
        case 'inquiry': return '咨询';
        default: return '反馈';
    }
}

// 确保在 DOMContentLoaded 事件中调用 initReviewsAndFeedback
document.addEventListener('DOMContentLoaded', function() {
    // ... 其他初始化函数
    initReviewsAndFeedback();
});

function initAccountSecurity() {
    console.log('Account security initialized');
    const securitySection = document.getElementById('account-security');
    if (!securitySection) return;

    // 从 localStorage 获取登录记录数据
    let loginHistory = JSON.parse(localStorage.getItem('userLoginHistory')) || [];

    // 如果没有登录记录，添加一些示例数据
    if (loginHistory.length === 0) {
        loginHistory = [
            { date: '2023-06-15 10:30:00', device: 'iPhone 12', ip: '192.168.1.1' },
            { date: '2023-06-14 15:45:00', device: 'Windows PC', ip: '192.168.1.2' },
            { date: '2023-06-13 09:15:00', device: 'MacBook Pro', ip: '192.168.1.3' }
        ];
        localStorage.setItem('userLoginHistory', JSON.stringify(loginHistory));
    }

    securitySection.innerHTML = `
        <h2>账号安全</h2>
        <div class="login-history">
            <h3>最近登录记录</h3>
            <table>
                <thead>
                    <tr>
                        <th>登录时间</th>
                        <th>设备</th>
                        <th>IP地址</th>
                    </tr>
                </thead>
                <tbody>
                    ${loginHistory.map(record => `
                        <tr>
                            <td>${record.date}</td>
                            <td>${record.device}</td>
                            <td>${record.ip}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="security-settings">
            <h3>安全设置</h3>
            <div class="setting-item">
                <span>双重验证</span>
                <label class="switch">
                    <input type="checkbox" id="two-factor-auth">
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="setting-item">
                <span>修改密码</span>
                <button id="change-password" class="btn-secondary">修改</button>
            </div>
            <div class="setting-item">
                <span>密保问题</span>
                <button id="manage-security-questions" class="btn-secondary">管理</button>
            </div>
        </div>
    `;

    // 添加事件监听器
    document.getElementById('two-factor-auth').addEventListener('change', toggleTwoFactorAuth);
    document.getElementById('change-password').addEventListener('click', changePassword);
    document.getElementById('manage-security-questions').addEventListener('click', manageSecurityQuestions);
}

function toggleTwoFactorAuth(e) {
    const isEnabled = e.target.checked;
    // 在实际应用中，这里应该发送请求到服务器来启用或禁用双重验证
    alert(isEnabled ? '双重验证已启用' : '双重验证已禁');
}

function changePassword() {
    const currentPassword = prompt('请输入当前密码:');
    if (!currentPassword) return;

    const newPassword = prompt('请输入新密码:');
    if (!newPassword) return;

    const confirmPassword = prompt('请再次输入新密码:');
    if (newPassword !== confirmPassword) {
        alert('两次输入的新密码不一致，请重试。');
        return;
    }

    // 在实际应用中，这里应该发送请求到服务器来验证当前密码并更新新密码
    alert('密码修改成功！');
}

function manageSecurityQuestions() {
    // 在实际应用中，这里应该打开一个模态框来管理密保问题
    alert('密保问题管理功能待实现');
}

// 确保在 DOMContentLoaded 事件中调用 initAccountSecurity
document.addEventListener('DOMContentLoaded', function() {
    // ... 其他初始化函数
    initAccountSecurity();
});