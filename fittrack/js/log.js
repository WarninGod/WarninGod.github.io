/**
 * Simple Tab Switching Function
 */
function switchTab(tabName) {
    
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    
    event.target.classList.add('active');
    
    
    document.getElementById(tabName + '-form').classList.add('active');
}

/**
 * Simple Authentication System
 */
class SimpleAuth {
    constructor() {
        this.currentUser = this.getStoredUser();
        this.init();
    }

    init() {
        this.updateAuthState();
        this.setupForms();
    }

    setupForms() {
        
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (email && password) {
            
            const user = {
                name: email.split('@')[0], 
                email: email
            };
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser = user;
            this.updateAuthState();
            this.showSuccess('Login successful!');
        } else {
            this.showError('Please fill in all fields');
        }
    }

    handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        if (name && email && password && confirmPassword) {
            if (password === confirmPassword) {
                const user = {
                    name: name,
                    email: email
                };
                
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUser = user;
                this.updateAuthState();
                this.showSuccess('Account created successfully!');
            } else {
                this.showError('Passwords do not match');
            }
        } else {
            this.showError('Please fill in all fields');
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.updateAuthState();
        this.showSuccess('Logged out successfully');
    }

    updateAuthState() {
        const authSection = document.getElementById('auth-section');
        const workoutDashboard = document.getElementById('workout-dashboard');
        const authLink = document.getElementById('auth-link');
        const userName = document.getElementById('user-name');

        if (this.currentUser) {
            
            if (authSection) authSection.style.display = 'none';
            if (workoutDashboard) workoutDashboard.style.display = 'block';
            if (authLink) authLink.textContent = 'Logout';
            if (userName) userName.textContent = this.currentUser.name;
        } else {
            
            if (authSection) authSection.style.display = 'block';
            if (workoutDashboard) workoutDashboard.style.display = 'none';
            if (authLink) authLink.textContent = 'Login';
        }
    }

    getStoredUser() {
        const stored = localStorage.getItem('currentUser');
        return stored ? JSON.parse(stored) : null;
    }

    showSuccess(message) {
        const successEl = document.getElementById('success-message');
        if (successEl) {
            successEl.textContent = message;
            successEl.style.display = 'block';
            setTimeout(() => successEl.style.display = 'none', 3000);
        }
    }

    showError(message) {
        const errorEl = document.getElementById('error-message');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
            setTimeout(() => errorEl.style.display = 'none', 3000);
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    window.auth = new SimpleAuth();
});


window.switchTab = switchTab;
