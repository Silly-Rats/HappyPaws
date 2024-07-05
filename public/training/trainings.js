const API_URL = 'https://happypawsserver.onrender.com/api';

fetch(`${API_URL}/user/type`, {
    headers: {'Authorization': localStorage.getItem('token')}
}).then(res => {
    if (res.status === 200) {
        document.querySelector('.nav-item.user').style.display = 'block';
        document.querySelector('.nav-item.login_img').style.display = 'none';
    } else {
        document.querySelector('.nav-item.user').style.display = 'none';
        document.querySelector('.nav-item.login_img').style.display = 'block';
    }
})

document.getElementById('menuIcon').addEventListener('click', function() {
    document.getElementById('sidebarMenu').style.width = '60%'; // Adjust width as needed
});

document.getElementById('closeBtn').addEventListener('click', function() {
    document.getElementById('sidebarMenu').style.width = '0';
});