const BASE_URL = 'http://localhost:3000/api';

function changeTheme() {
    const element = document.body;
    if(element.dataset.bsTheme === "dark"){
        element.dataset.bsTheme = "light";
        document.getElementById('prismTheme').href = 'prismjs/themes/prism.css';
        document.getElementById('themeButton').classList.remove('btn-dark');
        document.getElementById('themeButton').classList.add('btn-light');
        document.getElementById('themeIcon').classList.remove('bi-brightness-high-fill');
        document.getElementById('themeIcon').classList.add('bi-cloud-moon');
    }else{
        element.dataset.bsTheme = "dark";
        document.getElementById('prismTheme').href = 'prismjs/themes/prism-okaidia.css';
        document.getElementById('themeButton').classList.remove('btn-light');
        document.getElementById('themeButton').classList.add('btn-dark');
        document.getElementById('themeIcon').classList.remove('bi-cloud-moon');
        document.getElementById('themeIcon').classList.add('bi-brightness-high-fill');
    }
}


function displayResponse(data) {
    document.querySelector('#responseArea code').textContent = JSON.stringify(data, null, 2);
    if (window.Prism) Prism.highlightAll();
}

function displayError(error) {
    document.querySelector('#responseArea code').textContent = `Error: ${error.message}`;
}

async function getFibonacci(n) {
    try {
        const res = await fetch(`${BASE_URL}/getFibonacci?n=${encodeURIComponent(n)}`);
        if (!res.ok) throw new Error('Failed to fetch Fibonacci');
        const data = await res.json();
        loadingIsDisabled();
        displayResponse(data);
    } catch (err) {
        displayError(err);
    }
}

async function getUserProfile(email) {
    try {
        const res = await fetch(`${BASE_URL}/getUserProfile?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error('Failed to fetch user profile');
        const data = await res.json();
        loadingIsDisabled();
        displayResponse(data);
    } catch (err) {
        displayError(err);
    }
}

async function getImageByName(name) {
    try {
        const res = await fetch(`${BASE_URL}/getImageByName?name=${encodeURIComponent(name)}`);
        if (!res.ok) throw new Error('Failed to fetch image');
        const blob = await res.blob();
        const base64 = await blobToBase64(blob);
        loadingIsDisabled();
        displayResponse({ imageBase64: base64 });
    } catch (err) {
        displayError(err);
    }
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

async function multiplyMatrices(matrixA, matrixB) {
    try {
        const res = await fetch(`${BASE_URL}/multiplyMatrices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matrixA, matrixB }),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Matrix multiplication failed');
        }
        const data = await res.json();
        loadingIsDisabled();
        displayResponse(data);
    } catch (err) {
        displayError(err);
    }
}

async function dispatchTasks({ fibonacci = {}, multiplyMatrices = {}, imageByName = {}, userProfile = {} }) {
    try {
        const res = await fetch(`${BASE_URL}/dispatcher`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fibonacci, multiplyMatrices, imageByName, userProfile }),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Dispatcher failed');
        }
        const data = await res.json();
        loadingIsDisabled();
        displayResponse(data);
    } catch (err) {
        displayError(err);
    }
}

function callSelectedAPI() {
    const selectedValue = document.getElementById('apiSelector').value;
    if (document.getElementById('jsonTextArea').value !== ''){
        const textAreaValue = JSON.parse(document.getElementById('jsonTextArea').value);
        loadingIsEnabled();

        switch (selectedValue) {
            case 'getFibonacci':
                getFibonacci(textAreaValue.number);
                break;

            case 'getUserProfile':
                getUserProfile(textAreaValue.email);
                break;

            case 'getImageByName':
                getImageByName(textAreaValu.name);
                break;

            case 'multiplyMatrices':
                multiplyMatrices(textAreaValue.matrixA, textAreaValue.matrixB);
                break;

            case 'dispatchTasks':
                dispatchTasks({
                    fibonacci: {n: textAreaValue.fibonacci.n},
                    multiplyMatrices: {
                        matrixA: textAreaValue.multiplyMatrices.matrixA,
                        matrixB: textAreaValue.multiplyMatrices.matrixB
                    },
                    imageByName: {name: textAreaValue.imageByName.name},
                    userProfile: {email: textAreaValue.userProfile.email}
                });
                break;

            default:
                displayError(new Error('Invalid API selection'));
        }
    }else{
        displayError(new Error('Please enter JSON data'));
    }
}

function toggleAlign() {
    const controls = document.querySelector('.controls');
    if (controls.classList.contains('align-start')) {
        controls.classList.remove('align-start');
        controls.classList.add('align-end');
        document.getElementById('alignIcon').classList.remove('bi-align-end');
        document.getElementById('alignIcon').classList.add('bi-align-start');
    } else {
        controls.classList.remove('align-end');
        controls.classList.add('align-start');
        document.getElementById('alignIcon').classList.remove('bi-align-start');
        document.getElementById('alignIcon').classList.add('bi-align-end');
    }
}

function loadingIsEnabled(){
    document.getElementById('runButton').style.display = 'none';
    document.getElementById('loadingButton').style.display = 'initial';
}
function loadingIsDisabled(){
    document.getElementById('runButton').style.display = 'initial';
    document.getElementById('loadingButton').style.display = 'none';
}
