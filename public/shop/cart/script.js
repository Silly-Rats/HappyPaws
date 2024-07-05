'use strict';

// const API_URL = 'https://happypawsserver.onrender.com/api';

let token = localStorage.getItem('token');

const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const phone = document.querySelector('#phone');
const email = document.querySelector('#email');
let id = null;

const calcTotalPrice = document.querySelector('#calcTotalPrice');
let cartItemsMap = new Map(JSON.parse(localStorage.getItem('cartItems')));
const cartProducts = document.querySelector('.cartProducts');

fetch(`${API_URL}/user/info`, {
    headers: {'Authorization': token}
}).then(res => res.json())
    .then(data => {
        firstName.value = data.firstName;
        lastName.value = data.lastName;
        phone.value = data.phoneNum;
        email.value = data.email;
        firstName.readOnly = true;
        lastName.readOnly = true;
        phone.readOnly = true;
        email.readOnly = true;
        id = data.id;
    });

function renderItem(classObj, qty) {
    function changeQuantity(num) {
        let qty = +p.textContent;
        if (qty + num > 0) {
            qty += num;
            p.textContent = qty;

            let totalPrice = classObj.price * qty;
            span.innerText = totalPrice.toFixed(2).toString();
            let totalOrderPrice = +calcTotalPrice.textContent;
            totalOrderPrice += classObj.price * num;
            calcTotalPrice.textContent = totalOrderPrice.toFixed(2);

            let newQty = cartItemsMap.get(classObj.id) + num;
            cartItemsMap.set(classObj.id, newQty);
            localStorage.setItem('cartItems', JSON.stringify(Array.from(cartItemsMap.entries())));
        }
    }

    function changeItemQty() {
        minus.addEventListener('click', () => changeQuantity(-1));
        plus.addEventListener('click', () => changeQuantity(1));
    }

    function deleteItem() {
        cartProducts.removeChild(product);
        cartItemsMap.delete(classObj.id);
        localStorage.setItem('cartItems', JSON.stringify(Array.from(cartItemsMap.entries())));

        let totalPrice = +calcTotalPrice.textContent;
        let qty = +p.textContent;
        totalPrice -= classObj.price * qty;
        calcTotalPrice.textContent = totalPrice.toFixed(2);
    }

    let product = document.createElement('div');
    product.classList.add('cartProduct');

    let productImg = document.createElement('div');
    productImg.classList.add('productImg');
    let img = document.createElement('img');
    fetch(`${API_URL}/item/${classObj.itemInfo.id}/image`)
        .then(res => res.text())
        .then(data => img.src = data);
    productImg.appendChild(img);
    product.appendChild(productImg);

    let div = document.createElement('div');
    let info = document.createElement('div');
    info.classList.add('productInfo');

    let h2 = document.createElement('h2');
    h2.textContent = classObj.itemInfo.name;
    info.appendChild(h2);

    h2 = document.createElement('h2');
    h2.classList.add('productType');
    h2.textContent = classObj.name;
    info.appendChild(h2);

    h2 = document.createElement('h2');
    h2.textContent = classObj.price + '$';
    info.appendChild(h2);

    let quantity = document.createElement('div');
    quantity.classList.add('quantity');
    let plus = document.createElement('i');
    plus.classList.add('fa-solid');
    plus.classList.add('fa-plus');

    let p = document.createElement('p');
    p.textContent = qty;

    let minus = document.createElement('i');
    minus.classList.add('fa-solid');
    minus.classList.add('fa-minus');

    quantity.appendChild(plus);
    quantity.appendChild(p);
    quantity.appendChild(minus);
    info.appendChild(quantity);

    div.appendChild(info);

    let price = document.createElement('div');
    price.classList.add('productPrice');
    h2 = document.createElement('h2');
    let span = document.createElement('span');
    let totalPrice = classObj.price * qty;
    span.innerText = totalPrice.toFixed(2).toString();

    h2.appendChild(document.createTextNode('Total price: '));
    h2.appendChild(span);
    h2.appendChild(document.createTextNode('$'));

    changeItemQty(classObj.id);

    price.appendChild(h2);
    div.appendChild(price);

    let bin = document.createElement('div');
    bin.classList.add('bin');
    let i = document.createElement('i');
    i.classList.add('fa-solid');
    i.classList.add('fa-trash');
    bin.addEventListener('click', () => deleteItem(classObj.id));
    bin.appendChild(i);
    div.appendChild(bin);

    product.appendChild(div);
    cartProducts.appendChild(product);

    return totalPrice;
}

async function getItems() {
    let totalPrice = 0;
    for (const item of cartItemsMap) {
        let itemInfo = await fetch(`${API_URL}/item/type/${item[0]}/info`)
            .then(res => res.json());
        totalPrice += renderItem(itemInfo, item[1]);
    }
    calcTotalPrice.textContent = totalPrice.toFixed(2);
}

getItems();


const submit = document.querySelector('.orderInfoSubmit');
const mask = document.querySelector('#dialogMask');
const dialog = document.querySelector('#orderedDialog');

const toOrders = document.querySelector('#toOrders');
const toShop = document.querySelector('#toShop');

toOrders.addEventListener('click', () => {
    window.location.pathname = '/shop/orders';
})

toShop.addEventListener('click', () => {
    window.location.pathname = '/shop/category';
});

submit.addEventListener('click', () => {
    if (cartItemsMap.size > 0) {
        let request = [];
        for (const item of cartItemsMap) {
            request.push({
                'item': item[0],
                'qty': item[1]
            });
        }

        fetch(`${API_URL}/order/user`, {
            method: 'POST',
            headers: {'Authorization': token, 'Content-Type': 'application/json'},
            body: JSON.stringify(request)
        }).then(res => {
            if (res.status === 200) {
                if (id == null) {
                    toOrders.style.display = 'none';
                }
                mask.style.display = 'block';
                dialog.style.display = 'flex';
            }
        })
    }
    localStorage.removeItem('cartItems');
    cartItemsMap = new Map();
});
