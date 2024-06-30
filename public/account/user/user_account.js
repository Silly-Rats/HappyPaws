const token = localStorage.getItem('token');
/*localStorage.setItem('token', null);*/

fetch('http://localhost:8080/api/user/type', {
    headers: {'Authorization': localStorage.getItem('token')}
}).then(res => {
    if (res.status === 200) {
        console.log('ok');
    } else {
        alert('Session expired! Please log in again.');
        window.location.href = "http://localhost:8000/login";
    }
})

/*все по собаках*/
let dogData;
const tableBody = document.getElementById('dogTableBody');
const modal = document.getElementById('myModal');
const dogDetails = document.getElementById('dogDetails');
const closeBtn = document.querySelector('.close');
const modalContent = document.querySelector(".modal-content");
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
            <td style="display: none;">${dog.id}</td>
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

function loadDog(){
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
}
loadDog();

const saveDogBtn2 = document.getElementById('saveDogBtn2');

saveDogBtn2.addEventListener('click', () => {
    const id = document.getElementById('dogID2').value;
    const name = document.getElementById('dogName2').value;
    const dob = document.getElementById('dogDOB2').value;
    const size = document.querySelector('input[name="size2"]:checked').value;
    const breed = document.getElementById('dog_breed2').selectedOptions[0].getAttribute('data-id');
    let breedName;
    if (!breed) {
        breedName = document.getElementById('otherBreedInput2').value;
    } else {
        breedName = document.getElementById('dog_breed2').value;
    }
    const comment = document.getElementById('dogComment2').value;

    console.log("ID:", id);
    console.log("Name:", name);
    console.log("Date of Birth:", dob);
    console.log("Size:", size);
    console.log("Breed:", breed);
    console.log("BreedName:", breedName);
    console.log("Comment:", comment);

    uploadDog(id, name, dob, size, breed, breedName, comment)

    editDogContent.style.animation = "slideUp 0.8s ease";
    setTimeout(() => {
        editDogModal.style.display = "none";
    }, 500);

});

const saveDogBtn = document.getElementById('saveDogBtn');

saveDogBtn.addEventListener('click', () => {
    const id = document.getElementById('dogID').value;
    const name = document.getElementById('dogName').value;
    const dob = document.getElementById('dogDOB').value;
    const size = document.querySelector('input[name="size"]:checked').value;
    const breed = document.getElementById('dog_breed').selectedOptions[0].getAttribute('data-id');
    const comment = document.getElementById('dogComment').value;

    let breedName;
    if (!breed) {
        breedName = document.getElementById('otherBreedInput').value;
    } else {
        breedName = document.getElementById('dog_breed').value;
    }

    console.log("ID:", id);
    console.log("Name:", name);
    console.log("Date of Birth:", dob);
    console.log("Size:", size);
    console.log("Breed:", breed);
    console.log("BreedName:", breedName);
    console.log("Comment:", comment);

    uploadDog(id, name, dob, size, breed, breedName, comment)
    location.reload();

});


function uploadDog(id, name, dob, size, breed, breedName, comment) {
    fetch('http://localhost:8080/api/dog/user', {
        method: 'POST',
        headers: {
            'Authorization': token,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            name: name,
            dob: dob,
            breed: breed,
            breedName: breedName,
            size: size,
            comment: comment
        })
    }).then(location.reload());
}

function fillEditDogForm(id, name, dob, size, breed, comment) {
    document.getElementById('otherBreedInput2').value ='';
    document.getElementById('dogID2').value= id;
    document.getElementById('dogName2').value = name;
    document.getElementById('dogDOB2').value = dob;
    document.querySelector('input[name="size2"][value="' + size + '"]').checked = true;

    const selectBreed2 = document.getElementById('dog_breed2');
    const otherBreedInput2 = document.getElementById('otherBreedInput2');

    const breedOption = Array.from(selectBreed2.options).find(option => option.value === breed);
    if (breedOption) {
        selectBreed2.value = breed;
        otherBreedInput2.style.display = 'none';
    } else {
        otherBreedInput2.style.display = 'block';
        selectBreed2.value = "";
        otherBreedInput2.value = breed;
        selectBreed2.style.display = 'none';
        document.getElementById('backToSelect2').style.display = 'block';
    }

    document.getElementById('dogComment2').value = comment;
}


function openEditDogModal(id, name, dob, size, breed, comment) {
    fillEditDogForm(id, name, dob, size, breed, comment);
    editDogModal.style.display = "block";
    editDogContent.style.animation = "slideDown 0.8s ease";
}
let dogID;
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
    fillEditDogForm(id, name, dob, weight, breed, comment);
    dogID = id;
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
    document.getElementById("otherBreedInput").value = '';
    backToSelect();
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

const editButton = document.querySelector('#myModal button:first-of-type');
const editDogModal = document.getElementById('editDogModal');
const editDogCloseBtn = document.getElementById('editDogCloseBtn');
const editDogContent = document.getElementById("editDogContent");
const editDogTitle = document.querySelector('#editDogModal .info_title');

editButton.addEventListener('click', () => {
    editDogModal.style.display = "block";
    editDogContent.style.animation = "slideDown 0.8s ease";
});

editDogCloseBtn.onclick = () => {
    const dogDetails = document.getElementById('dogDetails');
    const dogName = dogDetails.querySelector('p:nth-of-type(1)').textContent.split(':')[1].trim();
    const dogDOB = dogDetails.querySelector('p:nth-of-type(2)').textContent.split(':')[1].trim();
    const dogSize = dogDetails.querySelector('p:nth-of-type(3)').textContent.split(':')[1].trim();
    const dogBreed = dogDetails.querySelector('p:nth-of-type(4)').textContent.split(':')[1].trim();
    const dogComment = dogDetails.querySelector('.comment-box p').textContent.trim();

    document.getElementById('otherBreedInput2').style.display = 'none';
    document.getElementById('backToSelect2').style.display = 'none';
    document.getElementById('dog_breed2').style.display = 'block';
    document.getElementById('dogName2').value = dogName;
    document.getElementById('dogDOB2').value = dogDOB;
    document.getElementById('dog_breed2').value = dogBreed;
    document.querySelectorAll('input[name="size2"]').forEach(input => {
        if (input.value === dogSize) {
            input.checked = true;
        } else {
            input.checked = false;
        }
    });
    document.getElementById('dogComment2').value = dogComment;

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

function deleteDog(id) {
    console.log("ID:", id);
    fetch(`http://localhost:8080/api/dog/user/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token
        }
    });
}

function confirmDelete() {
    const dogName = document.getElementById('dogDetails').querySelector('p:first-of-type').textContent.split(':')[1].trim();
    const confirmation = confirm(`Are you sure you want to delete ${dogName}? This action cannot be undone.`);
    if (confirmation) {
        deleteDog(dogID);
        location.reload();
    }
}

function confirmDeleteAll() {
    const confirmation = confirm(`Are you sure you want to delete all dogs? This action cannot be undone.`);
    if (confirmation) {
        const rows = document.querySelectorAll('#dogTableBody tr');
        rows.forEach(row => {
            const id = row.querySelector('td:last-of-type').textContent;
            deleteDog(id);
        });
        location.reload();
    }
}



let dog_breed_select = document.getElementById('dog_breed');
let dog_breed_select2 = document.getElementById('dog_breed2');
fetch('http://localhost:8080/api/dog/breeds')
    .then((response) => response.json()
        .then((dog_breeds) => {
            for (const dog_breed of dog_breeds) {
                let option = document.createElement('option');
                option.innerText = `${dog_breed.name}`;
                option.setAttribute('data-id', dog_breed.id);
                dog_breed_select.appendChild(option);
                let option2 = option.cloneNode(true);
                dog_breed_select2.appendChild(option2);
            }
        }));

function checkBreedOption2() {
    const selectElement = document.getElementById('dog_breed2');
    const otherBreedInput = document.getElementById('otherBreedInput2');
    const backToSelectButton = document.getElementById('backToSelect2');

    if (selectElement.value === 'other') {
        selectElement.style.display = 'none';
        otherBreedInput.style.display = 'block';
        backToSelectButton.style.display = 'inline-block';
    } else {
        selectElement.style.display = 'block';
        otherBreedInput.style.display = 'none';
        backToSelectButton.style.display = 'none';
    }
}

function checkBreedOption() {
    const selectElement = document.getElementById('dog_breed');
    const otherBreedInput = document.getElementById('otherBreedInput');
    const backToSelectButton = document.getElementById('backToSelect');

    if (selectElement.value === 'other') {
        selectElement.style.display = 'none';
        otherBreedInput.style.display = 'block';
        backToSelectButton.style.display = 'inline-block';
    } else {
        selectElement.style.display = 'block';
        otherBreedInput.style.display = 'none';
        backToSelectButton.style.display = 'none';
    }
}


function backToSelect() {
    const selectElement = document.getElementById('dog_breed');
    const otherBreedInput = document.getElementById('otherBreedInput');
    const backToSelectButton = document.getElementById('backToSelect');

    selectElement.style.display = 'block';
    selectElement.value=''
    otherBreedInput.style.display = 'none';
    backToSelectButton.style.display = 'none';
}

function backToSelect2() {
    const selectElement = document.getElementById('dog_breed2');
    const otherBreedInput = document.getElementById('otherBreedInput2');
    const backToSelectButton = document.getElementById('backToSelect2');

    selectElement.style.display = 'block';
    selectElement.value=''
    otherBreedInput.style.display = 'none';
    backToSelectButton.style.display = 'none';
}



/*все по юзеру*/
let userData;
const nameInputs = document.querySelectorAll('.name_input');
const dateInput = document.querySelector('input[type="date"]');
const phoneInput = document.querySelector('input[type="text"][maxlength="13"]');
const emailInput = document.querySelector('input[type="email"]');

function loadUser() {
    fetch('http://localhost:8080/api/user/info',{
        headers: {
            'Authorization': token,
            'Content-type': 'application/json'
        }
    }).then(res => res.json())
        .then(res => {
            userData = res;
            showUser(res);
        });
}
loadUser();
const saveEditButton = document.getElementById('saveEditBtn');

saveEditButton.addEventListener('click', saveUserInfo);

async function saveUserInfo() {
    let newPassword = null;
    let oldPassword = null;
    if (document.getElementById('newPassword').value) {
        newPassword = document.getElementById('newPassword').value;
        oldPassword = document.getElementById('oldPassword').value;
        if (newPassword.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }
    }
    fetch('http://localhost:8080/api/user', {
        method: 'PATCH',
        headers: {'Authorization': token, 'Content-Type': 'application/json'},
        body: JSON.stringify({
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            dob: document.getElementById('editDOB').value,
            phoneNum: document.getElementById('editPhone').value,
            newPassword: newPassword,
            oldPassword: oldPassword,
        })
    }).then(response => {
        if (response.ok) {
            alert('Changes saved.');
            editUserCloseBtn.onclick();
            location.reload();
        } else{
            alert('Incorrect Data.');
        }
    }).catch(error => {
        console.error('Error');
    });
}

function showUser (userData){
    nameInputs[0].value = userData.firstName;
    nameInputs[1].value = userData.lastName;
    dateInput.value = userData.dob;
    phoneInput.value = userData.phoneNum;
    emailInput.value = userData.email;
    document.getElementById('editFirstName').value = userData.firstName;
    document.getElementById('editLastName').value = userData.lastName;
    document.getElementById('editDOB').value = userData.dob;
    document.getElementById('editPhone').value = userData.phoneNum;
}

const image = document.querySelector('.user_photo');
const file = document.getElementById('imageUpload');
const fileReader = new FileReader();

function loadImage() {
    fetch('http://localhost:8080/api/user/image', {
        headers: {'Authorization': token}
    }).then(res => res.text())
        .then(data => {
            const img = document.querySelector('.user_photo');
            if (data === '') {
                img.src = 'images/default.png';
            } else {
                img.src = data;
            }
        });
}

loadImage();

image.addEventListener('click', () => {
    file.click();
});

fileReader.addEventListener('loadend', (e) => {
    fetch('http://localhost:8080/api/user/image', {
        method: 'PATCH',
        headers: {'Authorization': token},
        body: e.target.result
    }).then(res => res.text())
        .then(data => image.src = data);
});

file.addEventListener('change', (e) => {
    fileReader.readAsDataURL(e.target.files[0]);
});

const deleteButton = document.getElementById('accountDelete');

deleteButton.addEventListener('click', function() {
    const passConfirmModal = document.getElementById('passConfirmModal');
    passConfirmModal.style.display = 'block';
    passConfirmContent.style.animation = "slideDown 0.8s ease";
});

const passConfirmClose = document.getElementById('passConfirmClose');
const passConfirmModal = document.getElementById('passConfirmModal');
const passConfirmContent = document.getElementById('passConfirmContent');

passConfirmClose.addEventListener('click', function() {
    passConfirmContent.style.animation = "slideUp 0.8s ease";
    setTimeout(() => {
        passConfirmModal.style.display = 'none';
        const inputs = passConfirmContent.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
    }, 500);
});

const deleteAccountButton = document.querySelector('#passConfirmModal button');

deleteAccountButton.addEventListener('click', function() {
    const passConfirm = document.getElementById('passConfirm').value;

    if (passConfirm.trim() === '') {
        alert('Please enter your password.');
        return;
    }
    deleteAccount(passConfirm);
});

function deleteAccount(passConfirm) {
    fetch(`http://localhost:8080/api/user?pass=${passConfirm}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token
        }
    }).then(response => {
        if (response.ok) {
            alert('Account Deleted.');
            localStorage.setItem('token', null);
            window.location.href = "http://localhost:8000/training";
        } else {
            alert('Wrong password.');
        }
    }).catch(error => {
        console.error('Error');
    });
}

const editUserButton = document.getElementById('editUserInfo');
const editUserModal = document.getElementById('editUserModal');
const editUserCloseBtn = document.querySelector('#editUserModal .close');
const editUserContent = document.getElementById('editUserContent');

editUserButton.addEventListener('click', () => {
    editUserContent.style.animation = "slideDown 0.8s ease";
    editUserModal.style.display = "block";
});

editUserCloseBtn.onclick = () => {
    editUserContent.style.animation = "slideUp 0.8s ease";

    document.getElementById('newPassword').value = '';
    document.getElementById('oldPassword').value = '';
    showUser (userData);
    setTimeout(() => {
        editUserModal.style.display = "none";
    }, 500);
};

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

document.getElementById('toggle-password1').addEventListener('click', function () {
    let passwordInput = document.getElementById('passConfirm');
    let toggleIcon = document.getElementById('toggle-password1');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = 'images/open.png';
        toggleIcon.alt = 'Hide Password';
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = 'images/close.png';
        toggleIcon.alt = 'Show Password';
    }
});

/*все по резерваціях*/
let reservData;
const tableBodyReserv = document.getElementById('reservTableBody');
function showReservations(reservData) {

    reservData.forEach((reservation, index) => {
        const newRow = document.createElement('tr');

        //<td>${reservation.service.name}</td>
        newRow.innerHTML = `
            <td>${reservation.dogInfo.name}</td>
            <td>${reservation.price}$</td>
            <td>${new Date(reservation.reserveTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
            <td>${new Date(reservation.reserveTime).toLocaleDateString()}</td>
            <td>
                <span class="options-icon" style="cursor: pointer;">&#8942;</span>
            </td>
        `;

        if (index % 2 === 1) {
            newRow.style.backgroundColor = '#999999';
            newRow.style.color = '#FFFFFF';
        } else {
            newRow.style.backgroundColor = 'white';
            newRow.style.color = '#3C3638';
        }

        tableBodyReserv.appendChild(newRow);
    });
}

fetch('http://localhost:8080/api/reserve/all?sortBy=date&asc=true&type=training&search=',{
    headers: {
        'Authorization': token,
        'Content-type': 'application/json'
    }
}).then(res => res.json())
    .then(res => {
        reservData = res;
        showReservations(reservData);
    });

let sortBySelect = document.getElementById('sortBySelect');

sortBySelect.addEventListener('change', function() {
    let selectedValue = this.value;

    fetch(`http://localhost:8080/api/reserve/all?sortBy=${selectedValue}&asc=true&type=training&search=`, {
        headers: {
            'Authorization': token,
            'Content-type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(res => {
            reservData = res;
            clearTable();
            showReservations(reservData);
        });
});

function clearTable() {
    const tableBody = document.getElementById('reservTableBody');
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
}

function closeModal(modal_content, modal) {
    modal_content.style.animation = "slideUp 0.8s ease";
    setTimeout(() => {
        modal.style.display = "none";
    }, 500);
}


let backgroundColor = 'white';
let textColor = '#3C3638';

const newReservButton = document.getElementById('newReserve');

newReservButton.addEventListener('click', () => {
    window.location.href = "http://localhost:8000/reservation";
});

/*інше*/
document.getElementById('menuIcon').addEventListener('click', function() {
    document.getElementById('sidebarMenu').style.width = '60%'; // Adjust width as needed
});

document.getElementById('closeBtn').addEventListener('click', function() {
    document.getElementById('sidebarMenu').style.width = '0';
});
