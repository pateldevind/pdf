// Authentication state management
let currentUser = null;

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetch('/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                updateAuthState(data);
            } else {
                localStorage.removeItem('token');
                showAuthButtons();
            }
        })
        .catch(() => {
            localStorage.removeItem('token');
            showAuthButtons();
        });
    }
});

// Show login modal
function showLoginForm() {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    const forgotPasswordModal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
    if (forgotPasswordModal) {
        forgotPasswordModal.hide();
    }
    loginModal.show();
}

// Show forgot password modal
function showForgotPasswordForm() {
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    const forgotPasswordModal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
    if (loginModal) {
        loginModal.hide();
    }
    forgotPasswordModal.show();
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const errorDiv = document.getElementById('loginError');

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, rememberMe })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            updateAuthState(data.user);
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            loginModal.hide();
            document.getElementById('loginForm').reset();
            errorDiv.classList.add('d-none');
        } else {
            errorDiv.textContent = data.message || 'Login failed';
            errorDiv.classList.remove('d-none');
        }
    } catch (error) {
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.classList.remove('d-none');
    }
}

// Handle forgot password form submission
async function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('resetEmail').value;
    const errorDiv = document.getElementById('resetError');
    const successDiv = document.getElementById('resetSuccess');

    try {
        const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            errorDiv.classList.add('d-none');
            successDiv.textContent = 'Password reset link has been sent to your email.';
            successDiv.classList.remove('d-none');
            document.getElementById('forgotPasswordForm').reset();
        } else {
            successDiv.classList.add('d-none');
            errorDiv.textContent = data.message || 'Failed to send reset link';
            errorDiv.classList.remove('d-none');
        }
    } catch (error) {
        successDiv.classList.add('d-none');
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.classList.remove('d-none');
    }
}

// Handle logout
function logout() {
    fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .finally(() => {
        localStorage.removeItem('token');
        currentUser = null;
        showAuthButtons();
        window.location.href = '/';
    });
}

// Update authentication state
function updateAuthState(user) {
    currentUser = user;
    document.getElementById('authButtons').classList.add('d-none');
    const userMenu = document.getElementById('userMenu');
    userMenu.classList.remove('d-none');
    userMenu.classList.add('d-flex');
    document.getElementById('userFullName').textContent = `${user.first_name} ${user.last_name}`;
}

// Show authentication buttons
function showAuthButtons() {
    document.getElementById('authButtons').classList.remove('d-none');
    const userMenu = document.getElementById('userMenu');
    userMenu.classList.add('d-none');
    userMenu.classList.remove('d-flex');
} 