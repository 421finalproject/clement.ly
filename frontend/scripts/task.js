import { TaskView } from "./task_view.js";

let view = new TaskView();

await view.render(document.getElementById('main'));