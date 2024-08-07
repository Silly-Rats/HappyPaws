'use strict';

// const API_URL = 'https://happypawsserver.fly.dev/api';

const pathName = window.location.pathname.split('/');
const category = pathName[pathName.length - 1];

//SIDENAV FUNCTIONS
let sideBar = document.querySelector('.categoriesSideBar');
let screenBars = document.querySelector('#menuBars');
let productsPanel = document.querySelector('.products');

function dropDownSideMenu(element, list) {
    element.addEventListener('click', () => {
        if (list.style.display === 'none') {
            list.style.display = 'block';
            list.style.opacity = '1';
        } else {
            list.style.display = 'none';
            list.style.opacity = '0';
        }
    });
}

dropDownSideMenu(screenBars, sideBar);

//GETTING PRODUCT INFO FROM SERVER
const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
};

const size = 9;
let page = 1;

async function fetchProducts() {
    class Product {
        constructor(id, name, description, price) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.price = price;
        }
    }

    let url = `${API_URL}/item/${category}/items`;

    try {
        let data;
        await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                page: page,
                size: size,
                asc: sortBy.value === 'item_id' ? !ascValue : ascValue,
                sortBy: sortBy.value,
                from: fromPrice.value,
                to: toPrice.value,
                namePart: search.value,
                attributes: Object.fromEntries(map)
            })
        }).then(res => res.json())
            .then(res => data = res);
        console.log(data);

        page++;
        data.items.forEach(({id, name, description, price}) => {
            let product = new Product(id, name, description, price);
            productsPanel.appendChild(renderProduct(product));
        });

        if (
            !data.hasMore
        ) {
            seeMore.style.display = 'none';
        }
    } catch
        (error) {
        console.error('Error: ', error);
    }
}

let seeMore = document.querySelector('.seeMore');
seeMore.addEventListener('click', () => {
    fetchProducts();
});

// PRODUCTS VISIBILITY ON PAGE
function renderProduct(classObj) {
    const div = document.createElement('div');
    div.classList.add('product');

    let productImg = document.createElement('div');
    productImg.classList.add('productImg');
    div.appendChild(productImg);

    let img = document.createElement('img');
    fetch(`${API_URL}/item/${classObj.id}/image`)
        .then(r => r.text())
        .then(r => img.src = r);
    div.appendChild(img);

    let productDesc = document.createElement('div');
    productDesc.classList.add('productDesc');
    let h3 = document.createElement('h3');
    h3.innerHTML = classObj.name;
    productDesc.appendChild(h3);
    let price = document.createElement('h2');
    price.innerHTML = `${classObj.price}$`;
    price.classList.add('productPrice');
    productDesc.appendChild(price);
    let h4 = document.createElement('h4');
    h4.innerHTML = 'Learn More';
    h4.addEventListener('click', () => {
        window.location.pathname = `/shop/item/${classObj.id}`;
    });
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
        const data = await getResource(`${API_URL}/category/${category}/attr`);
        data.forEach(({id, name, values}) => {
            let filterItem = new Filter(id, name, values);
            filtersList.push(filterItem);
            sideBar.insertBefore(renderFilter(filterItem),
                sideBar.childNodes[sideBar.childNodes.length - 2]);
        });
    } catch (error) {
        console.error('Error: ', error);
    }
}

fetchFilters();

async function getCatName() {
    let catName;
    try {
        catName = await getResource(`${API_URL}/category/${category}/info`);
        document.querySelector('#categoryName').innerHTML = catName.name;
    } catch (error) {
        console.error('Error: ', error);
    }
}

function renderFilter(classObj) {
    const div = document.createElement('div');
    div.className = 'filter';

    let divSubCat = document.createElement('div');
    divSubCat.classList.add('filterName');
    let h3 = document.createElement('h3');
    h3.innerHTML = classObj.name;
    let i = document.createElement('i');
    i.classList.add('fas');
    i.classList.add('fa-chevron-down');
    divSubCat.appendChild(h3);
    divSubCat.appendChild(i);
    div.appendChild(divSubCat);

    let filtList = document.createElement('div');
    filtList.classList.add('filterSubparagraph');
    let list = document.createElement('ul');
    filtList.appendChild(list);

    for (let value of classObj.values) {
        let item = document.createElement('li');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = value.value;
        checkbox.addEventListener('change', (e) => {
            let list = map.get(classObj.id);
            if (e.target.checked) {
                if (list === undefined) {
                    list = [];
                }
                list.push(value.id);
                map.set(classObj.id, list);
            } else {
                list.splice(list.indexOf(value.id), 1);
                map.set(classObj.id, list);
            }
        });

        let label = document.createElement('label');
        label.htmlFor = value.value;
        label.textContent = value.value;

        item.appendChild(checkbox);
        item.appendChild(label);
        list.appendChild(item);
    }

    dropDownSideMenu(divSubCat, filtList); // Corrected the function call
    div.appendChild(filtList);

    return div;
}

let map = new Map();
let fromPrice = document.querySelector('#fromPrice');
let toPrice = document.querySelector('#toPrice');
let search = document.querySelector("#search");
let sortBy = document.querySelector("#sortBy");
let asc = document.querySelector("#asc");
let ascValue = true;

function filter() {
    seeMore.style.display = 'flex';
    page = 1;
    while (productsPanel.firstChild) {
        productsPanel.removeChild(productsPanel.firstChild);
    }
    fetchProducts();
}

filter();

let applyFilters = document.querySelectorAll('.applyFilters');
applyFilters.forEach(e => {
    e.addEventListener('click', filter)
});

sortBy.addEventListener('change', filter);

asc.addEventListener('click', (e) => {
    if (ascValue) {
        e.target.style.transform = 'rotate(180deg)';
    } else {
        e.target.style.transform = '';
    }
    ascValue = !ascValue;
    filter();
});
