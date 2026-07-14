# Oasis Infobyte Web Development Internship (OIBSIP)

Welcome to my submission repository for the **Oasis Infobyte Web Development Internship**. This repository contains four production-ready Level 2 projects built using HTML5, CSS3, and Vanilla JavaScript, following clean, semantic, and modern engineering standards.

---

## 📂 Repository Project Structure

This repository is organized into distinct subdirectories, each containing a standalone web application complete with its own assets, stylesheets, scripts, and documentation:

```text
OIBSIP-/
│
├── README.md                                    # Main repository index (This file)
│
├── WebDev-L2-calculator/                        # Task 1: Calculator
│   ├── index.html
│   ├── css/style.css
│   └── js/script.js
│
├── WebDev-L2-tribute-page/                      # Task 2: Tribute Page
│   ├── index.html
│   ├── css/style.css
│   └── assets/tesla.png
│
├── WebDev-L2-todo-app/                          # Task 3: To-Do App
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
│
└── WebDev-L2-LoginAuthentication-system/       # Task 4: Login Auth System
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── profile.html
    ├── css/style.css
    └── js/ (auth.js, ui.js, app.js)
```

---

## 🛠️ Projects Summary

Here is an overview of the four projects completed during the internship:

### 1. 🧮 NeuraCalc - Premium Glassmorphic Calculator
* **Directory**: [`WebDev-L2-calculator/`](file:///e:/Iternship/OIBSIP-/WebDev-L2-calculator)
* **Summary**: A modern calculator styled with a premium translucent Glassmorphism layout. It avoids standard execution vulnerabilities by implementing a **custom safe mathematical tokenizer/parser** rather than using `eval()`.
* **Key Features**:
  - Full operator precedence resolution (`*` & `/` computed before `+` & `-`).
  - Real-time Web Audio API synthesizer generating click sounds procedurally.
  - Interactive slide-out calculation history drawer synced with `localStorage`.
  - Copy-to-clipboard button with visual screen overlays.
  - Seamless dark/light mode toggle.

### ⚡ 2. Nikola Tesla Tribute Page
* **Directory**: [`WebDev-L2-tribute-page/`](file:///e:/Iternship/OIBSIP-/WebDev-L2-tribute-page)
* **Summary**: A gorgeous, mobile-first biography and chronicle detailing the life of the master of lightning, Nikola Tesla. Designed with contrasting carbon slate and electric neon gradients.
* **Key Features**:
  - Alternating responsive vertical timeline of historical milestones.
  - Interactive achievement cards that scale and emit glows on cursor hover.
  - Automated quotes rotator slider.
  - High-quality visionary portrait of Nikola Tesla.
  - Zero-dependency scroll fade-in animations driven by the browser's native `IntersectionObserver` API.

### 📋 3. TaskFlow - Advanced To-Do Dashboard
* **Directory**: [`WebDev-L2-todo-app/`](file:///e:/Iternship/OIBSIP-/WebDev-L2-todo-app)
* **Summary**: A comprehensive dashboard-style task organizer designed to streamline schedules. It integrates full data-filtering queries and drag-and-drop sequencing.
* **Key Features**:
  - Live task counters (Total, Pending, Completed) alongside a dynamic progress percentage loader.
  - Real-time search, filters (by status, category emoji tags, and priority levels), and sorting options.
  - Native HTML5 Drag and Drop support to reorder tasks manually.
  - Overdue deadlines highlighting (triggers warnings for pending, past-due tasks).
  - Custom modals and corner toast alert containers.
  - JSON Backup Export and Import utilities using `FileReader`.

### 🔐 4. Secure Modular Login Authentication System
* **Directory**: [`WebDev-L2-LoginAuthentication-system/`](file:///e:/Iternship/OIBSIP-/WebDev-L2-LoginAuthentication-system)
* **Summary**: A modular client-side authentication system utilizing `localStorage` to mock an interactive user database, featuring strict route protection and secure password management.
* **Key Features**:
  - Non-flicker head-level route guards redirecting unauthorized visitors instantly.
  - Password hashing via native, asynchronous **SHA-256 subtle cryptographic digests**.
  - Dynamic segmented password strength meter and text indicators.
  - Toggle-buttons to show/hide hidden password fields.
  - Profile setting updates (modifying names, bios) and secure credential modifications (verifying current password before changing).
  - Remember Me token persistence toggled between `localStorage` (persistent) and `sessionStorage` (tab-bound).

---

## 🚀 How to Run the Projects

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/OIBSIP-.git
   cd OIBSIP-
   ```
2. **Launch Pages**:
   - Because these are static websites using standard assets and modular scripts, you can open any of the following main files directly in your web browser:
     - **Calculator**: [WebDev-L2-calculator/index.html]
     - **Tribute Page**: [WebDev-L2-tribute-page/index.html]
     - **To-Do App**: [WebDev-L2-todo-app/index.html]
     - **Auth System**: [WebDev-L2-LoginAuthentication-system/login.html]
   - Alternatively, serve the repository folder using a local web server (e.g. VS Code Live Server) to ensure path resolutions work seamlessly.

---

## 📄 License
All projects in this repository are licensed under the MIT License.