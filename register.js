document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const emailInput = document.getElementById('email');
    const sendCodeButton = document.getElementById('send-code-button');
    const verificationGroup = document.querySelector('.verification-group');
    const verificationCodeInput = document.getElementById('verification-code');
    const registerButton = document.getElementById('register-button');
    const messageElement = document.getElementById('message');
    const registerForm = document.getElementById('register-form');

    let generatedCode = null;
    let isEmailVerified = false;

    // --- Hàm hiển thị thông báo ---
    function showMessage(type, content) {
        messageElement.textContent = content;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
    }

    // --- Logic Gửi Mã Xác Nhận ---
    sendCodeButton.addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (!email) {
            showMessage('error', 'Vui lòng nhập địa chỉ Email.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            showMessage('error', 'Địa chỉ Email không hợp lệ.');
            return;
        }

        // Mô phỏng tạo mã (Thực tế phải là server tạo và gửi)
        generatedCode = Math.floor(100000 + Math.random() * 900000).toString(); 
        
        // Hiện thông báo và khu vực nhập mã
        showMessage('success', `Mã xác nhận 6 chữ số đã được "gửi" đến ${email}. (Mô phỏng: Mã của bạn là ${generatedCode})`);
        verificationGroup.style.display = 'block';
        sendCodeButton.disabled = true; // Ngăn gửi mã nhiều lần
        emailInput.disabled = true; // Khóa email

        // Thiết lập đồng hồ đếm ngược (tùy chọn)
        let countdown = 60;
        const timer = setInterval(() => {
            if (countdown <= 0) {
                clearInterval(timer);
                sendCodeButton.disabled = false;
                sendCodeButton.textContent = 'Gửi Mã Lại';
                generatedCode = null; // Hết hạn mã
            } else {
                sendCodeButton.textContent = `Gửi Lại (${countdown}s)`;
                countdown--;
            }
        }, 1000);
    });

    // --- Logic Xác Thực Mã ---
    verificationCodeInput.addEventListener('input', () => {
        const enteredCode = verificationCodeInput.value.trim();
        
        // Chỉ cho phép đăng ký nếu mã đúng và mật khẩu hợp lệ
        if (enteredCode.length === 6 && enteredCode === generatedCode) {
            isEmailVerified = true;
            showMessage('success', 'Xác thực Email thành công! Bạn có thể tạo tài khoản.');
            verificationCodeInput.disabled = true; // Khóa trường mã
            registerButton.disabled = false; // Bật nút tạo tài khoản
        } else {
            isEmailVerified = false;
            // Chỉ hiển thị lỗi nếu đã nhập đủ 6 ký tự nhưng sai
            if (enteredCode.length === 6) {
                 showMessage('error', 'Mã xác nhận không đúng.');
            } else {
                 messageElement.style.display = 'none'; // Ẩn thông báo nếu chưa nhập đủ
            }
            registerButton.disabled = true;
        }
    });

    // --- Logic Đăng Ký Cuối Cùng ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const email = emailInput.value.trim();

        // 1. Kiểm tra Mật khẩu
        if (password !== confirmPassword) {
            showMessage('error', 'Mật khẩu và Nhập lại mật khẩu không khớp.');
            return;
        }

        // 2. Kiểm tra xác thực Email
        if (!isEmailVerified) {
            showMessage('error', 'Vui lòng xác thực Email trước khi tạo tài khoản.');
            return;
        }

        // 3. Kiểm tra Tên người dùng đã tồn tại (dựa trên localStorage)
        const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
        if (accounts.some(acc => acc.username === username)) {
            showMessage('error', 'Tên người dùng này đã tồn tại.');
            return;
        }
        
        // 4. Lưu Tài Khoản Mới vào LocalStorage
        const newAccount = { username, password, email }; // Lưu trữ mật khẩu dạng cleartext (Chỉ dùng cho Demo!)
        accounts.push(newAccount);
        localStorage.setItem('accounts', JSON.stringify(accounts));

        showMessage('success', 'Tạo tài khoản thành công! Bạn sẽ được chuyển đến trang Đăng nhập.');
        
        // Chuyển hướng sau 2 giây
        setTimeout(() => {
            window.location.href = 'login.html'; 
        }, 2000);
    });
});