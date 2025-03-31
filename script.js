document.addEventListener('DOMContentLoaded', () => {
    const accountList = document.getElementById('account-list');
    const adminCredentials = { username: 'BGHCODER', password: '141112', balance: Infinity };

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const adminMessages = JSON.parse(localStorage.getItem('adminMessages')) || [];

    const saveAccounts = () => {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    };

    const saveMessages = () => {
        localStorage.setItem('adminMessages', JSON.stringify(adminMessages));
    };

    const registerButton = document.getElementById('register');
    const loginButton = document.getElementById('user-login');
    const adminLoginButton = document.getElementById('admin-login');
    const logoutButton = document.getElementById('logout');
    const welcomeMessage = document.getElementById('welcome-message');
    const accountBalance = document.getElementById('account-balance');
    const userInfo = document.querySelector('.user-info');
    const authButtons = document.querySelector('.auth-buttons');
    const giftMoneyButton = document.getElementById('gift-money');
    const contactForm = document.getElementById('contact-form');
    const messagesButton = document.getElementById('messages');
    const messageIndicator = document.getElementById('message-indicator');

    // Tạo nút xem tài khoản đã đăng ký
    const viewAccountsButton = document.createElement('button');
    viewAccountsButton.id = 'view-accounts';
    viewAccountsButton.textContent = 'Xem tài khoản đã đăng ký';
    viewAccountsButton.style.display = 'none';
    userInfo.appendChild(viewAccountsButton);

    const accountInfoButton = document.createElement('button');
    accountInfoButton.id = 'account-info';
    accountInfoButton.textContent = 'Thông tin tài khoản';
    accountInfoButton.style.display = 'none';
    userInfo.appendChild(accountInfoButton);

    const showUserInfo = (username, balance) => {
        welcomeMessage.textContent = `Xin chào, ${username}`;
        accountBalance.textContent = `Số dư: ${balance === Infinity ? 'Vô hạn' : `${balance} VND`}`;
        userInfo.style.display = 'block';
        authButtons.style.display = 'none';
        accountInfoButton.style.display = 'inline-block';
    };

    const hideUserInfo = () => {
        userInfo.style.display = 'none';
        authButtons.style.display = 'flex';
        accountInfoButton.style.display = 'none';
    };

    const showPurchaseModal = (username, password) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Thông Tin Gói</h2>
                <p><strong>Gói:</strong> ${username}</p>
                <p><strong>Thông Tin:</strong> ${password}</p>
                <button id="close-purchase-modal">Đóng</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-purchase-modal').addEventListener('click', () => {
            modal.remove();
        });
    };

    const showMessagesModal = () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';

        const messageList = adminMessages.map((msg, index) => `
            <div style="margin-bottom: 1rem; border-bottom: 1px solid #ddd; padding-bottom: 1rem;">
                <p><strong>Tin nhắn từ:</strong> ${msg.name}</p>
                <button data-index="${index}" class="view-message">Xem thư</button>
            </div>
        `).join('');

        modal.innerHTML = `
            <div class="modal-content">
                <h2>Hộp Thư</h2>
                <div>${messageList || '<p>Không có tin nhắn nào.</p>'}</div>
                <button id="close-messages-modal">Đóng</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-messages-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelectorAll('.view-message').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                modal.remove();
                showSingleMessageModal(adminMessages[index], index);
            });
        });
    };

    const showSingleMessageModal = (message, index) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Thư từ: ${message.name}</h2>
                <p><strong>Email:</strong> ${message.email}</p>
                <p><strong>Nội dung:</strong> ${message.message}</p>
                <button id="delete-message-modal">Xóa thư</button>
                <button id="close-single-message-modal">Đóng</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-single-message-modal').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('delete-message-modal').addEventListener('click', () => {
            adminMessages.splice(index, 1);
            saveMessages();
            modal.remove();
            alert('Thư đã được xóa!');
            if (adminMessages.length === 0) {
                messageIndicator.style.display = 'none';
            }
        });
    };

    const showAccountInfoModal = (account) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Thông tin tài khoản</h2>
                <p><strong>Tài khoản:</strong> ${account.username}</p>
                <p><strong>Số dư:</strong> ${account.balance === Infinity ? 'Vô hạn' : `${account.balance} VND`}</p>
                <button id="change-password">Đổi mật khẩu</button>
                <button id="close-account-info-modal">Đóng</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-account-info-modal').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('change-password').addEventListener('click', () => {
            modal.remove();
            showChangePasswordModal(account);
        });
    };

    const showChangePasswordModal = (account) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Đổi mật khẩu</h2>
                <form id="change-password-form">
                    <label for="old-password">Mật khẩu cũ:</label>
                    <input type="password" id="old-password" placeholder="Nhập mật khẩu cũ">
                    <label for="new-password">Mật khẩu mới:</label>
                    <input type="password" id="new-password" placeholder="Nhập mật khẩu mới">
                    <label for="confirm-password">Xác nhận mật khẩu:</label>
                    <input type="password" id="confirm-password" placeholder="Xác nhận mật khẩu mới">
                    <button type="button" id="submit-password-change">Xác nhận</button>
                    <button type="button" id="close-change-password-modal">Đóng</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-change-password-modal').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('submit-password-change').addEventListener('click', () => {
            const oldPassword = document.getElementById('old-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (oldPassword !== account.password) {
                alert('Mật khẩu cũ không đúng!');
                return;
            }

            if (newPassword !== confirmPassword) {
                alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
                return;
            }

            if (!newPassword) {
                alert('Mật khẩu mới không được để trống!');
                return;
            }

            account.password = newPassword;
            saveAccounts();
            alert('Đổi mật khẩu thành công!');
            modal.remove();
        });
    };

    accountInfoButton.addEventListener('click', () => {
        const loggedInUser = accounts.find(acc => `Xin chào, ${acc.username}` === welcomeMessage.textContent);
        if (loggedInUser) {
            showAccountInfoModal(loggedInUser);
        } else {
            alert('Không tìm thấy thông tin tài khoản!');
        }
    });

    const showRegisterModal = () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Đăng ký</h2>
                <form id="register-form">
                    <label for="register-username">Tên tài khoản:</label>
                    <input type="text" id="register-username" placeholder="Nhập tên tài khoản">
                    <label for="register-password">Mật khẩu:</label>
                    <input type="password" id="register-password" placeholder="Nhập mật khẩu">
                    <button type="button" id="submit-register">Đăng ký</button>
                    <button type="button" id="close-register-modal">Đóng</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-register-modal').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('submit-register').addEventListener('click', () => {
            const username = document.getElementById('register-username').value.trim();
            const password = document.getElementById('register-password').value.trim();

            if (!username || !password) {
                alert('Tên tài khoản và mật khẩu không được để trống!');
                return;
            }

            if (username === adminCredentials.username && password === adminCredentials.password) {
                alert('Không thể tạo tài khoản trùng với tài khoản admin!');
                return;
            }

            if (accounts.some(acc => acc.username === username)) {
                alert('Tài khoản đã tồn tại!');
                return;
            }

            accounts.push({ username, password, balance: 0 });
            saveAccounts();
            alert('Đăng ký thành công!');
            modal.remove();
        });
    };

    const showLoginModal = () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Đăng nhập</h2>
                <form id="login-form">
                    <label for="login-username">Tên tài khoản:</label>
                    <input type="text" id="login-username" placeholder="Nhập tên tài khoản">
                    <label for="login-password">Mật khẩu:</label>
                    <input type="password" id="login-password" placeholder="Nhập mật khẩu">
                    <button type="button" id="submit-login">Đăng nhập</button>
                    <button type="button" id="close-login-modal">Đóng</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-login-modal').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('submit-login').addEventListener('click', () => {
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();

            if (!username || !password) {
                alert('Tên tài khoản và mật khẩu không được để trống!');
                return;
            }

            const account = accounts.find(acc => acc.username === username && acc.password === password);

            if (account) {
                showUserInfo(account.username, account.balance);
                modal.remove();
            } else {
                alert('Sai tên tài khoản hoặc mật khẩu!');
            }
        });
    };

    registerButton.addEventListener('click', () => {
        showRegisterModal();
    });

    loginButton.addEventListener('click', () => {
        showLoginModal();
    });

    adminLoginButton.addEventListener('click', () => {
        const username = prompt('Nhập tên tài khoản admin:');
        const password = prompt('Nhập mật khẩu admin:');

        if (username === adminCredentials.username && password === adminCredentials.password) {
            showUserInfo(adminCredentials.username, adminCredentials.balance);
            giftMoneyButton.style.display = 'inline-block';
            messagesButton.style.display = 'inline-block';
            viewAccountsButton.style.display = 'inline-block';
            if (adminMessages.length > 0) {
                messageIndicator.style.display = 'block';
            }
        } else {
            alert('Sai tài khoản hoặc mật khẩu admin!');
        }
    });

    logoutButton.addEventListener('click', () => {
        hideUserInfo();
        alert('Đăng xuất thành công!');
        giftMoneyButton.style.display = 'none';
        messagesButton.style.display = 'none';
        viewAccountsButton.style.display = 'none';
        messageIndicator.style.display = 'none';
    });

    giftMoneyButton.addEventListener('click', () => {
        const targetUsername = prompt('Nhập tên tài khoản cần tặng tiền:');
        const amount = parseInt(prompt('Nhập số tiền cần tặng:'), 10);

        if (!targetUsername || isNaN(amount) || amount <= 0) {
            alert('Tên tài khoản hoặc số tiền không hợp lệ!');
            return;
        }

        const targetAccount = accounts.find(acc => acc.username === targetUsername);

        if (!targetAccount) {
            alert('Tài khoản không tồn tại!');
            return;
        }

        targetAccount.balance += amount;
        saveAccounts();
        alert(`Đã tặng ${amount} VND cho tài khoản ${targetUsername}.`);
    });

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        adminMessages.push({ name, email, message });
        saveMessages();
        messageIndicator.style.display = 'block';
        alert('Tin nhắn của bạn đã được gửi!');
        contactForm.reset();
    });

    messagesButton.addEventListener('click', () => {
        showMessagesModal();
    });

    accountList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Mua ngay') {
            const card = event.target.closest('.account-card');
            const username = card.querySelector('h3').textContent;
            const priceText = card.querySelector('p:nth-child(3)').textContent;
            const price = parseInt(priceText.replace(/\D/g, ''), 10);

            const loggedInUser = accounts.find(acc => `Xin chào, ${acc.username}` === welcomeMessage.textContent);

            if (!loggedInUser && welcomeMessage.textContent !== `Xin chào, ${adminCredentials.username}`) {
                alert('Bạn cần đăng nhập để mua tài khoản!');
                return;
            }

            if (welcomeMessage.textContent === `Xin chào, ${adminCredentials.username}`) {
                alert('Admin đã mua thành công!');
                showPurchaseModal(username, `Thông tin gói: ${priceText}`);
                return;
            }

            if (loggedInUser.balance < price) {
                alert('Số dư không đủ!');
                return;
            }

            loggedInUser.balance -= price;
            saveAccounts();

            let accountDetails;
            if (username === 'Gói 1') {
                accountDetails = { username: '500,000 VND', information: 'Anh y eim thật 100%, koo y ai khác thật lòng anh 100% đoá anh nói thật lòng rồi eim đừng cóa nói anh thích con khác nữa anh bùn... (đừng nói ai anh bị ngại hehe)' };
            } else if (username === 'Gói 2') {
                accountDetails = { username: '300,000 VND', information: 'C anh 15cm hehe' };
            } else if (username === 'Gói 3') {
                accountDetails = { username: '400,000 VND', information: 'baby mún gì' };
            }

            if (accountDetails) {
                alert(`Đã mua thành công! Số dư còn lại: ${loggedInUser.balance} VND.`);
                showPurchaseModal(accountDetails.username, accountDetails.information);
            }
        }
    });

    const sampleAccounts = [
        { username: 'Gói 1', rank: 'thật lòng', price: '500,000 VND' },
        { username: 'Gói 2', rank: 'bình thường', price: '300,000 VND' },
        { username: 'Gói 3', rank: 'quan trọng', price: '400,000 VND' }
    ];

    sampleAccounts.forEach(account => {
        const card = document.createElement('div');
        card.className = 'account-card';
        card.innerHTML = `
            <h3>${account.username}</h3>
            <p>Rank: ${account.rank}</p>
            <p>Giá: ${account.price}</p>
            <button>Mua ngay</button>
        `;
        accountList.appendChild(card);
    });

    const showAccountsModal = () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';

        const accountTable = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px;">Tài khoản</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Mật khẩu</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Số dư</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    ${accounts.map((acc, index) => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${acc.username}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${acc.password}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${acc.balance === Infinity ? 'Vô hạn' : `${acc.balance} VND`}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                                <button class="view-account" data-index="${index}" style="margin-right: 5px;">Xem</button>
                                <button class="delete-account" data-index="${index}">Xóa</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        modal.innerHTML = `
            <div class="modal-content">
                <h2>Danh sách tài khoản</h2>
                <div>${accounts.length > 0 ? accountTable : '<p>Không có tài khoản nào được đăng ký.</p>'}</div>
                <button id="close-accounts-modal">Đóng</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-accounts-modal').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelectorAll('.view-account').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                showAccountDetailsModal(accounts[index]);
            });
        });

        modal.querySelectorAll('.delete-account').forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                accounts.splice(index, 1);
                saveAccounts();
                modal.remove();
                alert('Tài khoản đã được xóa!');
                showAccountsModal();
            });
        });
    };

    const showAccountDetailsModal = (account) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Chi tiết tài khoản</h2>
                <p><strong>Tài khoản:</strong> ${account.username}</p>
                <p><strong>Mật khẩu:</strong> ${account.password}</p>
                <button id="close-account-details-modal">Đóng</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-account-details-modal').addEventListener('click', () => {
            modal.remove();
        });
    };

    viewAccountsButton.addEventListener('click', () => {
        showAccountsModal();
    });

    if (adminMessages.length === 0) {
        messageIndicator.style.display = 'none';
    }
});
