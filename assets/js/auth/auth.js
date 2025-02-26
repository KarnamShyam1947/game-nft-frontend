document.addEventListener('DOMContentLoaded', function () {
    const authButton = document.getElementById('authButton');
    const authButtonText = document.getElementById('authButtonText');
    const user = JSON.parse(localStorage.getItem('currentUser'));

    console.log(user);

    if (user) {
        // User is logged in
        authButton.href = "javascript:void(0)"; // Prevent navigation
        authButtonText.textContent = "~logout";
        authButton.addEventListener('click', handleLogout);
    } else {
        // User is not logged in
        authButton.href = "login.html";
        authButtonText.textContent = "~sign in";
    }
});

// Logout handler
function handleLogout() {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Logout',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html'; // Redirect to login page
        }
    });
}
