// Authentication functionality
class AuthManager {
    constructor() {
        this.user = this.getStoredUser();
        this.init();
    }

    init() {
        this.updateAuthUI();
        this.bindEvents();
    }

    bindEvents() {
        // Auth link in navigation
        const authLink = document.getElementById('auth-link');
        if (authLink) {
            authLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.user) {
                    this.logout();
                } else {
                    window.location.href = 'log.html';
                }
            });
        }

        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(e);
            });
        }

        // Auth tabs
        const authTabs = document.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchAuthTab(e.target.dataset.tab);
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    updateAuthUI() {
        const authLink = document.getElementById('auth-link');
        const loginRequired = document.getElementById('login-required');
        const workoutLogPage = document.getElementById('workout-log-page');
        const userName = document.getElementById('user-name');

        if (authLink) {
            authLink.textContent = this.user ? 'Logout' : 'Login';
        }

        if (loginRequired && workoutLogPage) {
            if (this.user) {
                loginRequired.style.display = 'none';
                workoutLogPage.style.display = 'block';
                if (userName) {
                    userName.textContent = this.user.name;
                }
            } else {
                loginRequired.style.display = 'block';
                workoutLogPage.style.display = 'none';
            }
        }
    }

    switchAuthTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update forms
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        document.getElementById(`${tab}-form`).classList.add('active');
    }

    async handleLogin(event) {
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            submitBtn.innerHTML = '<span>Logging in...</span><ion-icon name="refresh-outline"></ion-icon>';
            submitBtn.disabled = true;

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // For demo purposes, we'll use a simple local authentication
            // In a real app, this would make an API call to your backend
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                this.user = { id: user.id, name: user.name, email: user.email };
                localStorage.setItem('currentUser', JSON.stringify(this.user));
                
                submitBtn.innerHTML = '<span>Success!</span><ion-icon name="checkmark-outline"></ion-icon>';
                submitBtn.style.backgroundColor = '#28a745';
                
                setTimeout(() => {
                    this.updateAuthUI();
                    form.reset();
                }, 1000);
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            submitBtn.innerHTML = '<span>Error!</span><ion-icon name="close-outline"></ion-icon>';
            submitBtn.style.backgroundColor = '#dc3545';
            alert(error.message);
        } finally {
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 2000);
        }
    }

    async handleRegister(event) {
        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            submitBtn.innerHTML = '<span>Creating account...</span><ion-icon name="refresh-outline"></ion-icon>';
            submitBtn.disabled = true;

            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm').value;

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.email === email)) {
                throw new Error('User with this email already exists');
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Log the user in
            this.user = { id: newUser.id, name: newUser.name, email: newUser.email };
            localStorage.setItem('currentUser', JSON.stringify(this.user));

            submitBtn.innerHTML = '<span>Account created!</span><ion-icon name="checkmark-outline"></ion-icon>';
            submitBtn.style.backgroundColor = '#28a745';

            setTimeout(() => {
                this.updateAuthUI();
                form.reset();
            }, 1000);

        } catch (error) {
            submitBtn.innerHTML = '<span>Error!</span><ion-icon name="close-outline"></ion-icon>';
            submitBtn.style.backgroundColor = '#dc3545';
            alert(error.message);
        } finally {
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 2000);
        }
    }

    logout() {
        this.user = null;
        localStorage.removeItem('currentUser');
        this.updateAuthUI();
        
        // Redirect to home if on log page
        if (window.location.pathname.includes('log.html')) {
            window.location.href = 'index.html';
        }
    }

    getStoredUser() {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    }

    isAuthenticated() {
        return !!this.user;
    }

    getCurrentUser() {
        return this.user;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for use in other scripts
window.authManager = authManager;
