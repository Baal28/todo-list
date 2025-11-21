//TaskItemVIew.js
export class TaskItemView {
    constructor(task, onDeleteCallback ,onToggleCallback, onUpdateCallback, onRenderNeededCallback, taskController) {
        this.task = task;
        this.isEditing = false;
        this.onDeleteCallback = onDeleteCallback;
        this.onToggleCallback = onToggleCallback;
        this.onUpdateCallback = onUpdateCallback;
        this.onRenderNeededCallback = onRenderNeededCallback;
        this.taskController = taskController;
    }

    render(){
        const listItem = document.createElement('li');
        listItem.id = this.task.id;
    
        // Apply completion status class
        if (this.task.isComplete) {
            listItem.classList.add('completed');
        }

        // 🚨 CRITICAL FIX: Check the Controller's persistent state (editingTaskId)
        // If the task's ID matches the ID stored in the controller, render the edit form.
        if (this.taskController.editingTaskId === this.task.id) {
            listItem.appendChild(this.createEditForm());
            listItem.classList.add('editing-mode');
        } else {
            listItem.appendChild(this.createDisplayView());
            listItem.classList.remove('editing-mode');
        }
        return listItem;
    }

    createDisplayView(){
        const fragment = document.createDocumentFragment();

        // 1. Create Title Container (Grid Column 1: Left side)
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('task-title-container');
        

        //1.2 Create element for priority and apply class for styling
        const prioritySpan = document.createElement('span');
        prioritySpan.classList.add('task-priority', `priority-${this.task.priority.toLowerCase()}`);
        prioritySpan.textContent = `[${this.task.priority}]`;

        //1.3 Create element for due date
        const dateSpan = document.createElement('span');
        dateSpan.classList.add('task-due-date');

        if (this.task.dueDate) {
            dateSpan.textContent = `Due: ${this.task.dueDate}`;
        }

        // 1.4 Create element for title
        const titleText = document.createElement('span');
        titleText.textContent = this.task.title;

        //1.5 Append ALL elements to the container
        
        titleContainer.appendChild(prioritySpan);
        titleContainer.appendChild(dateSpan);
        titleContainer.appendChild(titleText);
    
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
        btn.classList.add('btn-del')
        btn.addEventListener('click', () =>{
            this.onDeleteCallback(this.task.id);
        });

        //Create the Controls Group Container (Grid Column 2: Right side) ⬇️
        const controlsGroup = document.createElement('div');
        controlsGroup.classList.add('task-controls'); // CSS uses this to apply Flexbox

        // Create the new EDIT Button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('btn-edit');
        editBtn.addEventListener('click', () =>{
            this.onRenderNeededCallback(this.task.id);
        });

        // Append controls to the group container (Checkbox first, then Button)
        controlsGroup.appendChild(input);
        controlsGroup.appendChild(editBtn);
        controlsGroup.appendChild(btn); 
    
        // 4. Append the two main elements to the listItem for the 2-column Grid:
        fragment.appendChild(titleContainer); // Grid Column 1 (1fr, the text)
        fragment.appendChild(controlsGroup);  // Grid Column 2 (auto, the controls)
    
        return fragment;
    }

    createEditForm() {
        // We use a form element to easily capture all input values on submit
        const editForm = document.createElement('form');
        editForm.classList.add('task-edit-form'); 
    
        // --- 1. Title Input ---
        const titleInput = document.createElement('input');
        titleInput.setAttribute('type', 'text');
        titleInput.setAttribute('name', 'title');
        titleInput.value = this.task.title;
        titleInput.required = true;
        titleInput.classList.add('edit-input-title');

        // --- 2. Priority Select ---
        const prioritySelect = document.createElement('select');
        prioritySelect.setAttribute('name', 'priority');
        prioritySelect.classList.add('edit-input-priority');

        // Options mapping (must match your Task Model setup)
        const priorities = ['Low', 'Medium', 'High'];
        priorities.forEach(p => {
            const option = document.createElement('option');
            option.value = p;
            option.textContent = p;
            if (this.task.priority === p) {
                option.selected = true; // Select the current priority
            }
            prioritySelect.appendChild(option);
        });

        // --- 3. Due Date Input ---
        const dateInput = document.createElement('input');
        dateInput.setAttribute('type', 'date');
        dateInput.setAttribute('name', 'dueDate');
        dateInput.value = this.task.dueDate || ''; // Populate with current date

        // --- 4. Controls (Save/Cancel Buttons) ---
        const saveBtn = document.createElement('button');
        saveBtn.setAttribute('type', 'submit');
        saveBtn.textContent = 'Save';
        saveBtn.classList.add('btn-save');

        const cancelBtn = document.createElement('button');
        cancelBtn.setAttribute('type', 'button'); // IMPORTANT: Prevents submission
        cancelBtn.textContent = 'Cancel';
        cancelBtn.classList.add('btn-cancel');
        

        // --- 5. Event Handling (Save) ---
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
        
            // Get the new values from the form inputs
            const newTitle = e.target.elements.title.value;
            const newPriority = e.target.elements.priority.value;
            const newDueDate = e.target.elements.dueDate.value;
        
            // 🚨 CRITICAL: Call the Controller's update handler
            this.onUpdateCallback(this.task.id, newTitle, newPriority, newDueDate);

            // Reset the view state after save is initiated
            this.isEditing = false;
        
            // Note: The controller's handleUpdateTask will call TaskListView.render(), 
            // which rebuilds the whole list, showing the updated task in display mode.
        });

        // --- 6. Event Handling (Cancel) ---
        cancelBtn.addEventListener('click', () => {
            // This requires the parent list to re-render to show display mode again
            this.onRenderNeededCallback(null); // Assuming this callback exists for re-render
        });

        // --- 7. Assembly ---
        const inputGroup = document.createElement('div');
        inputGroup.classList.add('edit-input-group');
        inputGroup.appendChild(titleInput);
        inputGroup.appendChild(prioritySelect);
        inputGroup.appendChild(dateInput);

        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('edit-button-group');
        buttonGroup.appendChild(saveBtn);
        buttonGroup.appendChild(cancelBtn);

        editForm.appendChild(inputGroup);
        editForm.appendChild(buttonGroup);

        return editForm;
    }
}