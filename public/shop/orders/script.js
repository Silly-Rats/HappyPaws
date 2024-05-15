const token = localStorage.getItem('token');
let type;
fetch("http://localhost:8080/api/user/type", {
    headers: {'Authorization': token}
}).then(res => res.text())
    .then(res => {
        type = res;
        main();
    });

function main() {
    const orderId = document.querySelector('#searchId');
    const status = document.querySelector('#status');
    const sortBy = document.querySelector('#sortBy');

    const orders = document.querySelector('#orders');

    function createInfo(name, className, value) {
        let info = document.createElement('div');
        info.classList.add('info');
        let h2 = document.createElement('h2');
        h2.textContent = name;
        let h3 = document.createElement('h3');
        h3.classList.add(className);
        h3.textContent = value;
        info.appendChild(h2);
        info.appendChild(h3);
        if (className === 'itemName' || className === 'itemType') {
            h3.addEventListener('click', wrapText)
        }

        return info;
    }

    function createItem(clasObj) {
        let item = document.createElement('div');
        item.classList.add('item');

        item.appendChild(createInfo('Name:', 'itemName',
            clasObj.item.itemInfo.name));
        item.appendChild(createInfo('Type:', 'itemType',
            clasObj.item.name));
        item.appendChild(createInfo('Price:', 'itemPrice',
            clasObj.item.price + '$'));
        item.appendChild(createInfo('Quantity:', 'itemQty',
            clasObj.qty));

        return item;
    }

    function seeMore(hidden) {
        let h2 = document.createElement('h2');
        h2.classList.add('seeMore');
        h2.classList.add('fas');
        h2.classList.add('fa-2x');
        h2.classList.add('fa-chevron-down');

        h2.addEventListener('click', () => {
            hidden.forEach(h => h.style.display = 'flex');
            h2.style.display = 'none';
        })

        return h2;
    }

    function showDialog(classObj) {
        const userName = document.querySelector('#userName');
        const userEmail = document.querySelector('#userEmail');
        const userPhone = document.querySelector('#userPhone');

        userName.textContent = classObj.userInfo.name;
        userEmail.textContent = classObj.userInfo.email;
        userPhone.textContent = classObj.userInfo.phoneNum;

        const dialog = document.querySelector('#orderedDialog');
        const mask = document.querySelector('#dialogMask');
        dialog.style.display = 'flex';
        mask.style.display = 'block';
    }

    function createOrderButtons(classObj) {
        let status = classObj.statusName;

        let orderButtons = document.createElement('div');
        orderButtons.classList.add('orderButtons');
        let button;

        if (status !== 'Completed' && status !== 'Cancelled') {
            button = document.createElement('button');
            button.classList.add('cancel');
            button.textContent = 'Cancel order';
            button.addEventListener('click', () => {
                fetch('http://localhost:8080/api/order/cancel', {
                    method: 'PATCH',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    body: classObj.id
                }).then(loadOrders);
            });
            orderButtons.appendChild(button);
        }

        if (type === 'shop worker') {
            button = document.createElement('button');
            button.classList.add('infoButton');
            button.textContent = 'Customer into';
            button.addEventListener('click', () => {
                showDialog(classObj);
            });
            orderButtons.appendChild(button);

            if (status !== 'Completed' && status !== 'Cancelled') {
                button = document.createElement('button');
                button.classList.add('nextStatus');
                button.addEventListener('click', () => {
                    fetch('http://localhost:8080/api/order/proceed', {
                        method: 'PATCH',
                        headers: {
                            'Authorization': token,
                            'Content-Type': 'application/json'
                        },
                        body: classObj.id
                    }).then(loadOrders);
                });
                button.textContent = 'Next status';
                orderButtons.appendChild(button);
            }
        }

        button.style.marginRight = '0';

        return orderButtons;
    }

    function renderOrder(classObj) {
        let orderTable = document.createElement('div');
        orderTable.classList.add('orderTable');

        let orderTableHeader = document.createElement('div');
        orderTableHeader.classList.add('orderTableHeader');

        let dateAndStatus = document.createElement('div');
        dateAndStatus.classList.add('dateAndStatus');

        let h2 = document.createElement('h2');
        let date = new Date(classObj.orderDate).toLocaleDateString('ua-UA');
        h2.textContent = date;
        dateAndStatus.appendChild(h2);

        h2 = document.createElement('h2');
        h2.textContent = classObj.status;
        dateAndStatus.appendChild(h2);
        orderTableHeader.appendChild(dateAndStatus);

        h2 = document.createElement('h2');
        h2.textContent = classObj.id;
        orderTableHeader.appendChild(h2);
        orderTable.appendChild(orderTableHeader);

        let hidden = [];
        for (let i = 0; i < classObj.details.length; i++) {
            let item = createItem(classObj.details[i]);

            if (i > 1) {
                item.style.display = 'none';
                hidden.push(item);
            }

            orderTable.appendChild(item);
        }

        let orderBottom = document.createElement('div');
        orderBottom.classList.add('orderBottom');
        h2 = document.createElement('h2');
        h2.textContent = 'Total price: ' + classObj.totalPrice + '$';
        orderBottom.appendChild(h2);
        orderBottom.appendChild(createOrderButtons(classObj));
        orderTable.appendChild(orderBottom);

        if (classObj.details.length > 2) {
            orderBottom.style.display = 'none';
            hidden.push(orderBottom);
            orderTable.appendChild(seeMore(hidden));
        }

        orders.appendChild(orderTable);
    }


    function loadOrders() {
        while (orders.firstChild) {
            orders.removeChild(orders.firstChild);
        }

        let url;
        if (type === 'shop worker') {
            url = `http://localhost:8080/api/order/all?orderId=${orderId.value}&` +
                `status=${status.value}&sortBy=${sortBy.value}&asc=true`;
        } else {
            url = `http://localhost:8080/api/order/user?status=${status.value}&sortBy=${sortBy.value}&asc=true`;
        }

        fetch(url, {
            method: 'GET',
            headers: {'Authorization': token}
        }).then(res => res.json())
            .then(res => res.forEach(renderOrder));
    }

    loadOrders();

    orderId.addEventListener('change', loadOrders);
    status.addEventListener('change', loadOrders);
    sortBy.addEventListener('change', loadOrders);

    function wrapText(e) {
        e.target.style.textWrap = 'wrap';
    }
}

let dialogClose = document.querySelectorAll('.dialogClose');
const infoDialog = document.querySelector('#orderedDialog');
const dialogMask = document.querySelector('#dialogMask');
dialogClose.forEach(e => e.addEventListener('click', (e) => {
    infoDialog.style.display = 'none';
    dialogMask.style.display = 'none';
}));

const navAndLogo = document.querySelector('.imgLogo');

navAndLogo.addEventListener('click', () => {
    window.location.href = `http://localhost:8000/shop/category`;
});

const account = document.querySelector('.userAccount');

account.addEventListener('click', () =>
    fetch('http://localhost:8080/api/user/type', {
        headers: {'Authorization': localStorage.getItem('token')}
    }).then(res => {
        if (res.status === 200) {
            window.location.href = `http://localhost:8000/shop/account`;
        } else {
            window.location.href = `http://localhost:8000/shop/login`;
        }
    }));
