//index.js
import "./styles.css"
import { TaskManager } from "./taskManager.js";
import { LocalStorageManager } from "./storageManager.js";
import { TaskListView } from "./TaskListView.js";
import { TaskController } from "./TaskController.js";

const storageService = new LocalStorageManager();
const task1 = new TaskManager(storageService);