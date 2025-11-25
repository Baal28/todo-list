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
        this.renderSidebar();
        this.renderProjectDropdown();
        this.taskListView.render();
    }

    handleProjectListClick = (e) => {
        const target = e.target;
        e.preventDefault();

        if (target.tagName === 'SPAN') {
            const projectName = target.textContent.trim();
            this.setFilter(projectName);
            document.querySelectorAll('#sidebar .active').forEach(el => el.classList.remove('active'));
            target.classList.add('active');
        } else if (target.classList.contains('delete-project-btn')) {
            const listItem = target.closest('li');
            if (listItem) {
                const projectName = listItem.querySelector('span').textContent.trim();
                this.handleDeleteProject(projectName);
            }
        }
    };

    renderProjectDropdown = () => {
        const taskForm = document.querySelector('#task-form');
        if (!taskForm) return;

        const existingSelect = document.getElementById('task-project-select');
            if (existingSelect) {
                existingSelect.remove();
            }

        // 1. Get the list of projects
        const projects = this.taskManager.getProjects();

        // 2. Create the <select> element
        const select = document.createElement('select');
        select.name = 'project'; // CRITICAL: Used to read the value in handleAddTodo
        select.id = 'task-project-select';

        // 3. Add the default 'No Project' option (acts as the Inbox assignment)
        let defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Inbox / No Project';
        select.appendChild(defaultOption);

        // 4. Add all project options
        projects.forEach(project => {
            let option = document.createElement('option');
            option.value = project;
            option.textContent = project;
            select.appendChild(option);
        });

        // 5. Inject the select element into the form (adjust selector as needed)
        // Find a logical place, e.g., before the 'Add' button.
        const addButton = taskForm.querySelector('button');
        if (addButton) {
            taskForm.insertBefore(select, addButton);
        } else {
            taskForm.appendChild(select);
        }
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

        const projectBtn = document.querySelector('#add-project-btn');
        projectBtn.addEventListener('click', this.handleAddProject);

        const projectList = document.querySelector('.project-list');
        projectList.addEventListener('click', this.handleProjectListClick);
    }

    handleAddProject = () => {
        const projectName = prompt('Enter the name of the new project');

        if (projectName && projectName.trim()) {
            const cleanName = projectName.trim();
            const success = this.taskManager.addProject(cleanName);

            if (success) {
                this.renderSidebar();
            } else {
                alert(`Project "${cleanName}" already exists or name is invalid.`)
            }
        }
    }

    handleUpdateTask(id, newTitle, newPriority, newDueDate, newProjectName){
        if (!newTitle) {
            return;
        }
        
        // 1. Perform the update
        this.taskManager.updateTask(id, newTitle, newPriority, newDueDate, newProjectName);
        
        // 2. Clear editing state
        this.editingTaskId = null;

        // 3. Contextual Filter Check (NEW LOGIC)
        // If the user is currently viewing a specific project (filter is NOT a core filter),
        // and the task was moved OUT of that project (newProjectName is different or empty),
        // we should reset the filter to 'Inbox' so the task doesn't disappear completely.
        
        const coreFilters = ['Inbox', 'Today', 'This Week'];

        if (!coreFilters.includes(this.currentFilter) && this.currentFilter !== newProjectName) {
            // If the current filter is a project name AND the task was moved away from it,
            // switch the filter to 'Inbox' to reset the view.
            this.setFilter('Inbox');
            
            // Note: setFilter calls render() internally, so we skip the next line.
            return; 
        }

        // 4. If filter hasn't changed, just re-render the current view
        this.taskListView.render();
    }

    renderSidebar = () => {
        const projectListElement = document.querySelector('.project-list');
            if (!projectListElement) return;

        const projects = this.taskManager.getProjects();
        projectListElement.innerHTML = ''; // Clear existing list

        projects.forEach(project => {
            const listItem = document.createElement('li');
        
            const span = document.createElement('span');
            span.textContent = project;
        
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'X';
            deleteBtn.classList.add('delete-project-btn'); 
        
            listItem.appendChild(span);
            listItem.appendChild(deleteBtn);
            projectListElement.appendChild(listItem);
        });
    
        // Re-bind the click listeners for the new project spans
        this.renderProjectDropdown();
        this.bindEvents();
    }

    handleDeleteProject = (projectName) => {
        if (confirm(`Are you sure you want to delete the project "${projectName}"? All tasks in this project will be moved to the Inbox.`)) {
            const success = this.taskManager.deleteProject(projectName);

            if (success) {
                // After deleting, switch the view to Inbox and re-render the sidebar
                this.setFilter('Inbox'); 
                this.renderSidebar();
            } else {
                alert(`Cannot delete project: ${projectName}.`);
            }
        }
    }

    handleAddTodo(e){
        const title = e.target.elements.title.value;
        const priority = e.target.elements.priority.value;
        const dueDate = e.target.elements.dueDate.value;
        const projectName = e.target.elements.project.value;

        this.taskManager.addTask(title, priority, dueDate, projectName);

        e.target.elements.title.value = '';
        this.taskListView.render();
    }

    handleUpdateTask(id, newTitle, newPriority, newDueDate, newProjectName){
        if (!newTitle) {
            return;
        }
        this.taskManager.updateTask(id, newTitle, newPriority, newDueDate, newProjectName);
        this.editingTaskId = null;

        const coreFilters = ['Inbox', 'Today', 'This Week'];

        if (!coreFilters.includes(this.currentFilter) && this.currentFilter !== newProjectName) {
            this.setFilter('Inbox');
            return;
        }
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

        document.querySelectorAll('#sidebar .active').forEach(el => el.classList.remove('active'));

        const allFilterElements = document.querySelectorAll('#sidebar ul li a, #sidebar ul.project-list li span');

        const newActiveElement = Array.from(allFilterElements).find(el => {
            return el.textContent.trim() === filterName;
        });

        if (newActiveElement) {
            newActiveElement.classList.add('active');
        }
        this.taskListView.render();
    }

    getFilteredTasks(){
        return this.taskManager.getTasks(this.currentFilter);
    }
}