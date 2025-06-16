import { showNotification } from "../ui/notification";
import { renderTasks } from "../ui/taskList";
import { openEditModal } from "./modal";

import {
	addStandaloneTask,
	addTaskToProject,
	deleteTask,
	findTaskLocation,
	getTask,
	state,
	updateTask,
} from "../state/state";

export const handleAddTask = (task, projectId = null) => {
	let success = false;
	const taskName = task.title;

	if (projectId) {
		success = addTaskToProject(projectId, task);
	} else {
		const addedTask = addStandaloneTask(task);
		success = !!addedTask;
	}

	if (success) {
		renderTasks(state.currentProjectId);
		showNotification(`"${taskName}" added successfully`);
	}

	return success;
};

export const handleDeleteTask = (id) => {
	const task = getTask(id);
	const taskName = task?.title || "Task";

	const deleted = deleteTask(id);

	if (deleted) {
		renderTasks(state.currentProjectId);
		showNotification(`"${taskName}" deleted`);
	}

	return deleted;
};

export const handleEditTask = (id) => {
	const loc = findTaskLocation(id);
	const task = getTask(id);

	if (!task || !loc) return;

	if (loc.type === "standalone") {
		openEditModal(task, loc.index, "standalone");
	} else if (loc.type === "project") {
		openEditModal(task, loc.index, "project", loc.projectId);
	}
};

export const handleUpdateTask = (id, updates) => {
	const updated = updateTask(id, updates);

	if (updated) {
		renderTasks(state.currentProjectId);
		showNotification("Task updated successfully");
	}

	return updated;
};

// TASK QUERIES
export const getTaskName = (id) => {
	const task = getTask(id);
	return task?.title || "Unknown Task";
};

export const setUpTaskListEvents = () => {
	document.body.addEventListener("click", (e) => {
		const actionBtn = e.target.closest("[data-id]");
		const allTasks = document.getElementById("allTasks");

		if (e.target === allTasks) {
			const allProjectItems = document.querySelectorAll(".project-item");
			// biome-ignore lint/complexity/noForEach: <explanation>
			allProjectItems.forEach((item) => item.classList.remove("active"));

			state.currentProjectId = null;
			renderTasks();
		}

		if (!actionBtn) return;

		const action = actionBtn.dataset.action;
		const id = actionBtn.dataset.id;

		if (action === "delete-task") {
			const taskTitle = getTaskName(id);
			showNotification(`${taskTitle} task deleted`);
			handleDeleteTask(id);
		} else if (action === "edit-task") {
			handleEditTask(id);
		}
	});
};
