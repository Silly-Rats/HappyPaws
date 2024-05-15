'use strict';

let token = localStorage.getItem('token');

const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const phone = document.querySelector('#phone');
const email = document.querySelector('#email');
let id = null;

const calcTotalPrice = document.querySelector('#calcTotalPrice');
const submit = document.querySelector('.orderInfoSubmit');

const cartItems = new Map();
cartItems.set(1, 4);
cartItems.set(3, 5);
cartItems.set(6, 1);
cartItems.set(7, 1);

const cartProducts = document.querySelector('.cartProducts');

fetch('http://localhost:8080/api/user/info', {
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

            let newQty = cartItems.get(classObj.id) + num;
            cartItems.set(classObj.id, newQty);
        }
    }

    function changeItemQty() {
        minus.addEventListener('click', () => changeQuantity(-1));
        plus.addEventListener('click', () => changeQuantity(1));
    }

    function deleteItem() {
        cartProducts.removeChild(product);
        cartItems.delete(classObj.id);

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
    fetch(`http://localhost:8080/api/item/${classObj.itemInfo.id}/image`)
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
    for (const item of cartItems) {
        let itemInfo = await fetch(`http://localhost:8080/api/item/type/${item[0]}/info`)
            .then(res => res.json());
        totalPrice += renderItem(itemInfo, item[1]);
    }
    calcTotalPrice.textContent = totalPrice.toFixed(2);
}

getItems();

submit.addEventListener('click', () => {
    let request = [];
    for (const item of cartItems) {
        request.push({
            'item': item[0],
            'qty': item[1]
        });
    }

    fetch('http://localhost:8080/api/order/user', {
        method: 'POST',
        headers: {'Authorization': token, 'Content-Type': 'application/json'},
        body: JSON.stringify(request)
    });
});
