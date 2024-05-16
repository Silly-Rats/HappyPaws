document.getElementById('toggle-password').addEventListener('click', function() {
    
    let passwordInput = document.getElementById('password');
    let toggleIcon = document.getElementById('toggle-password');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon.src = 'images/open.png';
      toggleIcon.alt = 'Hide Password';        
    } else {
      passwordInput.type = 'password';
      toggleIcon.src = 'images/close.png'; 
      toggleIcon.alt = 'Show Password';        
    }
  });


  let modal = document.getElementById("renovation");
  let btn = document.getElementById("forgotPass");
  let span = document.getElementsByClassName("close")[0];
  let modalContent = document.querySelector(".modal-content");

  btn.onclick = function() {
    modal.style.display = "block";
    modalContent.style.animation = "slideDown 0.8s ease"; 
  }

  function closeModal() {
    modalContent.style.animation = "slideUp 0.8s ease"; 
    setTimeout(() => {
      modal.style.display = "none";
    }, 500);
  }

  span.onclick = closeModal;

  window.onclick = function(event) {
    if (event.target === modal) {
      closeModal();
    }
}


let signupButton = document.getElementById('signUp');

signupButton.addEventListener('click', function() {
    window.location.href = "http://localhost:8000/signup";
});


function login() {
  let email = document.getElementById('userLog').value;
  let password = document.getElementById('password').value;


  if (email === '' || password === '') {
      alert('Please fill in all fields');
      return;
  }


  let dataToSend = {
      email: email,
      password: password
  };

  fetch('http://localhost:8080/api/auth/authenticate', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(dataToSend)
})
  .then(response => response.json())
  .then(data => {
      console.log('Success ' + data.token);
      localStorage.setItem('token', 'Bearer ' + data.token);
  })
  .catch((error) => {
      console.error('Error');
      alert("Incorrect email or password.");
  });
}