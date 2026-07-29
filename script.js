document.addEventListener('DOMContentLoaded', () => {
    const resultEl = document.getElementById('result');
    const lengthSlider = document.getElementById('length-slider');
    const lengthVal = document.getElementById('length-val');
    const uppercaseCb = document.getElementById('uppercase');
    const lowercaseCb = document.getElementById('lowercase');
    const numbersCb = document.getElementById('numbers');
    const symbolsCb = document.getElementById('symbols');
    const btnGenerate = document.getElementById('btn-generate');
    const btnCopy = document.getElementById('btn-copy');
    const toast = document.getElementById('toast');
    const strengthText = document.getElementById('strength-text');
    const bars = [
        document.getElementById('bar-1'),
        document.getElementById('bar-2'),
        document.getElementById('bar-3'),
        document.getElementById('bar-4')
    ];

    const randomFunc = {
        lower: getRandomLower,
        upper: getRandomUpper,
        number: getRandomNumber,
        symbol: getRandomSymbol
    };

    // Update Slider Value
    lengthSlider.addEventListener('input', (e) => {
        lengthVal.innerText = e.target.value;
    });

    // Copy Password
    btnCopy.addEventListener('click', () => {
        const password = resultEl.innerText;
        if (!password || password === 'Click Generate') return;
        
        navigator.clipboard.writeText(password).then(() => {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        });
    });

    // Generate Password Event
    btnGenerate.addEventListener('click', () => {
        const length = +lengthSlider.value;
        const hasLower = lowercaseCb.checked;
        const hasUpper = uppercaseCb.checked;
        const hasNumber = numbersCb.checked;
        const hasSymbol = symbolsCb.checked;

        resultEl.innerText = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
        updateStrength(hasLower, hasUpper, hasNumber, hasSymbol, length);
    });

    function generatePassword(lower, upper, number, symbol, length) {
        let generatedPassword = '';
        const typesCount = lower + upper + number + symbol;
        const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);

        if (typesCount === 0) {
            return '';
        }

        for (let i = 0; i < length; i += typesCount) {
            typesArr.forEach(type => {
                const funcName = Object.keys(type)[0];
                generatedPassword += randomFunc[funcName]();
            });
        }

        // Shuffle the string and slice it to exact length
        const finalPassword = generatedPassword.split('').sort(() => Math.random() - 0.5).join('').slice(0, length);
        return finalPassword;
    }

    function updateStrength(lower, upper, number, symbol, length) {
        const typesCount = lower + upper + number + symbol;
        let strength = 0;

        if (length > 8) strength += 1;
        if (length > 12) strength += 1;
        if (typesCount >= 3) strength += 1;
        if (typesCount === 4 && length >= 12) strength += 1;

        if (length < 8) strength = 1; // weak by default if too short
        if (typesCount === 0) strength = 0;

        // Reset Bars
        bars.forEach(bar => {
            bar.style.backgroundColor = 'transparent';
            bar.style.borderColor = 'var(--text-primary)';
        });

        let color = '';
        let text = '';
        switch(strength) {
            case 1:
                color = 'var(--danger-color)';
                text = 'TOO WEAK!';
                break;
            case 2:
                color = 'var(--warning-color)';
                text = 'WEAK';
                break;
            case 3:
                color = '#facc15'; // yellow
                text = 'MEDIUM';
                break;
            case 4:
                color = 'var(--accent-color)';
                text = 'STRONG';
                break;
            default:
                text = 'NONE';
        }

        strengthText.innerText = text;

        for (let i = 0; i < strength; i++) {
            bars[i].style.backgroundColor = color;
            bars[i].style.borderColor = color;
        }
    }

    // Generator functions
    function getRandomLower() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }

    function getRandomUpper() {
        return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    }

    function getRandomNumber() {
        return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
    }

    function getRandomSymbol() {
        const symbols = '!@#$%^&*(){}[]=<>/,.';
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    // Generate initial password
    btnGenerate.click();
});
