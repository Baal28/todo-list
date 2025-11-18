//index.js
import "./styles.css"
import { TaskManager } from "./taskManager.js";
import { LocalStorageManager } from "./storageManager.js";
import { TaskListView } from "./TaskListView.js";
import { TaskController } from "./TaskController.js";

document.addEventListener('DOMContentLoaded', () => {
    // The entire application setup now goes inside this function:
    
    // Find the root DOM element
    const listRoot = document.querySelector('#task-list-root');
    const countRoot = document.querySelector('#pending-count');

    // ERROR CHECK
    if (!listRoot) {
        console.error("Fatal Error: Could not find the root element with ID 'task-list-root'. Check your HTML.");
        return; // Stop execution if element is missing
    }

    // 1. Core setup (Dependencies needed by everyone)
    const storageService = new LocalStorageManager();
    const taskManager = new TaskManager(storageService);
    

    // 2. TEMPORARILY INSTANTIATE THE CONTROLLER
    const taskController = new TaskController(taskManager, null);

    // 3. GET THE HANDLER METHOD
    //    (The controller instance exists now, so we can access its methods)
    const deleteHandler = taskController.handleDeleteTodo.bind(taskController);
    const toggleHandler = taskController.handleToggleCompletion.bind(taskController)

    // 4. FULLY INSTANTIATE THE LIST VIEW
    const taskListView = new TaskListView(taskManager, listRoot, deleteHandler, toggleHandler, countRoot);

    // 5. FINALIZE THE CONTROLLER'S DEPENDENCY
    taskController.taskListView = taskListView;

    // 6. START THE APPLICATION!
    taskController.init();
});