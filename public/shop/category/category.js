'use strict';

const pathName = window.location.pathname.split('/');
let categoryId = '';
if (pathName[3]) {
    categoryId = '/' + pathName[pathName.length - 1];
}
const categories = document.querySelector('.categories');

function renderCategory(classObj) {
    let category = document.createElement('div');
    category.classList.add('category');

    let img = document.createElement('img');
    img.value = classObj.id;
    fetch(`http://localhost:8080/api/category/${classObj.id}/img`)
        .then(res => res.text())
        .then(res => img.src = res);
    category.appendChild(img);

    let categoryName = document.createElement('button');
    categoryName.classList.add('categoryName');
    categoryName.innerHTML = classObj.name;

    categoryName.addEventListener('click', () => {
        if (classObj.subCategories.length > 0) {
            window.location.href = `http://localhost:8000/shop/category/${classObj.id}`;
        } else {
            window.location.href = `http://localhost:8000/shop/items/${classObj.id}`;
        }
    })

    category.appendChild(categoryName);
    categories.appendChild(category);
}

fetch(`http://localhost:8080/api/category${categoryId}/info`)
    .then(res => res.json())
    .then(res => res.subCategories.forEach(renderCategory));