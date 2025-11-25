//taskManager.js
//Handles the creation, modification, and deletion of task data.
import { Task } from "./tasks.js";

export class TaskManager {
    constructor(storageService) {
        this.tasks = [];
        this.storage = storageService;
        this.projects = this.storage.loadProjects() || ['Car Repair']
        this.loadAllTasks();
    }

    addProject(name){
        if (!name || this.projects.includes(name)) {
            return false;
        }
        this.projects.push(name);
        this.storage.saveProjects(this.projects);
        return true;
    }

    getProjects(){
        return this.projects;
    }

    deleteProject(name){
        if (!name || name === 'Car Repair') {
            return false;
        }
        this.projects = this.projects.filter(project => project !== name)
        this.storage.saveProjects(this.projects);

        this.tasks.forEach(task => {
            if (task.projectName === name) {
                task.projectName = null;
            }
        });
        this.storage.saveTasks(this.tasks);

        return true;
    }

    loadAllTasks(){
        const loadedData = this.storage.loadTasks();
        this.tasks = loadedData.map(data => Task.fromData(data));
    }

    addTask(title, priority, dueDate, projectName = null){
        if (!title) {
            return;
        }
        const newTask = new Task(title, priority, dueDate, projectName);
        this.tasks.push(newTask);
        this.storage.saveTasks(this.tasks);
        return newTask;
    }

    updateTask(id, newTitle, newPriority, newDueDate, newProjectName){
        const taskToUpdate = this.tasks.find(task => task.id === id);

        if (taskToUpdate) {
            taskToUpdate.title = newTitle;
            taskToUpdate.priority = newPriority;
            taskToUpdate.dueDate = newDueDate;

            const finalProjectName = newProjectName === '' ? null : newProjectName;
            taskToUpdate.projectName = finalProjectName;

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

    getTasks(filter = 'Inbox'){
        let filteredTasks = this.tasks;
        const today = new Date();
        today.setHours(0,0,0,0);

        if (filter === 'Today') {
            filteredTasks = this.tasks.filter(task => {
                if (!task.dueDate) return false;
                const taskDate = new Date(task.dueDate);
                taskDate.setHours(0, 0, 0, 0);

                return taskDate.toDateString() === today.toDateString();
            });
        } else if (filter === 'This Week') {
            filteredTasks = this.tasks.filter(task => {
                if (!task.dueDate) return false;
                const taskDate = new Date(task.dueDate);

                // Basic logic: task is due between now and 7 days from now
                const oneWeekFromNow = new Date();
                oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

                return taskDate >= today && taskDate <= oneWeekFromNow;
            });
        } else if (filter === 'Inbox') { // ⬅️ Handle Inbox specifically
            // Inbox shows tasks with no assigned project
            filteredTasks = this.tasks.filter(task => !task.projectName);
        } 
            // This handles all other filters (which we assume are Project Names)
        else { 
            filteredTasks = this.tasks.filter(task => {
                return task.projectName === filter;
            });
        }
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };

    return filteredTasks.sort((a, b) => {
        // --- 1. Primary Sort: Priority (Descending) ---
        const priorityA = priorityOrder[a.priority] || 0;
        const priorityB = priorityOrder[b.priority] || 0;

        // If priorities are different, sort by priority (e.g., High comes before Medium)
        if (priorityB !== priorityA) {
            return priorityB - priorityA; 
        }

        // --- 2. Secondary Sort: Due Date (Ascending - Soonest first) ---
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        
        // If dates are different, sort by date (e.g., Jan 1 comes before Jan 5)
        if (dateA !== dateB) {
            // Subtracting Date B from Date A gives tasks due sooner a negative result, pushing them up.
            return dateA - dateB;
        }

        // --- 3. Tertiary Sort: No difference (Maintain original order) ---
        return 0; 
    });
    }
}