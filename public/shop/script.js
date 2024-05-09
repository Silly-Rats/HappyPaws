'use strict';

//SIDENAV FUNCTIONS
let sideBar = document.querySelector('.categoriesSideBar');
let screenBars = document.querySelector('#menuBars');
let productsPanel = document.querySelector('.products');

function dropSownHeadMenu (element, list) {
    element.addEventListener('click', () => {
        list.classList.toggle('show'); 
    });
}

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

async function fetchProducts(url) {
    class Product {
        constructor(id, name, description, price) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.price = price;
        }
    }

    try {
        const data = await getResource(url);
        data.items.forEach(({id, name, description, price}) => {
            let product = new Product(id, name, description, price);
            productList.push(product);
            productsPanel.appendChild(renderProduct(product));
        });
    } catch (error) {
        console.error('Error: ', error); 
    }
}

fetchProducts('http://localhost:8080/api/item/6/items?start=0&limit=9');


function showProductsOnPage(){
    let i = 9;
    let seeMore = document.querySelector('.seeMore');
    seeMore.addEventListener('click', () => {
        fetchProducts(`http://localhost:8080/api/item/6/items?start=${i}&limit=9`);
        i += 9; 
    })
}

showProductsOnPage();

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
    img = document.createElement('img');
    img.src = "images/image 32.png";
    slide.appendChild(img);
    img = document.createElement('img');
    img.src = "images/image 34.png";
    slide.appendChild(img);
    div.appendChild(slide);

    let arrows = document.createElement('div');
    arrows.classList.add('arrows');
    arrows.innerHTML = `
        <i class="fa-solid fa-arrow-left arrowLeft"></i>
        <i class="fa-solid fa-arrow-right arrowRight"></i>
    `;
    div.appendChild(arrows);

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


// DYNAMIC FILTERS FOR PRODUCTS
let filtersList = [];
async function fetchFilters() {
    getCatName();
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
        document.querySelector('#categoryName').innerHTML = catName.name;
        
    }
     catch (error) {
        console.error('Error: ', error); 
    } 
}

function renderFilter(classObj){
    const div = document.createElement('div');
    div.className = 'filter';
    
    let divSubCat = document.createElement('div');
    divSubCat.classList.add('filterName');
    divSubCat.innerHTML = `
        <h3>${classObj.name}</h3>
        <i class="fas fa-chevron-down"></i>
    `;
    div.appendChild(divSubCat);
    
    let filtList = document.createElement('div');
    filtList.classList.add('filterSubparagraph');
    let list = document.createElement('ul');
    filtList.appendChild(list);
    
    for(let i = 0; i < classObj.values.length; i++){
        let item = document.createElement('li');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${classObj.values[i].value}`;
        checkbox.value = `${classObj.values[i].value}`;
        
        let label = document.createElement('label');
        label.htmlFor = `${classObj.values[i].value}`;
        label.textContent = `${classObj.values[i].value}`;
        
        item.appendChild(checkbox);
        item.appendChild(label);
        
        list.appendChild(item);
    }

    dropSownHeadMenu(divSubCat, filtList); 
    
    div.appendChild(filtList);
    
    return div;
}




// SLIDER
function slider(wrapper, images){
    let arrowLeft = document.querySelectorAll('.arrowLeft');
    let arrowRight = document.querySelectorAll('.arrowRight');
    arrowLeft.forEach((arrow) => {
        arrow.addEventListener('click', () => {
            console.log('hui');
        })
    })
}
