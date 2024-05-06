'use strict';

//SIDENAV FUNCTIONS
let sideBar = document.querySelector('.categoriesSideBar');
let screenBars = document.querySelector('#menuBars');
let filterName = document.querySelectorAll('.filterName');
let filterSubparagraph = document.querySelectorAll('.filterSubparagraph');
let productsPanel = document.querySelector('.products');

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

//GETTING PRODUCT INFO FROM SERVER
const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
};

let productList = []; 

async function fetchProducts() {
    class Product {
        constructor(id, name, description) {
            this.id = id;
            this.name = name;
            this.description = description;
        }
    }

    try {
        const data = await getResource('http://localhost:8080/api/item/6/items?start=0&limit=9');
        data.items.forEach(({id, name, description}) => {
            productList.push(new Product(id, name, description));
        });
        showProductsOnPage(); 
    } catch (error) {
        console.error('Error: ', error); 
    }
}

fetchProducts();

// PRODUCTS VISIBILITY ON PAGE
function render(classObj) {
    const element = document.createElement('div');
    element.classList.add('product');
    element.innerHTML = `
        <div class="productImg">
        <div class="slide"><img src="images/image 43.png"></div>
        <div class="slide"><img src="images/acana2.jpg"></div>
        <div class="slide"><img src="images/acana3.jpg"></div>
        </div>
        <div class="productSlider">
            <div class="dot" data-pos="0"></div>
            <div class="dot" data-pos="1"></div>
            <div class="dot" data-pos="2"></div>
        </div>
        <div class="productDesc">
            <h3>${classObj.name}</h3>
            <h2>12$</h2>
            <h4>Learn More...</h4>
        </div>
    `;
    return element; 
}

function showProductsOnPage(){
    let i = 0;
    for (; i < 3; i++){
        productsPanel.appendChild(render(productList[i]));
    }
    let seeMore = document.querySelector('.seeMore');
    seeMore.addEventListener('click', () => {
        let j = i + 3;
        for (; i < j; i++){
            productsPanel.appendChild(render(productList[i]));
        }
    })
}

// DYNAMIC FILTERS FOR PRODUCTS
let filtersList = [];
async function fetchFilters() {
    class Filter {
        constructor(id, name, value) {
            this.id = id;
            this.name = name;
            this.value = value;
        }
    }

    try {
        const data = await getResource('http://localhost:8080/api/category/6/attr');
        data.forEach(({id, name, value}) => {
            filtersList.push(new Filter(id, name, value));
        });
        console.log(Filter);
    }
     catch (error) {
        console.error('Error: ', error); 
    }

    
}

fetchFilters();


// SLIDER
let dots = document.querySelectorAll('.dots');
let imageWrapper = document.querySelector('.productImg');
let imagesArr = document.querySelectorAll('.slide');

dots.forEach((dot) => {
    dot.addEventListener('click',() => {
        let currentPos = parseInt(dots.getAttribute('data-pos'));
        let newPos = parseInt(dots.getAttribute('data-pos'))
    })

})