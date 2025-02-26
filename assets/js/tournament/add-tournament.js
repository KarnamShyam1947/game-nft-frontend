document.getElementById('tournamentForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = 'Creating Tournament...';

    try {
        // Send POST request to backend API
        const response = await fetch('http://localhost:8080/api/v1/tournaments/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser')).accessToken}`
            },
            body: JSON.stringify({
                name: document.getElementById('name').value,
                description: document.getElementById('description').value,
                startTime: new Date(document.getElementById('startTime').value).toISOString(),
                endTime: new Date(document.getElementById('endTime').value).toISOString(),
                prizePool: document.getElementById('prizePool').value,
                entryFee: document.getElementById('entryFee').value,
                totalParticipates: document.getElementById('totalParticipates').value,
                rules: document.getElementById('rules').value,
                imageUrl: "https://esportsinsider.com/wp-content/uploads/2023/11/Finals-Stage--large.jpg"
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
            throw new Error(errorData.message || 'Failed to create tournament');
        }

        const result = await response.json();
        // alert('Tournament created successfully!');
        Swal.fire({
            icon: 'success',
            title: 'Tournament created successfully!',
            text: `Tournament successfully created with ID: ${result.tournament.id}`,
            footer: '<a href="tournament-details.html?id=${result.tournament.id}">View Tournament</a>'
        });
        console.log(result);
        window.location.href = `/tournament-details.html?id=${result.tournament.id}`;

    } catch (error) {
        console.error('Error:', error);
        // alert('Failed to create tournament: ' + error.message);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
            footer: '<a href="login.html">Login to get a new token</a>'
        });
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Create Tournament';
    }
});



// Add image preview functionality
document.getElementById('imageFile').addEventListener('change', function (e) {
    const file = e.target.files[0];
    const previewDiv = document.getElementById('imagePreview');

    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            this.value = '';
            previewDiv.innerHTML = '';
            return;
        }

        // Validate file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            alert('Image size should be less than 5MB');
            this.value = '';
            previewDiv.innerHTML = '';
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = function (e) {
            previewDiv.innerHTML = `
                <img src="${e.target.result}" 
                     style="max-width: 100%; height: auto; border-radius: 4px; margin-top: 10px;"
                     alt="Preview">
            `;
        };
        reader.readAsDataURL(file);
    } else {
        previewDiv.innerHTML = '';
    }
});

// Add validation for dates
document.getElementById('startTime').addEventListener('change', function () {
    const startTime = new Date(this.value);
    const endTimeInput = document.getElementById('endTime');

    // Set minimum end time to start time
    endTimeInput.min = this.value;

    // If end time is before start time, clear it
    if (endTimeInput.value && new Date(endTimeInput.value) < startTime) {
        endTimeInput.value = '';
    }
});

// Add validation for numeric inputs
['prizePool', 'entryFee', 'totalParticipates'].forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
        if (this.value < 0) {
            this.value = 0;
        }
    });
});

// Format currency inputs
['prizePool', 'entryFee'].forEach(id => {
    document.getElementById(id).addEventListener('blur', function () {
        if (this.value) {
            this.value = parseFloat(this.value).toFixed(2);
        }
    });
});
