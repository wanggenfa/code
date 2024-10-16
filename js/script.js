// 在文件开头添加或更新以下函数

function updateLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userAccountLink = document.querySelector('.user-account');
    const logoutButton = document.getElementById('logout-button');

    if (isLoggedIn && currentUser) {
        userAccountLink.innerHTML = `
            <i class="fas fa-user"></i>
            <span>${currentUser.username}</span>
        `;
        userAccountLink.href = 'account.html';
        
        // 显示退出登录按钮
        if (logoutButton) {
            logoutButton.style.display = 'block';
        }
    } else {
        userAccountLink.innerHTML = `
            <i class="fas fa-user"></i>
            <span>登录/注册</span>
        `;
        userAccountLink.href = 'login.html';
        
        // 隐藏退出登录按钮
        if (logoutButton) {
            logoutButton.style.display = 'none';
        }
    }
}

// 在 DOMContentLoaded 事件中调用 updateLoginStatus
document.addEventListener('DOMContentLoaded', updateLoginStatus);

// 添加登录函数
function login(username, password) {
    // 这里应该是实际的登录逻辑，与后端验证等
    // 为了演示，我们只是简单地设置本地存储
    const user = {
        username: username,
        avatar: '', // 这里应该是用户的实际头像URL
        points: 1000, // 这里应该是用户的实际积分
        // 其他用户信息...
    };
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateLoginStatus();
    window.location.href = 'account.html'; // 登录成功后跳转到个人中心页面
}

// 添加登出函数
function logout() {
    // 清除登录状态
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    
    // 更新UI
    updateLoginStatus();
    
    // 重定向到首页
    window.location.href = 'index.html';
}

// 平滑滚动到锚点
function smoothScrollToAnchor(anchor) {
    const target = document.querySelector(anchor);
    if (target) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// 在页面加载时更新登录状态
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    initBannerSlider();
    initTestimonialSlider();
    // 其他初始化代码...
});

// 确保 initBannerSlider 函数只定义和调用一次
function initBannerSlider() {
    console.log('Initializing banner slider');
    const slides = document.querySelectorAll('.banner-slide');
    const prevButton = document.querySelector('.banner-prev');
    const nextButton = document.querySelector('.banner-next');
    let currentSlide = 0;

    console.log('Number of slides:', slides.length);

    if (slides.length === 0) {
        console.error('No slides found');
        return;
    }

    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        slides[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        showSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', prevSlide);
        nextButton.addEventListener('click', nextSlide);
    } else {
        console.error('Navigation buttons not found');
    }

    // 自动切换幻灯片
    setInterval(nextSlide, 5000);

    // 初始化显示一张幻灯片
    showSlide(0);
}

function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}

// 在文件末尾添加以下代码

function initTestimonials() {
    const testimonials = [
        { content: "蛋糕非常美味,包装也很精美,很满意!", author: "张三" },
        { content: "服务态度很好,蛋糕口感一流,一定会再次购买!", author: "李四" },
        { content: "朋过生日订的蛋糕,大家都赞不绝口,谢谢!", author: "王五" }
    ];

    const testimonialSlider = document.querySelector('.testimonial-slider');
    let currentTestimonial = 0;

    function renderTestimonials() {
        testimonialSlider.innerHTML = testimonials.map((testimonial, index) => `
            <div class="testimonial-item ${index === 0 ? 'active' : ''}">
                <p class="testimonial-content">"${testimonial.content}"</p>
                <p class="testimonial-author">- ${testimonial.author}</p>
            </div>
        `).join('');
    }

    function rotateTestimonials() {
        const items = document.querySelectorAll('.testimonial-item');
        items[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % items.length;
        items[currentTestimonial].classList.add('active');
    }

    renderTestimonials();
    setInterval(rotateTestimonials, 5000);

    const newTestimonialInput = document.getElementById('new-testimonial');
    const submitTestimonialButton = document.getElementById('submit-testimonial');

    submitTestimonialButton.addEventListener('click', function() {
        const content = newTestimonialInput.value.trim();
        if (content) {
            // 这里应该有一个API调用来保存评价
            testimonials.push({ content, author: "匿名用户" });
            renderTestimonials();
            newTestimonialInput.value = '';
            alert('感谢您的评价!');
        } else {
            alert('请输入评价内容');
        }
    });
}

// 确保在 DOMContentLoaded 事件监听器中调用 initTestimonials
document.addEventListener('DOMContentLoaded', function() {
    // ... 其他初始化代码 ...
    initTestimonials();
});

// 在页面加载时更新登录状态
document.addEventListener('DOMContentLoaded', function() {
    updateLoginStatus();

    // 如果存在登出按钮，添加事件监听器
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // 添加平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            } else if (targetId === 'new-products' && window.location.pathname !== '/index.html') {
                // 如果不在首页，先跳转到首页，然后滚动到新品推荐
                window.location.href = 'index.html#new-products';
            }
        });
    });

    document.querySelectorAll('.customer-support').forEach(link => {
        link.addEventListener('click', function(e) {
            // 如果链接的 href 不是 customer-service.html，则阻止默认行为
            if (this.getAttribute('href') !== 'customer-service.html') {
                e.preventDefault();
                // 处理其他客服相关的逻辑
            }
        });
    });
});

