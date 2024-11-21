import { EditTaskView } from "./edit_task_view.js";

let view = new EditTaskView();

await view.render(document.getElementById('main'));