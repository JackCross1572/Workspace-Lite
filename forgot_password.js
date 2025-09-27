document.addEventListener('DOMContentLoaded', () => {
    // Lấy các form và phần tử DOM
    const emailForm = document.getElementById('email-form');
    const codeForm = document.getElementById('code-form');
    const resetPasswordForm = document.getElementById('reset-password-form');
    const emailInput = document.getElementById('email');
    const verificationCodeInput = document.getElementById('verification-code');
    const displayUsernameInput = document.getElementById('display-username');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    const messageElement = document.getElementById('message');

    let generatedCode = null;
    let accountToReset = null;

    // --- Hàm hiển thị thông báo ---
    function showMessage(type, content) {
        messageElement.textContent = content;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
    }

    // --- Bước 1: Gửi mã xác nhận ---
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
        accountToReset = accounts.find(acc => acc.email === email);

        if (!accountToReset) {
            showMessage('error', 'Email không tồn tại trong hệ thống.');
            return;
        }

        // Tạo mã xác nhận (mô phỏng)
        generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        showMessage('success', `Mã xác nhận 6 chữ số đã được "gửi" đến ${email}. (Mô phỏng: Mã của bạn là ${generatedCode})`);
        
        // Chuyển sang bước 2
        emailForm.style.display = 'none';
        codeForm.style.display = 'block';
    });

    // --- Bước 2: Xác minh mã ---
    codeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredCode = verificationCodeInput.value.trim();

        if (enteredCode === generatedCode) {
            showMessage('success', 'Xác minh thành công. Vui lòng đặt lại mật khẩu.');
            
            // Hiển thị tên người dùng và chuyển sang bước 3
            displayUsernameInput.value = accountToReset.username;
            codeForm.style.display = 'none';
            resetPasswordForm.style.display = 'block';
        } else {
            showMessage('error', 'Mã xác nhận không đúng. Vui lòng thử lại.');
        }
    });

    // --- Bước 3: Đổi mật khẩu ---
    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPassword = newPasswordInput.value;
        const confirmNewPassword = confirmNewPasswordInput.value;

        if (newPassword !== confirmNewPassword) {
            showMessage('error', 'Mật khẩu mới không khớp. Vui lòng nhập lại.');
            return;
        }

        // Cập nhật mật khẩu trong localStorage
        const accounts = JSON.parse(localStorage.getItem('accounts'));
        const index = accounts.findIndex(acc => acc.email === accountToReset.email);
        
        if (index !== -1) {
            accounts[index].password = newPassword;
            localStorage.setItem('accounts', JSON.stringify(accounts));
            showMessage('success', 'Đổi mật khẩu thành công! Đang chuyển hướng về trang đăng nhập.');
            
            // Chuyển về trang đăng nhập
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showMessage('error', 'Đã xảy ra lỗi, không tìm thấy tài khoản để cập nhật.');
        }
    });
});
