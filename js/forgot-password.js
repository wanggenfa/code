document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgot-password-form');

    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;

        if (!email) {
            showNotification('请输入邮箱地址', 'error');
            return;
        }

        // 这里应该实现真实的忘记密码逻辑，比如发送重置密码的邮件
        console.log('发送重置密码邮件到:', email);
        showNotification('重置密码链接已发送到您的邮箱，请查收', 'success');
    });

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
});
