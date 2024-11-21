// sign-up (POST) (/create_user)
document.getElementById('signup-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    // collecting data
    const form_data = {
        username: document.getElementById('signup-username').value.trim(),
        password: document.getElementById('signup-password').value.trim(),
    };

    try {
        const response = await fetch('http://0.0.0.0:8000/create_user', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form_data)
        });

        if (response.ok) {
            alert('Sign-up successful!');
            window.location.href = 'log-in.html'; // redirect to login page
        } else {
            const error_data = await response.json();
            alert('Error: ' + (error_data.message || 'Failed to sign up'));
        }
    } catch (error) {
        console.error('Sign-up error', error);
        alert('Sign-up error');
    }
});

// log-in (POST) (/auth_user)
document.getElementById('login-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    // collecting data
    const form_data = {
        username: document.getElementById('login-username').value.trim(),
        password: document.getElementById('login-password').value.trim(),
    };

    console.log(form_data)

    try {
        const response = await fetch('http://0.0.0.0:8000/auth_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form_data)
        });

        const data = await response.json();
        console.log(data)
        if (data != false) {
            sessionStorage.setItem("uid", data.uid)
            alert('Login successful!');
            window.location.href = 'home.html'; // redirect to home page
        } else {
            alert('Invalid username / password.');
        }
    } catch (error) {
        console.error('Login error', error);
        alert('Login error');
    }
});

// add task type (POST) (/create_task_type_by_user)
document.getElementById('add-task-type-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const form_data = {
        uid: sessionStorage.getItem("uid"),
        name: document.getElementById("task-type-name").value
    };

    console.log(form_data)

    try {
        const response = await fetch('http://0.0.0.0:8000/create_task_type_by_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form_data),
        });

        if (response.ok) {
            alert('Task Type created successfully!');
            window.location.href = 'home.html'; // redirect to home page
            // window.location.reload();  // reload page
        } else {
            const error_data = await response.json();
            alert('Error: ' + (error_data.message || 'Failed to create task type'));
        }
    } catch (error) {
        console.error('Post error', error);
        alert('Creation error');
    }
})

// add task (POST) (/create_task_by_user)
document.getElementById('add-task-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    // collecting data (/create_task_by_use)
    const form_data = {
        uid: sessionStorage.getItem("uid"),
        task_name: document.getElementById('task-name').value,
        // task_type: 1,
        task_type: document.getElementById('task-type').value,
        status: 0,
        day_of_week: document.getElementById("day-of-week").value
        // task_type: document.getElementById('task-type').value,
        // start_time: document.getElementById('start-time').value,
        // end_time: document.getElementById('end-time').value,
    };

    try {
        // send POST request to create task
        const response = await fetch('http://0.0.0.0:8000/create_task_by_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form_data),
        });

        if (response.ok) {
            alert('Task created successfully!');
            window.location.href = 'home.html'; // redirect to home page
            // window.location.reload();  // reload page
        } else {
            const error_data = await response.json();
            alert('Error: ' + (error_data.message || 'Failed to create task'));
        }
    } catch (error) {
        console.error('Post error', error);
        alert('Creation error');
    }
});

// update task (PUT) (/update_task_by_user)
document.getElementById('update-task-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    // collecting data
    const form_data = {
        task_name: document.getElementById('task-name').value,
        task_type: document.getElementById('task-type').value,
        start_time: document.getElementById('start-time').value,
        end_time: document.getElementById('end-time').value,
    };

    try {
        // send PUT request to update task
        const response = await fetch('0.0.0.0:8000/update_task_by_user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form_data),
        });

        if (response.ok) {
            alert('Task updated successfully!');
            window.location.href = 'home.html'; // redirect to home page
            window.location.reload();  // reload page
        } else {
            const error_data = await response.json();
            alert('Error: ' + (error_data.message || 'Failed to update task'));
        }
    } catch (error) {
        console.error('PUT error', error);
        alert('Update error');
    }
});