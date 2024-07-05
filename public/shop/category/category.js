'use strict';

const API_URL = 'https://happypawsserver.onrender.com/api';

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
    fetch(`${API_URL}/category/${classObj.id}/img`)
        .then(res => res.text())
        .then(res => img.src = res);
    category.appendChild(img);

    let categoryName = document.createElement('button');
    categoryName.classList.add('categoryName');
    categoryName.innerHTML = classObj.name;

    categoryName.addEventListener('click', () => {
        if (classObj.subCategories.length > 0) {
            window.location.pathname = `/shop/category/${classObj.id}`;
        } else {
            window.location.pathname = `/shop/items/${classObj.id}`;
        }
    })

    category.appendChild(categoryName);
    categories.appendChild(category);
}

fetch(`${API_URL}/category${categoryId}/info`)
    .then(res => res.json())
    .then(res => res.subCategories.forEach(renderCategory));