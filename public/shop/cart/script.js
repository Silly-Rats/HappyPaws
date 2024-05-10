'use strict';

let categoriesHead = document.querySelector('.categoriesHead');
let headCategories = document.querySelector('.headCategories');

function dropDownSideMenu (element, list) {
    element.addEventListener('mouseover', () => {
        list.style.display = 'block';
    })
    
    element.addEventListener('mouseleave', () => {
        list.style.display = 'none';
    })  
}

dropDownSideMenu(categoriesHead, headCategories);