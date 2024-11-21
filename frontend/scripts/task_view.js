export class TaskView {
    async render(render_div) {
        let body = document.body;

        let main_div = document.createElement("div");
        main_div.classList.add("task-container");
        render_div.append(main_div)

        let add_task_header = document.createElement("h1");
        add_task_header.innerHTML = "Create Task";
        main_div.append(add_task_header);

        let form = document.createElement("form");
        form.classList.add("task-form");
        form.id = "add-task-form";
        form.method = "POST";
        main_div.append(form);

        let task_name_div = document.createElement("div");
        task_name_div.classList.add("input-field");
        form.append(task_name_div);

        let task_name_label = document.createElement("label");
        task_name_label.for = "task-name";
        task_name_label.innerHTML = "Task Name";
        task_name_div.append(task_name_label);

        let task_name_input = document.createElement("input");
        task_name_input.type = "text";
        task_name_input.id = "task-name";
        task_name_input.name = "task-name";
        task_name_input.required = true;
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


        let task_type_div = document.createElement("div");
        task_type_div.classList.add("select-field");
        form.append(task_type_div);

        let task_type_label = document.createElement("label");
        task_type_label.for = "task-type";
        task_type_label.innerHTML = "Task Type";
        task_type_div.append(task_type_label);

        let task_type_dropdown = document.createElement("select");
        task_type_dropdown.name = "task-type";
        task_type_dropdown.id = "task-type";
        task_type_div.append(task_type_dropdown);

        for (let i=0; i < task_types.length; i++) {
            let task_type_option = document.createElement("option");
            task_type_option.value = task_types[i][0];
            task_type_option.innerHTML = task_types[i][2];
            task_type_dropdown.append(task_type_option);
        }

        let dow_field_div = document.createElement("div");
        dow_field_div.classList.add("select-field");
        form.append(dow_field_div);

        let dow_field_label = document.createElement("label");
        dow_field_label.for = "day-of-week";
        dow_field_label.innerHTML = "Day of the Week";
        dow_field_div.append(dow_field_label);
        
        let dow_field_dropdown = document.createElement("select");
        dow_field_dropdown.name = "day-of-week";
        dow_field_dropdown.id = "day-of-week";
        dow_field_div.append(dow_field_dropdown);

        let day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        for (let i=0; i < 7; i++) {
            let day_option = document.createElement("option");
            day_option.value = i;
            day_option.innerHTML = day_names[i];
            dow_field_dropdown.append(day_option);
        }

        let submit_button = document.createElement("button");
        submit_button.type = "submit";
        submit_button.innerHTML = "Create Task";
        form.append(submit_button);

        let script = document.createElement("script");
        script.src = "scripts/forms.js";
        body.append(script);
        
        body.append(main_div);
    }
}