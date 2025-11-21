//TaskController.js
import { TaskManager } from "./taskManager.js";
import { TaskListView } from "./TaskListView.js";

export class TaskController {
    constructor(taskManager, taskListView) {
        this.taskManager = taskManager;
        this.taskListView = taskListView;
        this.editingTaskId = null;
        this.currentFilter = 'Inbox';
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

        const navLinks = document.querySelectorAll('#sidebar ul li a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Get the text from the link (Inbox, Today, etc.)
                const filterName = e.target.textContent.trim();
                this.setFilter(filterName);

                // Optional: Add/remove 'active' class for visual feedback (CSS needed)
                document.querySelector('#sidebar .active')?.classList.remove('active');
                e.target.classList.add('active');
            });
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

    setFilter(filterName){
        this.currentFilter = filterName;
        this.editingTaskId = null;
        this.taskListView.render();
    }

    getFilteredTasks(){
        return this.taskManager.getTasks(this.currentFilter);
    }
}