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
        constructor(id, name, description, price) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.price = price;
        }
    }

    try {
        const data = await getResource('http://localhost:8080/api/item/6/items?start=0&limit=9');
        data.items.forEach(({id, name, description, price}) => {
            let product = new Product(id, name, description, price);
            productList.push(product);
            productsPanel.appendChild(renderProduct(product));
        });
    } catch (error) {
        console.error('Error: ', error); 
    }
}

fetchProducts();

// PRODUCTS VISIBILITY ON PAGE
function renderProduct(classObj) {
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
        dot.addEventListener('dragover', (e) => {
            console.log(i);
        });
        productSlider.appendChild(dot);
    }
    div.appendChild(productSlider);

    let productDesc = document.createElement('div');
    productDesc.classList.add('productDesc');
    let h3 = document.createElement('h3');
    h3.innerHTML = classObj.name;
    productDesc.appendChild(h3);
    let h2 = document.createElement('h2');
    h2.innerHTML = '12$';
    let price = document.createElement('h2');
    price.innerHTML = `${classObj.price}$`;
    price.classList.add('productPrice');
    productDesc.appendChild(price);
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
        constructor(id, name, values) {
            this.id = id;
            this.name = name;
            this.values = values;
        }
    }

    try {
        const data = await getResource('http://localhost:8080/api/category/6/attr');
        data.forEach(({id, name, values}) => {
            let filterItem = new Filter(id, name, values);
            filtersList.push(filterItem);
            console.log(filterItem);
            sideBar.appendChild(renderFilter(filterItem));
        });
        
        
    }
     catch (error) {
        console.error('Error: ', error); 
    }

    
}

fetchFilters();

async function getCatName(){
    let catName;
    try {
        catName = await getResource('http://localhost:8080/api/category/6/info');
        console.log(catName.name);
        document.querySelector('#categoryName').innerHTML = catName.name;
        
    }
     catch (error) {
        console.error('Error: ', error); 
    } 
}

function renderFilter(classObj){
    getCatName();
    const div = document.createElement('div');
    div.classList.add = 'filter';
    let divSubCat = document.createElement('div');
    let h3 = document.createElement('h3');
    h3.innerHTML = `${classObj.name}`;
    divSubCat.appendChild(h3);


    return div;
}

renderFilter();

let dot = document.createElement('div');
dot.classList.add('dot');
dot.data_pos = `1`;
dot.addEventListener('dragover', (e) => {
    console.log(1);
});

// SLIDER
let imageWrapper = document.querySelector('.productImg');
let imagesArr = document.querySelectorAll('.slide');
