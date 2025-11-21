//TaskController.js
import { TaskManager } from "./taskManager.js";
import { TaskListView } from "./TaskListView.js";

export class TaskController {
    constructor(taskManager, taskListView) {
        this.taskManager = taskManager;
        this.taskListView = taskListView;
        this.editingTaskId = null;
    }

    init(){
        this.bindEvents();
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
        const title = e.target.elements.title.value;
        const priority = e.target.elements.priority.value;
        const dueDate = e.target.elements.dueDate.value;

        this.taskManager.addTask(title, priority, dueDate);

        e.target.elements.title.value = '';
        this.taskListView.render();
    }

    handleUpdateTask(id, newTitle, newPriority, newDueDate){
        if (!newTitle) {
            return;
        }
        this.taskManager.updateTask(id, newTitle, newPriority, newDueDate);
        this.editingTaskId = null;
        this.taskListView.render();
    }

    triggerRender(id = null){
        this.editingTaskId = id;
        this.taskListView.render();
    }

    handleDeleteTodo(id){
        this.taskManager.deleteTask(id);
        this.taskListView.render();
    }

    handleToggleCompletion(id){
        this.taskManager.toggleCompletion(id);
        this.taskListView.render();
    }
}