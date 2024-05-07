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
    const div = document.createElement('div');
    div.classList.add('product');

    let productImg = document.createElement('div');
    productImg.classList.add('productImg');
    div.appendChild(productImg);

    let slide = document.createElement('div');
    slide.classList.add('slide');
    let img = document.createElement('img');
    img.src = "images/image 43.png";
    slide.appendChild(img);
    // img = document.createElement('img');
    // img.src = "images/image 32.png";
    // slide.appendChild(img);
    // img = document.createElement('img');
    // img.src = "images/image 34.png";
    // slide.appendChild(img);
    div.appendChild(slide);

    let productSlider = document.createElement('div');
    productSlider.classList.add('productSlider');
    for (let i = 0; i < 3; i++) {
        let dot = document.createElement('div');
        dot.classList.add('dot');
        dot.data_pos = `${i}`;
        productSlider.appendChild(dot);
        dot.addEventListener('click', (e) => {
            console.log(i);
        });
    }
    div.appendChild(productSlider);

    let productDesc = document.createElement('div');
    productDesc.classList.add('productDesc');
    let h3 = document.createElement('h3');
    h3.innerHTML = classObj.name;
    productDesc.appendChild(h3);
    let h2 = document.createElement('h2');
    h2.innerHTML = '12$';
    let h4 = document.createElement('h4');
    h4.innerHTML = 'Learn More';
    productDesc.appendChild(h4);
    div.appendChild(productDesc);

    return div;
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
