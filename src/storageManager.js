//storageManager.js
export class LocalStorageManager {
    loadTasks() {
        const data = localStorage.getItem('todo-tasks');
        return data ? JSON.parse(data) : [];
    }
    
    saveTasks(tasks){
        localStorage.setItem('todo-tasks', JSON.stringify(tasks));
    }
}