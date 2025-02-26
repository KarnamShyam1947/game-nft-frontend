const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorContainer = document.getElementById('error-container');

const login = async () => {
    const resp = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: emailInput.value,
            password: passwordInput.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.statusCode >= 400) {
            errorContainer.textContent = data.message;
            errorContainer.style.display = "block";
            loginForm.reset();
        }
        else {  
            localStorage.setItem('currentUser', JSON.stringify(data));
            Swal.fire({
                title: 'Login success',
                text: 'Welcome to VictoryVault',
                icon: 'success',
                confirmButtonText: 'Continue'
            }).then(() => {
                window.location.href = 'index.html';
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    login();

    // window.location.href = 'index.html';
});