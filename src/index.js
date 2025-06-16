import "../styles/styles.css";
import "../styles/modal.css";
import "../styles/menu.css";
import { openCreateModal } from "./controllers/modal";
import {
	setupProjectHandlers,
	setupProjectsListEvents,
} from "./controllers/projectsController";
import { setUpTaskListEvents } from "./controllers/taskController";
import { createDefaultProject, createDefaultTask } from "./state/state";
import { loadFromLocalStorage } from "./state/storage";
import { initModal } from "./ui/modal";
import renderProjectList from "./ui/projectList";
import { renderTasks } from "./ui/taskList";

// localStorage.clear();

const getAppData = () => {
	try {
		return JSON.parse(
			localStorage.getItem("todoApp") || '{"projects":[],"standaloneTasks":[]}',
		);
	} catch (error) {
		console.error("Failed to parse localStorage data:", error);
		return { projects: [], standaloneTasks: [] };
	}
};

const initializeDefaultData = () => {
	const appData = getAppData();

	if (!localStorage.getItem("todoApp") || appData.projects.length === 0) {
		createDefaultProject();
	}

	if (appData.standaloneTasks.length === 0) {
		createDefaultTask();
	}
};

const initializeApp = () => {
	initializeDefaultData();
	loadFromLocalStorage();
};

initializeApp();

const initializeUI = () => {
	setupProjectHandlers();
	setupProjectsListEvents();
	renderProjectList();
	setUpTaskListEvents();
	renderTasks();
	initModal();

	const createNewTaskBtn = document.getElementById("create-task-btn");
	createNewTaskBtn.addEventListener("click", openCreateModal);
};
document.addEventListener("DOMContentLoaded", initializeUI);
