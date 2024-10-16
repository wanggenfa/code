document.addEventListener('DOMContentLoaded', function() {
    const switchBtns = document.querySelectorAll('.switch-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // 切换登录和注册表单
    switchBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            switchBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            if (this.dataset.form === 'login') {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            } else {
                registerForm.style.display = 'block';
                loginForm.style.display = 'none';
            }
        });
    });

    // 处理登录表单提交
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // 这里应该发送请求到服务器验证用户名和密码
        // 为了演示，我们使用模拟的登录逻辑
        if (username && password) {
            // 模拟成功登录
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify({ username: username }));
            
            alert('登录成功！');
            window.location.href = 'index.html'; // 跳转到首页
        } else {
            alert('请输入用户名和密码');
        }
    });

    // 处理注册表单提交
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        if (!name || !email || !password || !confirmPassword) {
            showNotification('请填写所有字段', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('两次输的密码不一致！', 'error');
            return;
        }

        // 验证密码是否包含字母和数字
        if (!isValidPassword(password)) {
            showNotification('密码必须包含字母和数字', 'error');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.some(u => u.email === email)) {
            showNotification('该邮箱已被注册，请直接登录', 'error');
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem('users', JSON.stringify(users));
        showNotification('注册成功！请登录', 'success');
        
        // 切换到登录表单
        document.querySelector('.switch-btn[data-form="login"]').click();
    });

    // 显示通知
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
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
        }, 3000);
    }

    // 添加输入验证
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
    });

    // 验证密码是否包含字母和数字
    function isValidPassword(password) {
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
    }

    console.log("Login script loaded");
});
