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

app.get('/account/user', (req, res) => {
    res.sendFile(__dirname + '/public/account/user/user_account.html');
});

app.get('/shop/category/:category', (req, res) => {
    res.sendFile(__dirname + '/public/shop/category/index.html');
});

app.get('/shop/items/:category', (req, res) => {
    res.sendFile(__dirname + '/public/shop/items/index.html');
});

app.listen(port, () => {
    console.log('Server started on origin http://localhost:' + port);
    console.log('Available URLs:');
    console.log('http://localhost:' + port + '/shop/login');
    console.log('http://localhost:' + port + '/shop/signup');
    console.log('http://localhost:' + port + '/account/user');
    console.log('http://localhost:' + port + '/shop/category');
})
