document.getElementById('signup-form')?.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch('/create_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('User created successfully!');
            window.location.href = 'log-in.html'; // Redirect to login page
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
});

document.getElementById('login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/auth_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (data.length > 0) { // Assuming a successful login returns user data
            alert('Login successful!');
            window.location.href = 'home.html'; // Redirect to home page
        } else {
            alert('Invalid username or password.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong!');
    }
});
