//taskManager.js
//Handles the creation, modification, and deletion of task data.
import { Task } from "./tasks.js";

export class TaskManager {
    constructor(storageService) {
        this.tasks = [];
        this.storage = storageService;
        this.loadAllTasks();
    }

    loadAllTasks(){
        const loadedData = this.storage.loadTasks();
        this.tasks = loadedData.map(data => Task.fromData(data));
    }

    addTask(title, priority, dueDate){
        if (!title) {
            return;
        }
        const newTask = new Task(title, priority, dueDate);
        this.tasks.push(newTask);
        this.storage.saveTasks(this.tasks);
        return newTask;
    }

    updateTask(id, newTitle, newPriority, newDueDate){
        const taskToUpdate = this.tasks.find(task => task.id === id);

        if (taskToUpdate) {
            taskToUpdate.title = newTitle;
            taskToUpdate.priority = newPriority;
            taskToUpdate.dueDate = newDueDate;

            this.storage.saveTasks(this.tasks);
            return taskToUpdate
        }
        return null
    }

    deleteTask(id){
        // Filter the array to keep only tasks whose IDs DO NOT match the target ID
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.storage.saveTasks(this.tasks);
    }

    toggleCompletion(id){
        const taskToUpdate = this.tasks.find(task => task.id === id);
        if (taskToUpdate) {
            taskToUpdate.toggleCompletion();
            this.storage.saveTasks(this.tasks);
        }
    }

    getPendingCount(){
        return this.tasks.filter(task => !task.isComplete).length;
    }

    getTasks(){
        return this.tasks;
    }
}