//TaskListView.js
import { TaskItemView } from "./TaskItemView";

export class TaskListView {
    constructor(taskManager, rootElement) {
        this.taskManager = taskManager;
        this.rootElement = rootElement;
    }

    render(){
        const tasks = this.taskManager.getTasks();
        this.rootElement.innerHTML = '';

        tasks.forEach((task) => {
            const taskView = new TaskItemView(task);
            const renderedView = taskView.render();
            this.rootElement.appendChild(renderedView);
        });
    }
}