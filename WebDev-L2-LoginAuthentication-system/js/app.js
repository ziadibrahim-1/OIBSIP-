/* ==========================================================================
   AuthSystem Main Controller Script
   Oasis Infobyte Internship - Login Authentication System
   ========================================================================== */

import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    getCurrentSession, 
    getAuthenticatedUserRecord, 
    updateProfileInfo, 
    updatePassword 
} from './auth.js';

import { 
    showToast, 
    updateStrengthMeter, 
    setupPasswordToggle, 
    syncPageTheme 
} from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Page Theme Synchronization
    syncPageTheme();

    // 2. Setup Password Visibilities Show/Hide Toggles
    const toggleBtns = document.querySelectorAll('.btn-toggle-password');
    toggleBtns.forEach(btn => setupPasswordToggle(btn));

    // ----------------------------------------------------------------------
    // 3. Login Page Controller
    // ----------------------------------------------------------------------
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('login-remember').checked;
            
            const submitBtn = loginForm.querySelector('.btn-submit');
            
            // Trigger Loading state
            setButtonLoading(submitBtn, true);

            // Delay 1200ms to mock secure cryptographic network validation
            setTimeout(async () => {
                try {
                    const session = await loginUser(email, password, rememberMe);
                    showToast(`Logged in successfully! Welcome, ${session.name}.`, 'success');
                    
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.replace('dashboard.html');
                    }, 800);
                } catch (error) {
                    setButtonLoading(submitBtn, false);
                    showToast(error.message, 'danger');
                }
            }, 1200);
        });
    }

    // ----------------------------------------------------------------------
    // 4. Registration Page Controller
    // ----------------------------------------------------------------------
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const passwordInput = document.getElementById('reg-password');
        const confirmInput = document.getElementById('reg-confirm');
        const strengthMeterContainer = document.querySelector('.strength-meter-container');
        const strengthText = document.getElementById('strength-text');

        // Real-time password strength update
        passwordInput.addEventListener('input', () => {
            updateStrengthMeter(passwordInput.value, strengthMeterContainer, strengthText);
        });

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = passwordInput.value;
            const confirmPassword = confirmInput.value;
            
            const submitBtn = registerForm.querySelector('.btn-submit');

            // Form validations
            if (password.length < 8) {
                showToast('Password must be at least 8 characters long.', 'warning');
                return;
            }

            if (password !== confirmPassword) {
                showToast('Passwords do not match.', 'danger');
                return;
            }

            // Trigger Loading state
            setButtonLoading(submitBtn, true);

            // Delay 1200ms to mock hashing and storage write latency
            setTimeout(async () => {
                try {
                    await registerUser(name, email, password);
                    showToast('Account registered successfully! Redirecting...', 'success');
                    
                    // Redirect to login page
                    setTimeout(() => {
                        window.location.replace('login.html');
                    }, 1200);
                } catch (error) {
                    setButtonLoading(submitBtn, false);
                    showToast(error.message, 'danger');
                }
            }, 1200);
        });
    }

    // ----------------------------------------------------------------------
    // 5. Secure Dashboard Page Controller
    // ----------------------------------------------------------------------
    const userDisplayName = document.getElementById('user-display-name');
    if (userDisplayName) {
        const session = getCurrentSession();
        const userRecord = getAuthenticatedUserRecord();

        if (session && userRecord) {
            userDisplayName.textContent = userRecord.name;
            document.getElementById('user-display-email').textContent = userRecord.email;
            document.getElementById('session-display-token').textContent = session.token;
            document.getElementById('session-remember-state').textContent = session.remember ? 'Yes (Persistent Cookie)' : 'No (Session Cookie)';
        }
    }

    // Bind Logout Buttons
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showToast('Signing out...', 'info');
            setTimeout(() => {
                logoutUser();
            }, 500);
        });
    }

    // ----------------------------------------------------------------------
    // 6. Secure Profile Settings Controller
    // ----------------------------------------------------------------------
    const profileInfoForm = document.getElementById('profile-info-form');
    if (profileInfoForm) {
        const userRecord = getAuthenticatedUserRecord();
        const profNameInput = document.getElementById('prof-name');
        const profBioInput = document.getElementById('prof-bio');

        // Populate form data
        if (userRecord) {
            profNameInput.value = userRecord.name;
            profBioInput.value = userRecord.bio || '';
        }

        profileInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = profNameInput.value;
            const bio = profBioInput.value;
            const submitBtn = profileInfoForm.querySelector('button[type="submit"]');

            setButtonLoading(submitBtn, true);

            setTimeout(() => {
                try {
                    updateProfileInfo(name, bio);
                    setButtonLoading(submitBtn, false);
                    showToast('Profile details updated successfully!', 'success');
                } catch (error) {
                    setButtonLoading(submitBtn, false);
                    showToast(error.message, 'danger');
                }
            }, 1000);
        });
    }

    // Password change form logic
    const profilePasswordForm = document.getElementById('profile-password-form');
    if (profilePasswordForm) {
        const passNewInput = document.getElementById('pass-new');
        const passConfirmInput = document.getElementById('pass-confirm');
        const strengthMeterContainer = document.querySelector('.strength-meter-container');
        const strengthText = document.getElementById('strength-text');

        // Real-time strength update
        passNewInput.addEventListener('input', () => {
            updateStrengthMeter(passNewInput.value, strengthMeterContainer, strengthText);
        });

        profilePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const oldPassword = document.getElementById('pass-old').value;
            const newPassword = passNewInput.value;
            const confirmPassword = passConfirmInput.value;
            const submitBtn = profilePasswordForm.querySelector('button[type="submit"]');

            if (newPassword.length < 8) {
                showToast('New password must be at least 8 characters.', 'warning');
                return;
            }

            if (newPassword !== confirmPassword) {
                showToast('New passwords do not match.', 'danger');
                return;
            }

            setButtonLoading(submitBtn, true);

            setTimeout(async () => {
                try {
                    await updatePassword(oldPassword, newPassword);
                    setButtonLoading(submitBtn, false);
                    profilePasswordForm.reset();
                    // Reset strength meter display
                    updateStrengthMeter('', strengthMeterContainer, strengthText);
                    showToast('Password changed successfully!', 'success');
                } catch (error) {
                    setButtonLoading(submitBtn, false);
                    showToast(error.message, 'danger');
                }
            }, 1200);
        });
    }

    // ----------------------------------------------------------------------
    // 7. General Helper Functions
    // ----------------------------------------------------------------------
    function setButtonLoading(button, isLoading) {
        if (!button) return;
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        if (isLoading) {
            button.disabled = true;
            if (btnText) btnText.classList.add('hidden');
            if (btnLoader) btnLoader.classList.remove('hidden');
        } else {
            button.disabled = false;
            if (btnText) btnText.classList.remove('hidden');
            if (btnLoader) btnLoader.classList.add('hidden');
        }
    }
});
