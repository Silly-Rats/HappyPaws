const express = require('express');
const app = express();
const port = 8000;

app.use(express.static('public'));

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
    res.sendFile(__dirname + '/public/account/user/account.html');
});

app.get('/reservation', (req, res) => {
    res.sendFile(__dirname + '/public/reservation/reservation.html');
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
    console.log('http://localhost:' + port + '/main');
    console.log('http://localhost:' + port + '/login');
    console.log('http://localhost:' + port + '/signup');
    console.log('http://localhost:' + port + '/account/user');
    console.log('http://localhost:' + port + '/reservation');
    console.log('http://localhost:' + port + '/shop/category');
})
