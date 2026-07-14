# Nikola Tesla - Premium Tribute Page

A highly polished, visually stunning, and responsive Tribute Page dedicated to the life, timeline, and achievements of **Nikola Tesla**. Developed as a Level 2 task for the **Oasis Infobyte Internship**.

---

## 🌟 Key Features

- **Hero Header Section**: Clean layout featuring a generated portrait of Tesla set against radial neon-glow spheres and scroll triggers.
- **Biography**: Four original narrative paragraphs covering Tesla's childhood, emigration to America, AC motor alliance with Westinghouse, wireless power ambitions, and legacy.
- **Interactive Chronological Timeline**: Vertical chronological path showing milestones from his birth in 1856 to his death in 1943. Uses alternating alignment on desktop viewports.
- **Achievements Cards Grid**: Micro-animating interactive cards that zoom, scale, and emit subtle glow shadows on cursor hover.
- **Famous Quotes Section**: An automated text rotator cycling through Tesla's quotes regarding frequency, energy, vibration, and future visions.
- **Footer**: Embedded quotes, contextual references, and internship project credits.
- **Responsive Mobile-First Architecture**: Uses CSS Flexbox, CSS Grid, and clamp typography to scale across mobile screens (320px) to ultra-wide desktop monitors.
- **Native Scroll-Reveal Animations**: Implements a native, zero-dependency `IntersectionObserver` script to fade-in and slide content dynamically as the user scrolls.

---

## 🎨 Design System

- **Dual Typography**:
  - Headings: `Playfair Display` (serif, providing a classical historical weight).
  - Body Copy: `Plus Jakarta Sans` (sans-serif, offering modern, readable, tech-aligned shapes).
- **Dark Neon Palette**:
  - Base Backgrounds: `#07080b` (deep space black) and `#11141e` (slate-blue cards).
  - Accent Color: `#00e5ff` (electric cyan representing sparks and AC energy).
  - Sub-Accent Color: `#9c27b0` (deep high-voltage violet).

---

## 📁 Project Structure

```text
WebDev-L2-tribute-page/
│
├── index.html          # Main HTML structure, inline scripts, & SVGs
├── README.md           # Documentation
│
├── css/
│   └── style.css       # Layouts, variables, timeline lines, and animations
│
└── assets/
    └── tesla.png       # Generated vintage artistic portrait of Nikola Tesla
```

---

## ⚙️ Implementation Highlights

### 🚀 Zero-Dependency Scroll Reveal
Rather than importing external script bundles, scroll reveals are handled by a lightweight browser observer:
```javascript
const revealElements = document.querySelectorAll('.scroll-reveal');
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Offload DOM watching
        }
    });
}, { threshold: 0.12 });
revealElements.forEach(el => observer.observe(el));
```
Coupled with CSS transitions, elements slide upward when scrolled into view. On desktop screen sizes, the timeline blocks alternate and slide in from the left and right margins respectively.

---

## 🚀 How to Run the Project

1. Clone or download the repository workspace.
2. Open `WebDev-L2-tribute-page/index.html` directly in any modern web browser.
3. Or launch using any local web development server (e.g. live-server).

---

## 📄 License
This project is licensed under the MIT License.
