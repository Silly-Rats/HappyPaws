'use strict';

//SIDENAV FUNCTIONS
let sideBar = document.querySelector('.categoriesSideBar');
let screenBars = document.querySelector('#menuBars');

let filterName = document.querySelectorAll('.filterName');
let filterSubparagraph = document.querySelectorAll('.filterSubparagraph');

function dropSownHeadMenu (element, list) {
    element.addEventListener('click', () => {
        list.classList.toggle('show'); 
    });
}

filterName.forEach((name, index) => {
    dropSownHeadMenu(name, filterSubparagraph[index]);
});

dropSownHeadMenu(screenBars, sideBar);

//DROP DOWN MENU
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