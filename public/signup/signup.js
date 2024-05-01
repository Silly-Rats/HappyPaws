document.getElementById('toggle-password').addEventListener('click', function() {
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

loginButton.addEventListener('click', function() {
    window.location.href = "login.html";
});


document.getElementById('birthday').addEventListener('focus', function() {
    this.type = 'date'; 
});

document.getElementById('birthday').addEventListener('blur', function() {
    if (this.value === '') {
        this.type = 'text'; 
        this.placeholder = "Date of birth"; 
    }
});

document.getElementById('birthday').addEventListener('input', function() {
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


    if (name === '' || surname === '' || birthday === '' || phone === '' || email === '' || password === '' || password2 === '') {
        alert('Please fill in all fields');
        return;
    }

    if (password !== password2) {
        alert('Passwords do not match');
        return;
    }

    var dataToSend = {
        name: name,
        surname: surname,
        birthday: birthday,
        phone: phone,
        email: email,
        password: password
    };
    // шо тутт
    fetch('your_server_endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        
    })
    .catch(error => {
        console.error('Error:', error);
        
    });
}