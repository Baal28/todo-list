//TaskItemVIew.js
export class TaskItemView {
    constructor(task) {
        this.task = task

    }

    render(){
        const listItem = document.createElement('li');
        listItem.textContent = this.task.title;
        listItem.id = this.task.id;

        const input = document.createElement('input');
        input.setAttribute('type','checkbox');
        input.checked = this.task.isComplete;
        listItem.appendChild(input);

        const btn = document.createElement('button');
        btn.textContent = 'Delete'
        listItem.appendChild(btn);

        
        return listItem;
    }
}