//tasks.js
//The primary responsibility of this class is to manage the state of a single to-do item.
export class Task {
    constructor(title, priority = 'Medium', dueDate = null) {
        this.title = title;
        this.isComplete = false;
        this.id = this.generateId();
        this.priority = priority;
        this.dueDate = dueDate;
    }

    toggleCompletion(){
        this.isComplete = !this.isComplete;
    }

    generateId(){
        return Date.now().toString(36) + Math.random.toString(36).substring(2);
    }

    static fromData(data){
        const task = new Task(data.title);
        task.isComplete = data.isComplete;
        task.id = data.id;
        task.priority = data.priority || 'Medium';
        task.dueDate = data.dueDate || null ;
        return task
    }
}