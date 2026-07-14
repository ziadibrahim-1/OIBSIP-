/* ==========================================================================
   NeuraCalc Calculator Script
   Oasis Infobyte Internship Project - Calculator
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Core State variables
    // ----------------------------------------------------------------------
    let currentInput = '0';      // The active number string being typed
    let expression = '';        // The running mathematical expression
    let isCalculated = false;    // If equals (=) was just pressed
    let isError = false;         // If calculator is in an error state
    let soundEnabled = true;     // Audio feedback enabled state
    let audioCtx = null;         // Web Audio Context (lazy loaded)

    // Max display characters before adjusting font size
    const MAX_FONT_CHARS = 10;

    // ----------------------------------------------------------------------
    // 2. DOM Selectors
    // ----------------------------------------------------------------------
    const expressionEl = document.getElementById('expression');
    const resultEl = document.getElementById('result');
    const toastEl = document.getElementById('toast');
    
    // Toggles & Control Elements
    const soundToggle = document.getElementById('sound-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const historyToggle = document.getElementById('history-toggle');
    const closeHistory = document.getElementById('close-history');
    const clearHistoryBtn = document.getElementById('clear-history');
    const historyPanel = document.getElementById('history-panel');
    const historyList = document.getElementById('history-list');
    
    // Keypad Key Group
    const buttons = document.querySelectorAll('.btn');

    // ----------------------------------------------------------------------
    // 3. Audio Click Synthesizer (Web Audio API)
    // ----------------------------------------------------------------------
    function playTone(freq, type, duration, gainStart) {
        if (!soundEnabled) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            
            // Fade out smoothly
            gainNode.gain.setValueAtTime(gainStart, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.warn('Audio Context initialization blocked or unsupported:', e);
        }
    }

    function playClickSound(actionType) {
        switch (actionType) {
            case 'clear':
                playTone(400, 'sine', 0.15, 0.08);
                break;
            case 'operator':
                playTone(600, 'triangle', 0.1, 0.05);
                break;
            case 'equals':
                // Retro double-tone chime
                playTone(523.25, 'sine', 0.12, 0.06); // C5
                setTimeout(() => playTone(659.25, 'sine', 0.15, 0.05), 60); // E5
                break;
            case 'error':
                playTone(180, 'sawtooth', 0.25, 0.08); // low buzz
                break;
            default: // numbers and utility click
                playTone(800, 'sine', 0.06, 0.06);
        }
    }

    // ----------------------------------------------------------------------
    // 4. Safe Custom Mathematical Parser (No eval)
    // ----------------------------------------------------------------------
    function tokenize(expr) {
        // Normalize custom display glyphs to basic math characters
        const normalized = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/\s+/g, ''); // strip whitespace
            
        const tokens = [];
        let numBuffer = '';
        
        for (let i = 0; i < normalized.length; i++) {
            const char = normalized[i];
            
            if ((char >= '0' && char <= '9') || char === '.') {
                numBuffer += char;
            } else if (['+', '-', '*', '/'].includes(char)) {
                // Determine if minus sign represents a negative number or subtraction operator
                // If it is at start or follows another operator, treat it as negative prefix
                if (char === '-' && (tokens.length === 0 || ['+', '-', '*', '/'].includes(tokens[tokens.length - 1])) && numBuffer === '') {
                    numBuffer += char;
                } else {
                    if (numBuffer !== '') {
                        tokens.push(parseFloat(numBuffer));
                        numBuffer = '';
                    }
                    tokens.push(char);
                }
            }
        }
        
        if (numBuffer !== '') {
            tokens.push(parseFloat(numBuffer));
        }
        
        // Remove trailing operator if user evaluates an incomplete expression
        if (tokens.length > 0 && ['+', '-', '*', '/'].includes(tokens[tokens.length - 1])) {
            tokens.pop();
        }
        
        return tokens;
    }

    function evaluateExpression(exprStr) {
        const tokens = tokenize(exprStr);
        if (tokens.length === 0) return 0;
        
        // Step 1: Precedence Order - Multiply (*) and Divide (/)
        let i = 0;
        while (i < tokens.length) {
            const token = tokens[i];
            if (token === '*' || token === '/') {
                const left = tokens[i - 1];
                const right = tokens[i + 1];
                
                if (left === undefined || right === undefined) return 'Error';
                
                let res;
                if (token === '*') {
                    res = left * right;
                } else {
                    if (right === 0) return 'Cannot divide by zero';
                    res = left / right;
                }
                tokens.splice(i - 1, 3, res);
                i--; // Step back to check new context
            } else {
                i++;
            }
        }
        
        // Step 2: Precedence Order - Add (+) and Subtract (-)
        i = 0;
        while (i < tokens.length) {
            const token = tokens[i];
            if (token === '+' || token === '-') {
                const left = tokens[i - 1];
                const right = tokens[i + 1];
                
                if (left === undefined || right === undefined) return 'Error';
                
                const res = token === '+' ? left + right : left - right;
                tokens.splice(i - 1, 3, res);
                i--;
            } else {
                i++;
            }
        }
        
        if (tokens.length === 1) {
            const result = tokens[0];
            if (isNaN(result)) return 'Error';
            
            // Clean float precision bugs (e.g. 0.1 + 0.2 = 0.3)
            return Math.round(result * 1e12) / 1e12;
        }
        
        return 'Error';
    }

    function formatResult(value) {
        if (typeof value === 'string') return value; // Return error strings immediately
        if (isNaN(value) || !isFinite(value)) return 'Error';
        
        const absoluteVal = Math.abs(value);
        // If number is extremely large or tiny, render exponential format
        if (absoluteVal > 1e12 || (absoluteVal < 1e-6 && value !== 0)) {
            return value.toExponential(7);
        }
        
        // Cap decimals to prevent display overflow but preserve integers
        const strVal = value.toString();
        if (strVal.includes('.') && strVal.length > 15) {
            return Number(value.toFixed(10)).toString();
        }
        
        return strVal;
    }

    // ----------------------------------------------------------------------
    // 5. Display Manager
    // ----------------------------------------------------------------------
    function updateDisplay() {
        // Adjust Font Size dynamically for long numbers to avoid layout breakage
        if (currentInput.length > MAX_FONT_CHARS) {
            resultEl.style.fontSize = '26px';
        } else {
            resultEl.style.fontSize = '38px';
        }

        // Render current typing state or defaults
        if (isError) {
            resultEl.textContent = currentInput;
        } else {
            resultEl.textContent = currentInput === '' ? '0' : formatDisplayGylphs(currentInput);
        }

        // Render upper expression formula display
        expressionEl.textContent = formatDisplayGylphs(expression);
        
        // Scroll displays to the end dynamically if they overflow
        const expWrapper = expressionEl.parentElement;
        const resWrapper = resultEl.parentElement;
        expWrapper.scrollLeft = expWrapper.scrollWidth;
        resWrapper.scrollLeft = resWrapper.scrollWidth;
    }

    function formatDisplayGylphs(str) {
        return str
            .replace(/\*/g, ' × ')
            .replace(/\//g, ' ÷ ')
            .replace(/-/g, ' − ')
            .replace(/\+/g, ' + ');
    }

    function triggerError(msg) {
        isError = true;
        currentInput = msg;
        expression = '';
        playClickSound('error');
        updateDisplay();
    }

    // ----------------------------------------------------------------------
    // 6. Action Handlers (Numbers, Operators, Equals, Utility)
    // ----------------------------------------------------------------------
    function handleDigit(digit) {
        if (isError) handleClear();
        
        if (isCalculated) {
            // Start fresh if user presses number directly after a result calculation
            currentInput = digit === '.' ? '0.' : digit;
            expression = '';
            isCalculated = false;
        } else {
            if (digit === '.') {
                if (currentInput.includes('.')) return; // prevent multiple decimals
                if (currentInput === '' || currentInput === '-') {
                    currentInput += '0.';
                } else {
                    currentInput += '.';
                }
            } else {
                if (currentInput === '0') {
                    currentInput = digit; // replace initial zero
                } else {
                    currentInput += digit;
                }
            }
        }
        
        playClickSound('digit');
        updateDisplay();
    }

    function handleOperator(op) {
        if (isError) return;

        playClickSound('operator');

        // If we just got a calculated result, let user continue operating on it
        if (isCalculated) {
            expression = currentInput + ' ' + op + ' ';
            currentInput = '';
            isCalculated = false;
            updateDisplay();
            return;
        }

        if (currentInput !== '') {
            // Append current digit and operator
            expression += currentInput + ' ' + op + ' ';
            // Calculate intermediate running result preview for display comfort
            const runningResult = evaluateExpression(expression);
            if (typeof runningResult === 'number') {
                currentInput = '';
            } else if (runningResult.includes('Cannot divide')) {
                triggerError(runningResult);
                return;
            }
        } else if (expression !== '') {
            // User changing operator choice mid-expression
            const trimmed = expression.trim();
            const lastChar = trimmed.charAt(trimmed.length - 1);
            if (['+', '-', '*', '/'].includes(lastChar) || ['+', '−', '×', '÷'].includes(lastChar)) {
                expression = trimmed.slice(0, -1) + op + ' ';
            }
        } else {
            // Starting expression with minus sign for negative operand
            if (op === '-') {
                currentInput = '-';
            }
        }

        updateDisplay();
    }

    function handleEquals() {
        if (isError || isCalculated) return;
        if (expression === '' && currentInput === '') return;

        const fullExpr = expression + currentInput;
        // Skip calculation if the expression is just a single operand and no operator
        if (!/[\+\-\*\/]/.test(fullExpr.replace(/^-/, ''))) {
            isCalculated = true;
            playClickSound('equals');
            return;
        }

        const rawResult = evaluateExpression(fullExpr);

        if (typeof rawResult === 'string' && rawResult.includes('Cannot divide')) {
            triggerError(rawResult);
            return;
        }

        if (rawResult === 'Error') {
            triggerError('Syntax Error');
            return;
        }

        playClickSound('equals');

        // Record History
        addHistoryItem(fullExpr, rawResult);

        // Display results
        expression = fullExpr + ' =';
        currentInput = formatResult(rawResult);
        isCalculated = true;
        
        updateDisplay();
    }

    function handleClear() {
        playClickSound('clear');
        currentInput = '0';
        expression = '';
        isCalculated = false;
        isError = false;
        updateDisplay();
    }

    function handleBackspace() {
        if (isError || isCalculated) {
            handleClear();
            return;
        }

        playClickSound('backspace');

        if (currentInput !== '') {
            currentInput = currentInput.slice(0, -1);
            if (currentInput === '' || currentInput === '-') {
                currentInput = '0';
            }
        } else if (expression !== '') {
            // Remove space, operator, space from expression to restore previous active state
            expression = expression.trim();
            const tokens = expression.split(' ');
            tokens.pop(); // Remove operator
            
            // Pop the last element back to currentInput to allow modifications
            const lastOperand = tokens.pop() || '0';
            currentInput = lastOperand;
            expression = tokens.length > 0 ? tokens.join(' ') + ' ' : '';
        }

        updateDisplay();
    }

    function handlePercent() {
        if (isError || currentInput === '0') return;

        playClickSound('digit');
        
        let valToConvert = isCalculated ? currentInput : currentInput;
        const parsed = parseFloat(valToConvert);
        if (!isNaN(parsed)) {
            const computed = parsed / 100;
            currentInput = formatResult(computed);
            if (isCalculated) {
                expression = '';
                isCalculated = false;
            }
        }
        updateDisplay();
    }

    function handleCopy() {
        if (isError) return;
        playClickSound('copy');
        
        const textToCopy = resultEl.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Trigger beautiful Screen Copy Toast
            toastEl.classList.remove('hidden');
            setTimeout(() => {
                toastEl.classList.add('hidden');
            }, 1800);
        }).catch(err => {
            console.error('Failed to copy to clipboard: ', err);
        });
    }

    // ----------------------------------------------------------------------
    // 7. Clipboard & Keyboard Support
    // ----------------------------------------------------------------------
    window.addEventListener('keydown', (e) => {
        const key = e.key;

        // Prevent browser conflict defaults
        if (key === '/' || key === 'Enter' || key === 'Backspace' || key === 'Escape') {
            e.preventDefault();
        }

        let buttonToAnimate = null;

        if (key >= '0' && key <= '9') {
            handleDigit(key);
            buttonToAnimate = document.querySelector(`.btn-num[data-val="${key}"]`);
        } else if (key === '.') {
            handleDigit('.');
            buttonToAnimate = document.getElementById('btn-decimal');
        } else if (key === '+') {
            handleOperator('+');
            buttonToAnimate = document.getElementById('btn-add');
        } else if (key === '-') {
            handleOperator('-');
            buttonToAnimate = document.getElementById('btn-subtract');
        } else if (key === '*' || key.toLowerCase() === 'x') {
            handleOperator('*');
            buttonToAnimate = document.getElementById('btn-multiply');
        } else if (key === '/') {
            handleOperator('/');
            buttonToAnimate = document.getElementById('btn-divide');
        } else if (key === '%') {
            handlePercent();
            buttonToAnimate = document.getElementById('btn-percent');
        } else if (key === 'Enter' || key === '=') {
            handleEquals();
            buttonToAnimate = document.getElementById('btn-equals');
        } else if (key === 'Backspace') {
            handleBackspace();
            buttonToAnimate = document.getElementById('btn-backspace');
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            handleClear();
            buttonToAnimate = document.getElementById('btn-clear');
        }

        // Add visual micro-animation keyboard feedback
        if (buttonToAnimate) {
            buttonToAnimate.classList.add('active-pressed');
            setTimeout(() => {
                buttonToAnimate.classList.remove('active-pressed');
            }, 120);
        }
    });

    // Wire up screen button listeners
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-val');
            const action = btn.getAttribute('data-action');

            if (val) {
                handleDigit(val);
            } else if (action) {
                switch (action) {
                    case 'clear':
                        handleClear();
                        break;
                    case 'backspace':
                        handleBackspace();
                        break;
                    case 'percent':
                        handlePercent();
                        break;
                    case 'add':
                        handleOperator('+');
                        break;
                    case 'subtract':
                        handleOperator('-');
                        break;
                    case 'multiply':
                        handleOperator('*');
                        break;
                    case 'divide':
                        handleOperator('/');
                        break;
                    case 'equals':
                        handleEquals();
                        break;
                    case 'copy':
                        handleCopy();
                        break;
                }
            }
        });
    });

    // ----------------------------------------------------------------------
    // 8. Theme Switcher System
    // ----------------------------------------------------------------------
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggleVisuals(currentTheme);

    themeToggle.addEventListener('click', () => {
        playClickSound('digit');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
        currentTheme = nextTheme;
        updateThemeToggleVisuals(nextTheme);
    });

    function updateThemeToggleVisuals(theme) {
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');
        if (theme === 'dark') {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }

    // ----------------------------------------------------------------------
    // 9. Sound Feedback Settings Toggle
    // ----------------------------------------------------------------------
    const savedSoundSetting = localStorage.getItem('sound');
    if (savedSoundSetting !== null) {
        soundEnabled = savedSoundSetting === 'true';
        updateSoundToggleVisuals();
    }

    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('sound', soundEnabled);
        updateSoundToggleVisuals();
        if (soundEnabled) {
            playTone(800, 'sine', 0.08, 0.05); // Play chime verification
        }
    });

    function updateSoundToggleVisuals() {
        const soundOnIcon = soundToggle.querySelector('.sound-on-icon');
        const soundOffIcon = soundToggle.querySelector('.sound-off-icon');
        if (soundEnabled) {
            soundToggle.classList.add('active');
            soundOnIcon.classList.remove('hidden');
            soundOffIcon.classList.add('hidden');
        } else {
            soundToggle.classList.remove('active');
            soundOnIcon.classList.add('hidden');
            soundOffIcon.classList.remove('hidden');
        }
    }

    // ----------------------------------------------------------------------
    // 10. Calculation History Manager
    // ----------------------------------------------------------------------
    let history = [];
    try {
        const storedHistory = localStorage.getItem('calc-history');
        if (storedHistory) {
            history = JSON.parse(storedHistory);
        }
    } catch (e) {
        console.warn('History failed to parse: ', e);
    }
    
    renderHistory();

    historyToggle.addEventListener('click', () => {
        playClickSound('digit');
        historyPanel.classList.toggle('hidden-panel');
        historyToggle.classList.toggle('active');
    });

    closeHistory.addEventListener('click', () => {
        playClickSound('digit');
        historyPanel.classList.add('hidden-panel');
        historyToggle.classList.remove('active');
    });

    clearHistoryBtn.addEventListener('click', () => {
        playClickSound('clear');
        history = [];
        localStorage.setItem('calc-history', JSON.stringify(history));
        renderHistory();
    });

    function addHistoryItem(expr, result) {
        // Formulate clean history representation
        const newItem = {
            id: Date.now(),
            expr: formatDisplayGylphs(expr),
            res: formatResult(result)
        };

        // Prepend to list
        history.unshift(newItem);
        // Keep list to a reasonable max size (20)
        if (history.length > 20) {
            history.pop();
        }

        localStorage.setItem('calc-history', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="empty-history">
                    <svg viewBox="0 0 24 24" width="36" height="36" class="empty-icon">
                        <path fill="currentColor" d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z" opacity="0.3"/>
                    </svg>
                    <p>No history yet</p>
                </div>
            `;
            return;
        }

        historyList.innerHTML = '';
        history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.setAttribute('role', 'button');
            div.setAttribute('tabindex', '0');
            div.setAttribute('aria-label', `Use past result: ${item.expr} equals ${item.res}`);
            
            div.innerHTML = `
                <span class="history-item-expr">${item.expr}</span>
                <span class="history-item-res">${item.res}</span>
            `;
            
            // Clicking load item back into active display
            div.addEventListener('click', () => {
                playClickSound('digit');
                currentInput = item.res;
                expression = '';
                isCalculated = true;
                isError = false;
                updateDisplay();
                
                // Slide out panel to reveal screen result
                historyPanel.classList.add('hidden-panel');
                historyToggle.classList.remove('active');
            });

            // Accessibility Keypress handler
            div.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    div.click();
                }
            });

            historyList.appendChild(div);
        });
    }

    // ----------------------------------------------------------------------
    // 11. Initial Startup Init
    // ----------------------------------------------------------------------
    updateDisplay();
});
