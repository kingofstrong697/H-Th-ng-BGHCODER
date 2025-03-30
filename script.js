document.addEventListener('DOMContentLoaded', () => {
    const accountList = document.getElementById('account-list');
    const adminCredentials = { username: 'BGHCODER', password: '141112', balance: Infinity };

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    const saveAccounts = () => {
        localStorage.setItem('accounts', JSON.stringify(accounts));
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
    const adminMessages = JSON.parse(localStorage.getItem('adminMessages')) || [];

    const saveMessages = () => {
        localStorage.setItem('adminMessages', JSON.stringify(adminMessages));
    };

    const showUserInfo = (username, balance) => {
        welcomeMessage.textContent = `Xin chào cái lồn, ${username}`;
        accountBalance.textContent = `Số dư: ${balance === Infinity ? 'Vô hạn' : `${balance} VND`}`;
        userInfo.style.display = 'block';
        authButtons.style.display = 'none';
    };

    const hideUserInfo = () => {
        userInfo.style.display = 'none';
        authButtons.style.display = 'flex';
    };

    const showPurchaseModal = (username, password) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Thông Tin Bí Mật</h2>
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

    registerButton.addEventListener('click', () => {
        const username = prompt('Nhập tên tài khoản:');
        const password = prompt('Nhập mật khẩu:');

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
    });

    loginButton.addEventListener('click', () => {
        const username = prompt('Nhập tên tài khoản:');
        const password = prompt('Nhập mật khẩu:');

        if (!username || !password) {
            alert('Tên tài khoản và mật khẩu không được để trống!');
            return;
        }

        if (username === adminCredentials.username && password === adminCredentials.password) {
            alert('Tài khoản không tồn tại!');
            return;
        }

        const account = accounts.find(acc => acc.username === username && acc.password === password);

        if (account) {
            showUserInfo(account.username, account.balance);
        } else {
            alert('Sai tên tài khoản hoặc mật khẩu!');
        }
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

            const loggedInUser = accounts.find(acc => acc.username === welcomeMessage.textContent.split(', ')[1]);

            if (!loggedInUser) {
                alert('Bạn cần đăng nhập để mua tài khoản!');
                return;
            }

            if (loggedInUser.balance < price) {
                alert('Số dư không đủ!');
                return;
            }

            loggedInUser.balance -= price;
            saveAccounts();

            let accountDetails;
            if (username === 'Bí Mật 1') {
                accountDetails = { username: '500,000 VND', information: 'Anh y eim thật 100%, koo y ai khác thật lòng anh 100% đoá anh nói thật lòng rồi eim đừng cóa nói anh thích con khác nữa anh bùn... (đừng nói ai anh bị ngại hehe)' };
            } else if (username === 'Bí Mật 2') {
                accountDetails = { username: '300,000 VND', information: 'C anh 15cm hehe' };
            } else if (username === 'Bí Mật 3') {
                accountDetails = { username: '400,000 VND', information: 'baby mún gì' };
            }

            if (accountDetails) {
                alert(`Đã mua thành công! Số dư còn lại: ${loggedInUser.balance} VND.`);
                showPurchaseModal(accountDetails.username, accountDetails.information);
            }
        }
    });

    // Hiển thị danh sách tài khoản mẫu
    const sampleAccounts = [
        { username: 'Bí Mật 1', rank: 'thật lòng', price: '500,000 VND' },
        { username: 'Bí Mật 2', rank: 'bình thường', price: '300,000 VND' },
        { username: 'Bí Mật 3', rank: 'quan trọng', price: '400,000 VND' }
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

    const viewAccountsButton = document.createElement('button');
    viewAccountsButton.id = 'view-accounts';
    viewAccountsButton.textContent = 'Xem tài khoản đã đăng ký';
    viewAccountsButton.style.display = 'none';
    userInfo.appendChild(viewAccountsButton);

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
                        <th style="border: 1px solid #ddd; padding: 8px;">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    ${accounts.map((acc, index) => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${acc.username}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${acc.password}</td>
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
