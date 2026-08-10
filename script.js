document.addEventListener('DOMContentLoaded', () => {
    const resultEl = document.getElementById('result');
    const lengthSlider = document.getElementById('length-slider');
    const lengthVal = document.getElementById('length-val');
    
    // Checkboxes
    const uppercaseCb = document.getElementById('uppercase');
    const lowercaseCb = document.getElementById('lowercase');
    const numbersCb = document.getElementById('numbers');
    const symbolsCb = document.getElementById('symbols');
    const excludeAmbiguousCb = document.getElementById('exclude-ambiguous');
    
    // Passphrase elements
    const wordCountSlider = document.getElementById('word-count-slider');
    const wordCountVal = document.getElementById('word-count-val');
    const separatorSelect = document.getElementById('separator-select');

    // UI elements
    const btnGenerate = document.getElementById('btn-generate');
    const btnCopy = document.getElementById('btn-copy');
    const toast = document.getElementById('toast');
    const strengthText = document.getElementById('strength-text');
    const progressBar = document.getElementById('progress-bar');
    
    const tabPassword = document.getElementById('tab-password');
    const tabPassphrase = document.getElementById('tab-passphrase');
    const passwordSettings = document.getElementById('password-settings');
    const passphraseSettings = document.getElementById('passphrase-settings');

    let currentMode = 'password';

    const words = [
        "apple", "banana", "orange", "grape", "peach", "lemon", "melon", "cherry", "plum", "kiwi",
        "ocean", "river", "mountain", "forest", "desert", "valley", "island", "canyon", "plain", "lake",
        "tiger", "lion", "bear", "wolf", "eagle", "hawk", "fox", "deer", "shark", "whale",
        "happy", "brave", "calm", "smart", "quick", "bright", "bold", "kind", "cool", "warm",
        "house", "chair", "table", "door", "window", "floor", "roof", "wall", "room", "bed",
        "train", "plane", "boat", "car", "bike", "truck", "ship", "jet", "bus", "cart",
        "piano", "guitar", "drum", "flute", "violin", "cello", "harp", "horn", "bass", "bell",
        "summer", "winter", "spring", "autumn", "morning", "night", "noon", "evening", "day", "week",
        "moon", "sun", "star", "planet", "comet", "galaxy", "orbit", "space", "sky", "cloud",
        "pizza", "bread", "cheese", "milk", "water", "juice", "soup", "salad", "meat", "rice"
    ];

    const ambiguousChars = ['i', 'l', '1', 'L', 'o', '0', 'O'];

    // Tabs
    tabPassword.addEventListener('click', () => {
        currentMode = 'password';
        tabPassword.classList.add('active');
        tabPassphrase.classList.remove('active');
        passwordSettings.style.display = 'block';
        passphraseSettings.style.display = 'none';
        btnGenerate.click();
    });

    tabPassphrase.addEventListener('click', () => {
        currentMode = 'passphrase';
        tabPassphrase.classList.add('active');
        tabPassword.classList.remove('active');
        passphraseSettings.style.display = 'block';
        passwordSettings.style.display = 'none';
        btnGenerate.click();
    });

    // Update Sliders
    lengthSlider.addEventListener('input', (e) => {
        lengthVal.innerText = e.target.value;
    });

    wordCountSlider.addEventListener('input', (e) => {
        wordCountVal.innerText = e.target.value;
    });

    // Copy
    btnCopy.addEventListener('click', () => {
        const password = resultEl.innerText;
        if (!password || password === 'Click Generate') return;
        
        navigator.clipboard.writeText(password).then(() => {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        });
    });

    // Generate
    btnGenerate.addEventListener('click', () => {
        if (currentMode === 'password') {
            const length = +lengthSlider.value;
            const hasLower = lowercaseCb.checked;
            const hasUpper = uppercaseCb.checked;
            const hasNumber = numbersCb.checked;
            const hasSymbol = symbolsCb.checked;
            const excludeAmbiguous = excludeAmbiguousCb.checked;

            const { password, poolSize } = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length, excludeAmbiguous);
            resultEl.innerText = password;
            updateStrength(length, poolSize, password);
        } else {
            const count = +wordCountSlider.value;
            const sep = separatorSelect.value;
            const { passphrase, poolSize } = generatePassphrase(count, sep);
            resultEl.innerText = passphrase;
            updateStrength(count, poolSize, passphrase, true);
        }
    });

    function generatePassword(lower, upper, number, symbol, length, excludeAmbiguous) {
        let pool = '';
        const lowers = 'abcdefghijklmnopqrstuvwxyz';
        const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*(){}[]=<>/,.';

        if (lower) pool += lowers;
        if (upper) pool += uppers;
        if (number) pool += numbers;
        if (symbol) pool += symbols;

        if (excludeAmbiguous) {
            pool = pool.split('').filter(c => !ambiguousChars.includes(c)).join('');
        }

        if (!pool) return { password: '', poolSize: 0 };

        let generated = '';
        for(let i=0; i<length; i++) {
            generated += pool[Math.floor(Math.random() * pool.length)];
        }

        return { password: generated, poolSize: pool.length };
    }

    function generatePassphrase(count, separator) {
        let phrase = [];
        for(let i = 0; i < count; i++) {
            phrase.push(words[Math.floor(Math.random() * words.length)]);
        }
        return { passphrase: phrase.join(separator), poolSize: words.length };
    }

    function updateStrength(length, poolSize, text, isPassphrase = false) {
        if (!text) {
            progressBar.style.width = '0%';
            strengthText.innerText = 'NONE';
            return;
        }

        let entropy = 0;
        if (isPassphrase) {
            entropy = length * Math.log2(poolSize);
        } else {
            entropy = length * Math.log2(poolSize);
        }

        let width = 0;
        let color = '';
        let label = '';

        if (entropy < 28) {
            width = 25;
            color = 'var(--danger-color)'; // Red
            label = 'WEAK';
        } else if (entropy < 50) {
            width = 50;
            color = 'var(--warning-color)'; // Yellow (warning)
            label = 'MEDIUM';
        } else if (entropy < 70) {
            width = 75;
            color = '#10b981'; // Green
            label = 'STRONG';
        } else {
            width = 100;
            color = '#10b981'; // Green
            label = 'VERY STRONG';
        }

        progressBar.style.width = width + '%';
        progressBar.style.backgroundColor = color;
        strengthText.innerText = label;
        strengthText.style.color = color;
    }

    // Generate initial password
    btnGenerate.click();
});
