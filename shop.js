const express = require('express');
const app = express();
const port = 8000;

app.use(express.static('public'));

app.get('/shop/login', (req, res) => {
    res.sendFile(__dirname + '/public/shop/login/login.html');
});

app.get('/shop/signup', (req, res) => {
    res.sendFile(__dirname + '/public/shop/signup/signup.html');
});

app.get('/shop/account', (req, res) => {
    res.sendFile(__dirname + '/public/shop/account/account.html');
});

app.get('/shop/orders', (req, res) => {
    res.sendFile(__dirname + '/public/shop/orders/orders.html');
});

app.get('/shop/category/:category', (req, res) => {
    res.sendFile(__dirname + '/public/shop/category/index.html');
});

app.get('/shop/items/:category', (req, res) => {
    res.sendFile(__dirname + '/public/shop/items/index.html');
});

app.listen(port, () => {
    console.log('Server started on origin http://localhost:' + port);
    console.log('Main page:');
    console.log('http://localhost:' + port + '/shop/category');
})
