const API_URL = 'https://happypawsserver.onrender.com/api';

function currentDiv(n) {
    showDivs(slideIndex = n);
}

function showDivs(n) {
    var i;
    var x = document.getElementsByClassName("slide" + n);
    var dots = document.getElementsByClassName("w4-hover-opacity");
    if (n > dots.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = dots.length
    }
    for (i = 1; i <= dots.length; i++) {
        var slides = document.getElementsByClassName("slide" + i);
        for (var j = 0; j < slides.length; j++) {
            slides[j].style.display = "none";
        }
    }
    if (x.length > 0) {
        x[0].style.display = "block";
    }
}


document.addEventListener("DOMContentLoaded", function () {
    showDivs(1);
});

fetch(`${API_URL}/user/type`, {
    headers: {'Authorization': localStorage.getItem('token')}
}).then(res => {
    if (res.status === 200) {
        document.querySelector('.nav-item.user').style.display = 'block';
        document.querySelector('.nav-item.login_img').style.display = 'none';
        document.getElementById('confirmButton1').style.pointerEvents = 'auto';
        document.getElementById('confirmButton2').style.pointerEvents = 'auto';
    } else {
        document.querySelector('.nav-item.user').style.display = 'none';
        document.querySelector('.nav-item.login_img').style.display = 'block';
        document.getElementById('confirmButton1').style.pointerEvents = 'none';
        document.getElementById('confirmButton2').style.pointerEvents = 'none';
    }
});

document.getElementById('closeBtn').addEventListener('click', function () {
    document.getElementById('sidebarMenu').style.width = '0';
});

document.getElementById('menuIcon').addEventListener('click', function () {
    document.getElementById('sidebarMenu').style.width = '60%'; // Adjust width as needed
});

document.getElementById('closeBtn').addEventListener('click', function () {
    document.getElementById('sidebarMenu').style.width = '0';
});
