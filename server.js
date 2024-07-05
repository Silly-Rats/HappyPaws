const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect(`https://happypaws-87hv.onrender.com/main`);
});

app.get('/main', (req, res) => {
    res.sendFile(__dirname + '/public/main/main.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login/login.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup/signup.html');
});

app.get('/account/user', (req, res) => {
    res.sendFile(__dirname + '/public/account/user/user_account.html');
});

app.get('/reservation', (req, res) => {
    res.sendFile(__dirname + '/public/reservation/reservation.html');
});

app.get('/training', (req, res) => {
    res.sendFile(__dirname + '/public/training/trainings.html');
});

app.get('/shop/category/:category', (req, res) => {
    res.sendFile(__dirname + '/public/shop/category/index.html');
});

app.get('/shop/items/:category', (req, res) => {
    res.sendFile(__dirname + '/public/shop/items/index.html');
});

app.get('/shop/item/:id', (req, res) => {
    res.sendFile(__dirname + '/public/shop/item/index.html');
});

app.get('/shop/cart', (req, res) => {
    res.sendFile(__dirname + '/public/shop/cart/cart.html');
});

app.get('/shop/orders', (req, res) => {
    res.sendFile(__dirname + '/public/shop/orders/orders.html');
});

app.get('/ping', (req, res) => {
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log('Server started on port: ' + port);
});

setInterval(() => {
    axios.get('https://happypawsserver.onrender.com/api/ping')
        .then((res) => {
        })
        .catch((err) => {
        });
    axios.get('https://happypaws-87hv.onrender.com/ping')
        .then((res) => {
        })
        .catch((err) => {
        });
}, 60000);
