document.getElementById('toggle-password').addEventListener('click', function () {
    let passwordInput = document.getElementById('password');
    let passwordRepeat = document.getElementById('password2');
    let toggleIcon = document.getElementById('toggle-password');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordRepeat.type = 'text';
        toggleIcon.src = 'images/open.png';
        toggleIcon.alt = 'Hide Password';
    } else {
        passwordInput.type = 'password';
        passwordRepeat.type = 'password';
        toggleIcon.src = 'images/close.png';
        toggleIcon.alt = 'Show Password';
    }
});


let loginButton = document.getElementById('logIn');

loginButton.addEventListener('click', function () {
    window.location.href = "http://localhost:8000/login";
});


document.getElementById('birthday').addEventListener('focus', function () {
    this.type = 'date';
});

document.getElementById('birthday').addEventListener('blur', function () {
    if (this.value === '') {
        this.type = 'text';
        this.placeholder = "Date of birth";
    }
});

document.getElementById('phone').addEventListener('focus', function () {
    if (this.value === '') {
        this.value = "+380";
    }
});

document.getElementById('phone').addEventListener('input', function () {
    if (!/^\+380\d*$/.test(this.value)) {
        this.value = "+380";
    }
});

document.getElementById('phone').addEventListener('blur', function () {
    if (this.value === '+380' || this.value === '') {
        this.value='';
        this.placeholder = "Phone number";
    }
});

document.getElementById('birthday').addEventListener('input', function () {
    this.placeholder = '';
});


function createAccount() {
    let name = document.getElementById('name').value;
    let surname = document.getElementById('surname').value;
    let birthday = document.getElementById('birthday').value;
    let phone = document.getElementById('phone').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let password2 = document.getElementById('password2').value;
    const type = 'user';


    if (name === '' || surname === '' || birthday === '' || phone === '' || email === '' || password === '' || password2 === '') {
        alert('Please fill in all fields!');
        return;
    }

    if (password !== password2) {
        alert('Passwords do not match!');
        return;
    }

    if (phone.length !== 13) {
        alert("Please enter a valid phone number!");
        phone.focus();
        return;
    }

    if (password.length < 8) {
        alert("Password must from 8 up to 40 symbols!");
        return;
    }

    let dataToSend = {
        firstName: name,
        lastName: surname,
        dob: birthday,
        phoneNum: phone,
        email: email,
        type: type,
        password: password,
        description: null
    };

    fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataToSend)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success');
            localStorage.setItem('token', 'Bearer ' + data.token);
        })
        .catch((error) => {
            console.error('Error: ' + error);
            alert('This email is already used!');
        });
}