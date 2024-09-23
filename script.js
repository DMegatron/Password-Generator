
document.addEventListener('keydown', (event) => {
    if (event.key === 'r' || event.key === 'R') {
        generatePassword();
    }
    if (event.key === 'c' || event.key === 'C') {
        copyToClipboard();
    }
    if (event.key === 'ArrowUp') {
        document.getElementById('password-length').value = parseInt(document.getElementById('password-length').value) + 1;
    }

    if (event.key === 'ArrowDown') {
        document.getElementById('password-length').value = parseInt(document.getElementById('password-length').value) - 1;
    }
})

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40 + 100);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.totalFrames = 300;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length || this.frame >= this.totalFrames) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

window.onload = function () {
    const scrambleElement = document.getElementById('scramble-text');
    const fx = new TextScramble(scrambleElement);
    fx.setText('Random Password');
};



function generatePassword() {
    const passwordLengthInput = document.getElementById('password-length');
    var length = parseInt(passwordLengthInput.value);

    if (length < 8 || length > 35 || isNaN(length) || length === '') {
        if(length > 35) {
            length = 35;
            passwordLengthInput.value = 35;
        }
        else {
            length = 8;
            passwordLengthInput.value = 8;
        }
    }

    const upperCaseChars = shuffleString("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    const lowerCaseChars = shuffleString("abcdefghijklmnopqrstuvwxyz");
    const numbers = shuffleString("0123456789");
    const specialChars = shuffleString("!@#$%^&*()_-+=[]{}|;:'\",.<>?/~`");
    
    let password = [];
    password.push(upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)]);
    password.push(lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)]);
    password.push(numbers[Math.floor(Math.random() * numbers.length)]);
    password.push(specialChars[Math.floor(Math.random() * specialChars.length)]);
    
    const allChars = upperCaseChars + lowerCaseChars + numbers + specialChars;
    for (let i = password.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password.push(allChars[randomIndex]);
    }

    password = password.sort(() => Math.random() - 0.5).join('');
    
    document.getElementById('password-field').value = shuffleString(password);
}


function copyToClipboard() {
    const passwordField = document.getElementById('password-field');
    const password = passwordField.value;

    if (password === '') {
        return;
    }

    navigator.clipboard.writeText(password)
        .then(() => {
            document.getElementById('success-message').style.display = 'flex';
            document.getElementById('password-field').style.marginBottom = '0px';
            setTimeout(() => {
                document.getElementById('success-message').style.display = 'none';
                document.getElementById('password-field').style.marginBottom = '20px';

            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
}

function shuffleString(str) {
    return str.split('').sort(() => Math.random() - 0.5).join('');
}