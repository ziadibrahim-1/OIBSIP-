/* ==========================================================================
   AuthSystem Modular UI View Utilities
   Oasis Infobyte Internship - Login Authentication System
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Toast Notifications System
// --------------------------------------------------------------------------
export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-alert ${type}`;
    
    let iconMarkup = '';
    switch (type) {
        case 'success':
            iconMarkup = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
            break;
        case 'danger':
        case 'warning':
            iconMarkup = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
            break;
        default: // info
            iconMarkup = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;
    }

    toast.innerHTML = `
        <span class="toast-icon">${iconMarkup}</span>
        <span class="toast-text">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Animate out and remove from DOM
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2800);
}

// --------------------------------------------------------------------------
// 2. Password Strength Evaluation Meter
// --------------------------------------------------------------------------
export function evaluatePasswordStrength(password) {
    let score = 0;
    if (!password) return { score, label: 'Password Strength' };

    // Strength Criteria
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = 'Weak';
    let className = 'strength-weak';

    if (score === 5) {
        label = 'Excellent';
        className = 'strength-excellent';
    } else if (score === 4) {
        label = 'Strong';
        className = 'strength-strong';
    } else if (score === 3) {
        label = 'Good';
        className = 'strength-good';
    } else if (score === 2) {
        label = 'Fair';
        className = 'strength-fair';
    }

    return { score, label, className };
}

export function updateStrengthMeter(inputVal, containerEl, textEl) {
    if (!containerEl || !textEl) return;
    
    // Clear existing strength classes
    containerEl.className = 'strength-meter-container';
    
    if (inputVal === '') {
        textEl.textContent = 'Password Strength';
        return;
    }

    const strength = evaluatePasswordStrength(inputVal);
    containerEl.classList.add(strength.className);
    textEl.textContent = `Strength: ${strength.label}`;
}

// --------------------------------------------------------------------------
// 3. Password Visibility Show/Hide Toggler
// --------------------------------------------------------------------------
export function setupPasswordToggle(toggleButton) {
    if (!toggleButton) return;

    toggleButton.addEventListener('click', () => {
        const input = toggleButton.previousElementSibling;
        const eyeIcon = toggleButton.querySelector('.eye-icon');
        const eyeOffIcon = toggleButton.querySelector('.eye-off-icon');

        if (input.type === 'password') {
            input.type = 'text';
            eyeIcon.classList.add('hidden');
            eyeOffIcon.classList.remove('hidden');
            toggleButton.title = 'Hide password';
        } else {
            input.type = 'password';
            eyeIcon.classList.remove('hidden');
            eyeOffIcon.classList.add('hidden');
            toggleButton.title = 'Show password';
        }
    });
}

// --------------------------------------------------------------------------
// 4. Global Page Theme Controller
// --------------------------------------------------------------------------
export function syncPageTheme() {
    const savedTheme = localStorage.getItem('auth_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Bind Theme Button
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    updateThemeBtnIcons(themeBtn, savedTheme);

    // Click handler override
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('auth_theme', nextTheme);
        updateThemeBtnIcons(themeBtn, nextTheme);
        showToast(`Theme changed to ${nextTheme} mode!`, 'info');
    });
}

function updateThemeBtnIcons(btn, theme) {
    const sunIcon = btn.querySelector('.sun-icon');
    const moonIcon = btn.querySelector('.moon-icon');
    if (!sunIcon || !moonIcon) return;
    
    if (theme === 'dark') {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}
