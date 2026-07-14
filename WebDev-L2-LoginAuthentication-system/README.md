# Secure Modular Login Authentication System

A responsive, production-ready, and highly secure user authentication dashboard built using HTML5, CSS3, and modular Vanilla JavaScript. Developed as a Level 2 task for the **Oasis Infobyte Internship**.

---

## 🌟 Key Features

### 🔐 Core Security & Authentication
- **Secure Register & Login**: Interactive flows using standard form inputs.
- **Strict Route Protection**: Instant head-level redirection blocks unauthenticated users from accessing private routes (`dashboard.html`, `profile.html`), and redirects authenticated users away from landing forms (`login.html`, `register.html`).
- **Cryptographic Hashing (SHA-256)**: Safe password storage using the browser's native **SubtleCrypto API**. **Zero usage of dangerous `eval()` statement**.
- **Email Duplicate Check**: Queries the registration database in real-time, blocking duplicate signups.
- **Robust Validation**: Implements client-side checks for empty fields, email syntax, matching confirm inputs, and minimum length requirements.
- **Profile Customization**: Dashboard interface to edit account profiles (Name, Bio) and update credentials (Current Password validation + New Password updates).

### ⚡ Extended Premium Features
- **Remember Me Functionality**: Syncs authentication sessions to `localStorage` (persistent) if checked, or `sessionStorage` (tab-bound) if unchecked.
- **Interactive Password Strength Meter**: Segmented bar dynamically scoring password complexity based on length, cases, numbers, and symbols.
- **Password visibility togglers**: Integrated eye icons next to password fields to reveal/hide characters.
- **Micro Loading Animations**: Displays inline spin loaders inside buttons to verify submissions.
- **Theme Switcher Toggle**: Responsive transitions between Light and Dark mode options.
- **Toasts Notification Portal**: Color-coded overlay prompts indicating status changes.

---

## 📁 Project Structure

```text
WebDev-L2-LoginAuthentication-system/
│
├── login.html              # Login access gate & public route guard
├── register.html           # Registration form & password complexity indicators
├── dashboard.html          # Secure landing area & private route guard
├── profile.html            # User account settings, name, bio, and password changer
├── README.md               # Project documentation
│
├── css/
│   └── style.css           # Forms, layouts, loaders, sliders, scrollbars, & theme sets
│
└── js/
    ├── auth.js             # Cryptographic engine, session storage, databases
    ├── ui.js               # Toast notifications, strength scores, visibility toggles
    └── app.js              # Module binder triggering events and submission loaders
```

---

## ⚙️ Technical Highlights

### 🛡️ Preventing Content Leaks (Anti-Flicker Guard)
To prevent "flickering" where private data briefly flashes on screen before a script redirects, pages run an inline, self-executing redirect script immediately in the `<head>` tag before DOM loading begins:
```javascript
(function() {
    const session = localStorage.getItem('auth_session') || sessionStorage.getItem('auth_session');
    if (!session) {
        window.location.replace('login.html');
    }
})();
```

### 🔑 Cryptographic Hashing
To secure credentials, we use the browser's native subtle crypto engine, bypassing external libraries:
```javascript
export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}
```

---

## 🚀 How to Run the Project

1. Clone or download the repository workspace.
2. Open `WebDev-L2-LoginAuthentication-system/login.html` directly in any modern web browser.
3. Or launch using any local web development server (e.g. live-server).

---

## 📄 License
This project is licensed under the MIT License.
