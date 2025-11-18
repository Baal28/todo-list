//TaskItemVIew.js
export class TaskItemView {
    constructor(task, onDeleteCallback ,onToggleCallback) {
        this.task = task;
        this.onDeleteCallback = onDeleteCallback;
        this.onToggleCallback = onToggleCallback;
    }

    render(){
        const listItem = document.createElement('li');
        listItem.id = this.task.id;
    
        // Apply completion status class
        if (this.task.isComplete) {
            listItem.classList.add('completed');
        }

        // 1. Create Title Container (Grid Column 1: Left side)
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('task-title-container');
        titleContainer.textContent = this.task.title;
    
        // 2. Create Checkbox Input (Part of the Right Group)
        const input = document.createElement('input');
        input.setAttribute('type','checkbox');
        input.checked = this.task.isComplete;
        input.addEventListener('change', () =>{
            this.onToggleCallback(this.task.id);
        });

        // 3. Create Delete Button (Part of the Right Group)
        const btn = document.createElement('button');
        btn.textContent = 'Delete';
        btn.addEventListener('click', () =>{
            this.onDeleteCallback(this.task.id);
        });

        //Create the Controls Group Container (Grid Column 2: Right side) ⬇️
        const controlsGroup = document.createElement('div');
        controlsGroup.classList.add('task-controls'); // CSS uses this to apply Flexbox

        // Append controls to the group container (Checkbox first, then Button)
        controlsGroup.appendChild(input); 
        controlsGroup.appendChild(btn); 
    
        // 4. Append the two main elements to the listItem for the 2-column Grid:
        listItem.appendChild(titleContainer); // Grid Column 1 (1fr, the text)
        listItem.appendChild(controlsGroup);  // Grid Column 2 (auto, the controls)
    
        return listItem;
    }
}