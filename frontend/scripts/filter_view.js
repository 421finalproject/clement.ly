export class FilterView {
    async render(render_div) {
        let body = document.body;

        let main_div = document.createElement("div");
        main_div.classList.add("task-container");
        render_div.append(main_div)

        let filter_task_type_header = document.createElement("h1");
        filter_task_type_header.innerHTML = "Focus Mode";
        main_div.append(filter_task_type_header);

        let form = document.createElement("form");
        form.classList.add("task-form");
        form.id = "filter-task-type-form";
        form.method = "GET";
        main_div.append(form);

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
                // console.log(task_types);
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

        let submit_button = document.createElement("button");
        submit_button.type = "submit";
        submit_button.innerHTML = "Filter";
        form.append(submit_button);

        body.append(main_div);
    }
}