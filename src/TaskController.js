//TaskController.js
import { TaskManager } from "./taskManager.js";
import { TaskListView } from "./TaskListView.js";

export class TaskController {
    constructor(taskManager, taskListView) {
        this.taskManager = taskManager;
        this.taskListView = taskListView;
    }

    init(){
        this.taskListView.render();
    }

    bindEvents(){
        const inputForm = document.querySelector('#task-form')
        inputForm.addEventListener('submit', e =>{
            e.preventDefault();
            this.handleAddTodo(e);
        });
    }

    handleAddTodo(e){
        this.taskManager.addTask(e.target.elements.title.value);
        e.target.elements.title.value = '';
        this.taskListView.render();
    }
}