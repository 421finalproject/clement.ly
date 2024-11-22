export class EditTaskView {
    async render(render_div) {
        let body = document.body;

        let main_div = document.createElement("div");
        main_div.classList.add("task-container");
        render_div.append(main_div)

        let add_task_header = document.createElement("h1");
        add_task_header.innerHTML = "Edit Task";
        main_div.append(add_task_header);

        // the form that takes in the edited task data to edit a task
        let form = document.createElement("form");
        form.classList.add("task-form");
        form.id = "edit-task-form";
        form.method = "POST";
        main_div.append(form);

        // task name field
        let task_name_div = document.createElement("div");
        task_name_div.classList.add("input-field");
        form.append(task_name_div);

        // used to fill in the task name field with the current task name
        let curr_task_name = sessionStorage.getItem("task-name");

        // task name field's label
        let task_name_label = document.createElement("label");
        task_name_label.for = "task-name";
        task_name_label.innerHTML = "Task Name";
        task_name_div.append(task_name_label);

        // creates the input box where users can change the task name of the current task
        let task_name_input = document.createElement("input");
        task_name_input.type = "text";
        task_name_input.id = "task-name";
        task_name_input.name = "task-name";
        task_name_input.required = true;
        task_name_input.value = curr_task_name;
        task_name_div.append(task_name_input);


        // getting task types
        const user_id = sessionStorage.getItem("uid");
        let task_types = [];

        try {
            const response = await fetch(`http://0.0.0.0:8000/get_task_type_by_user?uid=${user_id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                task_types = await response.json();
                console.log(task_types);
            } else {
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }

        // task type dropdown field
        let task_type_div = document.createElement("div");
        task_type_div.classList.add("select-field");
        form.append(task_type_div);

        // creates the label for the task type field
        let task_type_label = document.createElement("label");
        task_type_label.for = "task-type";
        task_type_label.innerHTML = "Task Type";
        task_type_div.append(task_type_label);

        // creates the dropdown element where the task type to change to can be chosen
        let task_type_dropdown = document.createElement("select");
        task_type_dropdown.name = "task-type";
        task_type_dropdown.id = "task-type";
        task_type_div.append(task_type_dropdown);

        // get the task's currently selected task type
        let curr_task_type = sessionStorage.getItem("ttid");

        // add all of the task types to the dropdown, set the current task type value
        for (let i=0; i < task_types.length; i++) {
            let task_type_option = document.createElement("option");
            task_type_option.value = task_types[i][0];
            task_type_option.innerHTML = task_types[i][2];
            if (task_types[i][0] == curr_task_type) {
                task_type_option.selected = "selected";
            }
            task_type_dropdown.append(task_type_option);
        }

        let status_vals = ["Not Started", "In Progress", "Complete"]

        // status dropdown field
        let status_field_div = document.createElement("div");
        status_field_div.classList.add("select-field");
        form.append(status_field_div);

        // creates the label for the status field dropdown
        let status_field_label = document.createElement("label");
        status_field_label.for = "status";
        status_field_label.innerHTML = "Status";
        status_field_div.append(status_field_label);

        // creates the dropdown element where the user can set the task's status
        let status_field_dropdown = document.createElement("select");
        status_field_dropdown.name = "status";
        status_field_dropdown.id = "status";
        status_field_div.append(status_field_dropdown);

        // adds the status options to the dropdown, and sets the user's currently selected status
        for (let i = 0; i < 3; i++) {
            let status_option = document.createElement("option");
            status_option.value = i;
            let status_val = sessionStorage.getItem("status");
            if (status_val == i) {
                status_option.selected = "selected";
            }
            status_option.innerHTML = status_vals[i];
            status_field_dropdown.append(status_option);
        }

        // day of the week dropdown field
        let dow_field_div = document.createElement("div");
        dow_field_div.classList.add("select-field");
        form.append(dow_field_div);

        // creates the label for the day of the week field
        let dow_field_label = document.createElement("label");
        dow_field_label.for = "day-of-week";
        dow_field_label.innerHTML = "Day of the Week";
        dow_field_div.append(dow_field_label);
        
        // creates the dropdown that allows users to set what day of the week the task is for
        let dow_field_dropdown = document.createElement("select");
        dow_field_dropdown.name = "day-of-week";
        dow_field_dropdown.id = "day-of-week";
        dow_field_div.append(dow_field_dropdown);

        let day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        // fills in the day of the week dropdown with the day options, and sets the current day of the week for the task
        for (let i=0; i < 7; i++) {
            let day_option = document.createElement("option");
            day_option.value = i;
            let selection_option = sessionStorage.getItem("day-of-week");
            if (selection_option == i) {
                day_option.selected = "selected";
            }
            day_option.innerHTML = day_names[i];
            dow_field_dropdown.append(day_option);
        }

        // button to submit the edit task request
        let submit_button = document.createElement("button");
        submit_button.type = "submit";
        submit_button.innerHTML = "Edit Task";
        form.append(submit_button);

        // the script that runs when the submit button is clicked
        let script = document.createElement("script");
        script.src = "scripts/forms.js";
        body.append(script);
        
        body.append(main_div);
    }
}