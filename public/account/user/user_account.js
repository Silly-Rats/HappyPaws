const token = 'Bearer ' + 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidHlwZSI6InVzZXIiLCJzdWIiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTcxNTY4NTE3NiwiZXhwIjoxNzE2Mjg5OTc2fQ.yhaKxgEE62etNcXkOqN943jZXvdctCemrUtJ2qOF4TM';

let dogData;

const tableBody = document.getElementById('dogTableBody');
const modal = document.getElementById('myModal');
const dogDetails = document.getElementById('dogDetails');
const closeBtn = document.querySelector('.close');
const modalContent = document.querySelector(".modal-content");


const nameInputs = document.querySelectorAll('.name_input');
const dateInput = document.querySelector('input[type="date"]');
const phoneInput = document.querySelector('input[type="text"][maxlength="13"]');
const emailInput = document.querySelector('input[type="email"]');


function showDogs(dogData) {
    dogData.forEach((dog, index) => {
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${dog.name}</td>
            <td>${dog.dob}</td>
            <td>${dog.breed.size}</td>
            <td>${dog.breed.name}</td>
            <td>
                <span class="options-icon" style="cursor: pointer;" onclick="openModal('${dog.id}', '${dog.name}', '${dog.dob}', '${dog.breed.size}', '${dog.breed.name}', '${dog.comment}')">&#8942;</span>
            </td>
        `;

        if (index % 2 === 1) {
            backgroundColor = '#999999';
            textColor = '#FFFFFF';
        } else {
            backgroundColor = 'white';
            textColor = '#3C3638';
        }
        newRow.style.backgroundColor = backgroundColor;
        newRow.style.color = textColor;

        tableBody.appendChild(newRow);
    });
}




fetch('http://localhost:8080/api/dog/user',{
    headers: {
        'Authorization': token,
        'Content-type': 'application/json'
    }
}).then(res => res.json())
    .then(res => {
        dogData = res;
        showDogs(res);
    });

const userData = {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    dob: "1990-01-01",
    phoneNum: "+380501254567",
    email: "john.doe@example.com",
    type: "user",
    workerDetails: null
};

nameInputs[0].value = userData.firstName;
nameInputs[1].value = userData.lastName;
dateInput.value = userData.dob;
phoneInput.value = userData.phoneNum;
emailInput.value = userData.email;

function closeModal(modal_content, modal) {
    modal_content.style.animation = "slideUp 0.8s ease";
    setTimeout(() => {
        modal.style.display = "none";
    }, 500);
}


let backgroundColor = 'white';
let textColor = '#3C3638';


function openModal(id, name, dob, weight, breed, comment) {
    editDogTitle.textContent = `Edit Dog: ${name}`;
    const commentBox = `
        <div class="comment-box">
            <p style="margin: 1vw">${comment}</p>
        </div>
    `;
    dogDetails.innerHTML = `
        <p><span style="font-weight: 400;">Name:</span> ${name}</p>
        <p><span style="font-weight: 400;">Date of Birth:</span> ${dob}</p>
        <p><span style="font-weight: 400;">Size:</span> ${weight}</p>
        <p><span style="font-weight: 400;">Breed:</span> ${breed}</p>
        ${commentBox}
    `;
    modal.style.display = "block";
    modalContent.style.animation = "slideDown 0.8s ease";
}


closeBtn.onclick = () => closeModal(modalContent, modal);

const addDogButton = document.getElementById('addDog');
const addDogCloseBtn = document.getElementById('addDogCloseBtn');
const addDogModal = document.getElementById('addDogModal');
const addDogContent = document.getElementById("addDogContent");


addDogButton.addEventListener('click', () => {
    addDogModal.style.display = "block";
    addDogContent.style.animation = "slideDown 0.8s ease";
});

addDogCloseBtn.onclick = () => {
    dogName.value = '';
    dogDOB.value = '';
    dog_breed_select.value = '';
    document.querySelectorAll('input[name="size"]').forEach(input => input.checked = false);
    dogComment.value = '';

    closeModal(addDogContent, addDogModal);
};

document.getElementById('dogDOB').addEventListener('focus', function () {
    this.type = 'date';
});

document.getElementById('dogDOB').addEventListener('blur', function () {
    if (this.value === '') {
        this.type = 'text';
        this.placeholder = "Date of Birth";
    }
});

const editButton = document.querySelector('#myModal button:first-of-type'); // Вибираємо кнопку "Edit"
const editDogModal = document.getElementById('editDogModal'); // Модальне вікно редагування собаки
const editDogCloseBtn = document.getElementById('editDogCloseBtn'); // Кнопка закриття модального вікна редагування собаки
const editDogContent = document.getElementById("editDogContent"); // Вміст модального вікна редагування собаки
const editDogTitle = document.querySelector('#editDogModal .info_title'); // Знаходимо елемент з заголовком модального вікна редагування собаки


editButton.addEventListener('click', () => {
    editDogModal.style.display = "block";
    editDogContent.style.animation = "slideDown 0.8s ease";
});

editDogCloseBtn.onclick = () => {
    document.getElementById('dogName2').value = '';
    document.getElementById('dogDOB2').value = '';
    document.getElementById('dog_breed2').value = '';
    document.querySelectorAll('input[name="size2"]').forEach(input => input.checked = false);
    document.getElementById('dogComment2').value = '';

    editDogContent.style.animation = "slideUp 0.8s ease";
    setTimeout(() => {
        editDogModal.style.display = "none";
    }, 500);
};

document.getElementById('dogDOB2').addEventListener('focus', function () {
    this.type = 'date';
});

document.getElementById('dogDOB2').addEventListener('blur', function () {
    if (this.value === '') {
        this.type = 'text';
        this.placeholder = "Date of Birth";
    }
});

function confirmDelete() {
    const dogName = document.getElementById('dogDetails').querySelector('p:first-of-type').textContent.split(':')[1].trim();
    const confirmation = confirm(`Are you sure you want to delete ${dogName}? This action cannot be undone.`);
    if (confirmation) {
        /*кінець бобіку*/
    }
}

function confirmDeleteAll() {
    const confirmation = confirm(`Are you sure you want to delete all dogs? This action cannot be undone.`);
    if (confirmation) {
        /*кінець бобікам*/
    }
}

const editUserButton = document.getElementById('editUserInfo'); // Вибір кнопки "Edit"
const editUserModal = document.getElementById('editUserModal'); // Модальне вікно редагування користувача
const editUserCloseBtn = document.querySelector('#editUserModal .close'); // Кнопка закриття модального вікна редагування користувача
const editUserContent = document.getElementById('editUserContent');

editUserButton.addEventListener('click', () => {
    editUserContent.style.animation = "slideDown 0.8s ease";
    editUserModal.style.display = "block";
});

editUserCloseBtn.onclick = () => {
    editUserContent.style.animation = "slideUp 0.8s ease";
    setTimeout(() => {
        editUserModal.style.display = "none";
    }, 500);
};

document.getElementById('editDOB').addEventListener('focus', function () {
    this.type = 'date';
});

document.getElementById('editDOB').addEventListener('blur', function () {
    if (this.value === '') {
        this.type = 'text';
        this.placeholder = "Date of Birth";
    }
});

function updatePlaceholder() {
    const fileInput = document.getElementById('imageUpload');
    const fileName = fileInput.files[0].name;
    const fileUploadLabel = document.getElementById('fileUploadLabel');
    fileUploadLabel.innerText = fileName;
}

document.getElementById('toggle-password').addEventListener('click', function () {
    let passwordInput = document.getElementById('newPassword');
    let passwordRepeat = document.getElementById('oldPassword');
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

/*serveer*/

let dog_breed_select = document.getElementById('dog_breed');
let dog_breed_select2 = document.getElementById('dog_breed2');
fetch('http://localhost:8080/api/dog/breeds')
    .then((response) => response.json()
        .then((dog_breeds) => {
            for (const dog_breed of dog_breeds) {
                let option = document.createElement('option');
                option.innerText = `${dog_breed.name}`;
                dog_breed_select.appendChild(option);
                let option2 = option.cloneNode(true);
                dog_breed_select2.appendChild(option2);
            }
        }));
