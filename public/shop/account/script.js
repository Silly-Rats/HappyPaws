const token = localStorage.getItem('token');

const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const dob = document.querySelector("#dob");
const phone = document.querySelector("#phone");
const newPass = document.querySelector("#newPass");
const oldPass = document.querySelector("#oldPass");
const email = document.querySelector("#email");

function renderUser(classObj) {
    firstName.value = classObj.firstName;
    lastName.value = classObj.lastName;
    dob.value = classObj.dob;
    phone.value = classObj.phoneNum;
    email.value = classObj.email;
}

fetch('http://localhost:8080/api/user/info', {
    headers: {'Authorization': token}
}).then((res) => {
    if (res.status === 200) {
        return res.json();
    } else {
        window.location.href = 'http://localhost:8000/shop/login';
        return null;
    }
}).then(renderUser);

let changeable = [firstName, lastName, dob, phone, newPass, oldPass];

let editable = false;
const edit = document.querySelector("#edit");
const orders = document.querySelector("#orders");
const deleteButton = document.querySelector("#delete");
const leave = document.querySelector("#leave");

async function saveUserInfo() {
    let newPassword = null;
    let oldPassword = null;
    if (newPass.value) {
        newPassword = newPass.value;
        oldPassword = oldPass.value;
    }

    fetch('http://localhost:8080/api/user', {
        method: 'PATCH',
        headers: {'Authorization': token, 'Content-Type': 'application/json'},
        body: JSON.stringify({
            firstName: firstName.value,
            lastName: lastName.value,
            dob: dob.value,
            phoneNum: phone.value,
            newPass: newPassword,
            oldPass: oldPassword,
        })
    });
}

edit.addEventListener('click', () => {
    let width = editable ? '1px' : '2px';
    editable = !editable;
    changeable.forEach(item => {
        item.style.borderWidth = width;
        item.readOnly = !editable;
    });

    if (editable) {
        edit.textContent = 'Save';
        newPass.style.display = 'block';
        oldPass.style.display = 'block';
    } else {
        saveUserInfo();
        edit.textContent = 'Edit';
        newPass.style.display = 'none';
        oldPass.style.display = 'none';
    }
});

orders.addEventListener('click', () => {
    window.location.href = 'http://localhost:8000/shop/orders';
});

let dialogClose = document.querySelectorAll('.dialogClose');
const passDialog = document.querySelector('#passDialog');
const dialogMask = document.querySelector('#dialogMask');
dialogClose.forEach(e => e.addEventListener('click', (e) => {
    passDialog.style.display = 'none';
    dialogMask.style.display = 'none';
}));

function showDialog() {
    const dialog = document.querySelector('#passDialog');
    const mask = document.querySelector('#dialogMask');
    const confirmPass = document.querySelector('#confirmPass');

    dialog.style.display = 'flex';
    mask.style.display = 'block';
}

const confirm = document.querySelector('#confirm');
confirm.addEventListener('click', () => {
    fetch(`http://localhost:8080/api/user?pass=${confirmPass.value}`, {
        method: 'DELETE',
        headers: {'Authorization': token}
    }).then((res) => {
        if (res.status === 200) {
            localStorage.setItem('token', '');
            window.location.href = 'http://localhost:8000/shop/category';
        } else {
            alert('Wrong password');
        }
    });
});

deleteButton.addEventListener('click', showDialog);

leave.addEventListener('click', () => {
    localStorage.setItem('token', '');
    window.location.href = 'http://localhost:8000/shop/category';
});
