//TaskListView.js
import { TaskItemView } from "./TaskItemView";

export class TaskListView {
    constructor(taskManager, rootElement, onDeleteCallback, onToggleCallback, countElement, onUpdateCallback, onRenderNeededCallback, taskController) {
        this.taskManager = taskManager;
        this.rootElement = rootElement;
        this.onDeleteCallback = onDeleteCallback;
        this.onToggleCallback = onToggleCallback;
        this.countElement = countElement;
        this.onUpdateCallback = onUpdateCallback;
        this.onRenderNeededCallback = onRenderNeededCallback;
        this.taskController = taskController;
        //this.bindClickEvents();
    }

    render(){
        //const tasks = this.taskManager.getTasks();
        const tasks = this.taskController.getFilteredTasks();
        this.rootElement.innerHTML = '';

        if (this.countElement) {
            const pendingCount = this.taskManager.getPendingCount();
            this.countElement.textContent = pendingCount;
        }

        tasks.forEach((task) => {
            const taskView = new TaskItemView(
                task,
                this.onDeleteCallback,
                this.onToggleCallback,
                this.onUpdateCallback,
                this.onRenderNeededCallback,
                this.taskController);

            const renderedView = taskView.render();
            this.rootElement.appendChild(renderedView);
        });
    }

    /*bindClickEvents(){
        this.rootElement.addEventListener('click', (e) => {
            if (e.target.textContent === 'Delete') {
                const listItem = e.target.closest('li');
                if (listItem) {
                    const taskId = listItem.id;
                    this.onDeleteCallback(taskId);
                }
            }
        })
    }*/
}