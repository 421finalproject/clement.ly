export class TaskTypeView {
    render(render_div) {
        let body = document.body;

        let main_div = document.createElement("div");
        main_div.classList.add("task-container");
        render_div.append(main_div)

        let add_task_type_header = document.createElement("h1");
        add_task_type_header.innerHTML = "Create Task Type";
        main_div.append(add_task_type_header);

        let form = document.createElement("form");
        form.classList.add("task-form");
        form.id = "add-task-type-form";
        form.method = "POST";
        main_div.append(form);

        let task_type_name_div = document.createElement("div");
        task_type_name_div.classList.add("input-field");
        form.append(task_type_name_div);

        let task_type_name_label = document.createElement("label");
        task_type_name_label.for = "task-type-name";
        task_type_name_label.innerHTML = "Task Type Name";
        task_type_name_div.append(task_type_name_label);

        let task_type_name_input = document.createElement("input");
        task_type_name_input.type = "text";
        task_type_name_input.id = "task-type-name";
        task_type_name_input.name = "task-name";
        task_type_name_input.required = true;
        task_type_name_div.append(task_type_name_input);

        let submit_button = document.createElement("button");
        submit_button.type = "submit";
        submit_button.innerHTML = "Create Task Type";
        form.append(submit_button);

        let script = document.createElement("script");
        script.src = "scripts/forms.js";
        body.append(script);
        
        body.append(main_div);
    }
}