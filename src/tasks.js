//tasks.js
//The primary responsibility of this class is to manage the state of a single to-do item.
export class Task {
    constructor(title) {
        this.title = title;
        this.isComplete = false;
        this.id = this.generateId();
    }

    toggleCompletion(){
        this.isComplete = !this.isComplete;
    }

    generateId(){
        return Date.now().toString(36) + Math.random.toString(36).substring(2);
    }
}