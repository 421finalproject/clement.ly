export class HomeView {
    async render(render_div) {
        let body = document.body;

        // ------------------------------ General Layout ------------------------------
        let overall_div = document.createElement('div');
        overall_div.classList.add('overall');

        // <div class="calendar">
        let main_div = document.createElement('div');
        main_div.classList.add('calendar');

        // <div class="sidebar">
        let secondary_div = document.createElement('div');
        secondary_div.classList.add('sidebar');

        overall_div.append(main_div, secondary_div);
        render_div.append(overall_div)


        // ------------------------------ Calendar Layout ------------------------------
        // <div class="calendar-header">
        let header_div = document.createElement('div');
        header_div.classList.add('calendar-header');
        // render_div.append(header_div);
        main_div.append(header_div);

        let body_div = document.createElement('div');
        body_div.classList.add('calendar-body');
        // render_div.append(body_div);
        main_div.append(body_div);
        

        let day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        // getting tasks
        const user_id = sessionStorage.getItem("uid");
        let tasks = [];

        try {
            const response = await fetch(`http://0.0.0.0:8000/get_tasks_by_user?uid=${user_id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                tasks = await response.json();
                console.log(tasks);
            } else {
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }

        let tasks_by_day = [
            [],  // Sunday
            [],  // Monday
            [],  // Tuesday
            [],  // Wednesday
            [],  // Thursday
            [],  // Friday
            [],  // Saturday
        ]

        for (let i=0; i < tasks.length; i++) {
            let task_day = tasks[i][3]
            tasks_by_day[task_day].push(tasks[i])
        }

        for (let i=0; i < 7; i++) {
            // day div
            let day_div = document.createElement('div');
            day_div.classList.add('day');

            // day label
            let day_name = document.createElement('p');
            day_name.innerHTML = day_names[i]
            day_div.append(day_name)

            let left_div = document.createElement('div');
            left_div.classList.add('left-box');

            let right_div = document.createElement('div');
            right_div.classList.add('right-box');

            // add button
            let task_link = document.createElement('a');
            task_link.href = "task.html"
            let button = document.createElement('button');
            button.classList.add('add-icon')
            let button_img = document.createElement('img');
            button_img.src = "assets/unripe.png"
            button_img.alt = "Add Task"
            button.append(button_img)
            task_link.append(button)

            // tasks
            for (let j=0; j < tasks_by_day[i].length; j++) {
                let task_div = document.createElement('div');
                task_div.classList.add('task');

                // task name
                let task_name = document.createElement('p');
                task_name.innerHTML = tasks_by_day[i][j][0]

                // button div

                // delete button
                let delete_button = document.createElement('button');
                delete_button.classList.add('delete-icon')
                let delete_button_img = document.createElement('img');
                delete_button_img.src = "assets/trash.png"
                delete_button_img.alt = "Trashcan"
                delete_button.append(delete_button_img)

                // edit button
                let edit_button = document.createElement('button');
                edit_button.classList.add('delete-icon')
                let edit_button_img = document.createElement('img');
                edit_button_img.src = "assets/pen.png"
                edit_button_img.alt = "Pen"
                edit_button.append(edit_button_img)

                // appending
                left_div.append(task_name)
                right_div.append(edit_button, delete_button)
                task_div.append(left_div, right_div)
                day_div.append(task_div)
            }
            day_div.append(task_link)
            body_div.append(day_div)
        }

        // ------------------------------ Sidebar Layout --------------------
        let type_link = document.createElement('a');
        type_link.href = "task-type.html";
        let type_button = document.createElement('button');
        type_button.classList.add('sidebar_button');
        let type_button_name = document.createElement('p');
        type_button_name.innerHTML = `Create Task Type`;
        type_button.append(type_button_name);
        type_link.append(type_button);
        secondary_div.append(type_link);

        let log_out_link = document.createElement('a');
        log_out_link.href = "log-in.html";
        let log_out_button = document.createElement('button');
        log_out_button.classList.add('sidebar_button');
        let log_out_button_name = document.createElement('p');
        log_out_button_name.innerHTML = `Log Out`;
        log_out_button.append(log_out_button_name);
        log_out_link.append(log_out_button);
        secondary_div.append(log_out_link);
    }
}