const registerForm = document.getElementById('signup-form');
const usernameInput = document.getElementById('username');
const phoneNumberInput = document.getElementById('phoneNumber');
const passwordInput = document.getElementById('password');
const errorContainer = document.getElementById('error-container');
const confirmPasswordInput = document.getElementById('confirmPassword');
const emailInput = document.getElementById('email');

async function requestAccount() {
    if (typeof window.ethereum !== "undefined") {
        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            // Get the first account
            const walletAddress = accounts[0];
            return walletAddress;

            // console.log("Wallet Address:", walletAddress);

            // // Get the balance of the wallet
            // const balanceInWei = await window.ethereum.request({
            //     method: "eth_getBalance",
            //     params: [walletAddress, "latest"],
            // });

            // // Convert balance from Wei to Ether
            // const balanceInEther = parseFloat(balanceInWei) / Math.pow(10, 18);
            // console.log("Wallet Balance (ETH):", balanceInEther);

            // // Display wallet info on the page
            // document.getElementById(
            //     "walletInfo"
            // ).innerText = `Address: ${walletAddress}, Balance: ${balanceInEther} ETH`;
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

const postRegister = async (email, walletAddress) => {
    const resp = await fetch('http://localhost:8080/api/v1/auth/post-registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            walletAddress: walletAddress
        })  
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

const register = async () => {
    errorContainer.textContent = '';
    errorContainer.style.display = "none";

    const resp = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: usernameInput.value,
            email: emailInput.value,
            phoneNumber: phoneNumberInput.value,
            password: passwordInput.value,
            confirmPassword: confirmPasswordInput.value
        })
    })
        .then(response => response.json())
        .then(async data => {
            console.log(data);
            if (data.statusCode >= 400) {
                errorContainer.textContent = data.message;
                errorContainer.style.display = "block";
                registerForm.reset();
            }
            else {
                // alert('Register success');
                const walletAddress =  await requestAccount();
                await postRegister(emailInput.value, walletAddress);

                Swal.fire({
                    title: 'Register success',
                    text: 'Please login to continue',
                    icon: 'success',
                    confirmButtonText: 'Login'
                }).then(() => {
                    window.location.href = 'login.html';
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    register();
}); 