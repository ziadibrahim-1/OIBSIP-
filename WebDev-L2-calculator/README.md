# NeuraCalc - Premium Glassmorphic Web Calculator

A gorgeous, production-ready, highly interactive glassmorphic web calculator built using HTML5, CSS3, and Vanilla JavaScript. Developed as a Level 2 task for the **Oasis Infobyte Internship**.

---

## 🌟 Key Features

### 🧮 Core Calculator Features
- **Precise Evaluation**: Complete arithmetic operations supporting Addition, Subtraction, Multiplication, and Division.
- **Operator Precedence**: Correctly evaluates sequential operations mathematically (e.g., `5 + 3 * 2` equals `11` instead of `16`).
- **Safety First**: Implements a custom mathematical expression parser and tokenizer. **Zero usage of dangerous `eval()` statement**.
- **Division by Zero Protection**: Gracefully catches and reports division by zero with a friendly `"Cannot divide by zero"` error.
- **Backspace & Clear Controls**: Dedicated keys for deleting single characters or resetting states.
- **Percentage Operator**: Convert numbers immediately to percentage decimal values.

### ✨ Extended Premium Features
- **Aesthetics & Theme Toggle**: Glassmorphic frosted panels, neon accents, floating animated backdrops, and seamless transitions between Dark and Light mode.
- **Calculation History Panel**: Slide-out panel preserving up to 20 past calculations. Click any history entry to immediately load its result back onto the display screen. Stored locally via `localStorage`.
- **Sound Feedback Toggle**: Real-time auditory UI feedback synthesized procedurally using the browser's **Web Audio API** (no bulky audio assets required!).
- **Copy-to-Clipboard**: Quick copy button inside the display grid to capture values with a custom animated overlay feedback indicator.
- **Full Keyboard Support**: Seamlessly operate using numeric keys, decimal point, standard operational characters, backspace, escape, and enter.

---

## 🎹 Keyboard Shortcuts

The calculator supports natural inputs from standard layouts or numeric keypads:

| Key | Calculator Function |
| :--- | :--- |
| `0` - `9` | Digits |
| `.` or `,` | Decimal Point |
| `+` | Addition |
| `-` | Subtraction |
| `*` or `x` | Multiplication |
| `/` | Division |
| `%` | Percentage |
| `Enter` or `=` | Calculate / Equals |
| `Backspace` | Delete last input |
| `Escape` or `c` / `C` | Clear screen |

---

## 📁 Project Structure

```text
WebDev-L2-calculator/
│
├── index.html          # Main HTML structure & SVG Icons
├── README.md           # Documentation
├── LICENSE             # MIT License
├── .gitignore          # File inclusions configuration
│
├── css/
│   └── style.css       # Core Design system, variables, layouts, animations
│
└── js/
    └── script.js       # Parser, sound synth, history, listeners & theme state
```

---

## ⚙️ Technical Details

### 🛡️ Custom Math Parser
To eliminate security vulnerabilities, `NeuraCalc` implements an custom arithmetic parser in [script.js](js/script.js):
1. **Tokenization**: Regular expression breaks string expressions into discrete numeric values and operational symbol arrays.
2. **Intermediate Negative Resolution**: Detects negative signs versus operators based on neighboring context.
3. **Execution Precedence**: Scans and splices operations in mathematical precedence order (Multiplication & Division first, then Addition & Subtraction).
4. **Rounding Accuracy**: Prevents standard floating-point calculation errors (such as `0.1 + 0.2 = 0.30000000000000004`) by auto-rounding outputs to 12 decimal places.

### 🔊 Procedural Click Synthesizer
Rather than loading static `.mp3` or `.wav` click assets (which introduce HTTP requests, latency, and load errors), the application utilizes the browser's built-in **Web Audio API**:
- An oscillator plays a clean `sine` wave sliding down from `800Hz` to `150Hz` over `80ms` for default click sounds.
- Double-note chime notes trigger on successful calculations, and deep `sawtooth` waves indicate syntax warnings.

---

## 🚀 How to Run the Project

1. Clone or download the repository workspace.
2. Open `WebDev-L2-calculator/index.html` directly in any modern web browser.
3. Run with live server in your browser.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
