document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử DOM cần thiết
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const messageElement = document.getElementById('message');
    const forgotPasswordLink = document.getElementById('forgot-password'); // Thêm liên kết quên mật khẩu

    // Tên trang chủ bạn muốn chuyển đến
    const HOMEPAGE_URL = 'index.html'; 

    // Lắng nghe sự kiện "submit" của form
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            // Ngăn chặn hành vi gửi form mặc định của trình duyệt
            e.preventDefault(); 
            
            // Lấy giá trị từ các trường input
            const enteredUsername = usernameInput.value.trim();
            const enteredPassword = passwordInput.value;

            // Lấy danh sách tài khoản từ localStorage (nơi đã lưu từ trang đăng ký)
            const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
            
            // Tìm kiếm tài khoản trùng khớp
            const foundAccount = accounts.find(acc => 
                acc.username === enteredUsername && acc.password === enteredPassword
            );

            if (foundAccount) {
                // Trường hợp đăng nhập thành công
                messageElement.textContent = `Đăng nhập thành công! Đang chuyển hướng...`;
                messageElement.className = 'message success';
                messageElement.style.display = 'block';

                // Lưu tên người dùng vào Session Storage để sử dụng ở trang chủ (tùy chọn)
                sessionStorage.setItem('loggedInUser', enteredUsername);
                
                // Chờ 1.5 giây rồi chuyển hướng đến trang chủ
                setTimeout(() => {
                    window.location.href = HOMEPAGE_URL; 
                }, 1500);

            } else {
                // Trường hợp đăng nhập thất bại
                messageElement.textContent = 'Tên người dùng hoặc mật khẩu không đúng.';
                messageElement.className = 'message error';
                messageElement.style.display = 'block';
            }
        });
    }

    // Lắng nghe sự kiện click vào liên kết "Quên mật khẩu"
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
            messageElement.textContent = 'Vui lòng liên hệ quản trị viên để được hỗ trợ khôi phục mật khẩu.';
            messageElement.className = 'message error';
            messageElement.style.display = 'block';
        });
    }
});
