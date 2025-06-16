import { addStandaloneTask, addTaskToProject, state } from "../state/state";
import { saveToLocalStorage } from "../state/storage";
import { closeModal, openModal } from "../ui/modal";
import { renderTasks } from "../ui/taskList";
export let modalContext = {
	mode: "create", // "edit"
	target: "standalone", // "project"
	projectId: null,
	taskIndex: null,
	taskId: null,
};

export const openCreateModal = (target = "standalone", projectId = null) => {
	modalContext = { mode: "create", target, projectId, taskIndex: null };
	clearFormFields();
	openModal();
};

export const openEditModal = (
	task,
	index,
	target = "project",
	projectId = null,
) => {
	modalContext = {
		mode: "edit",
		target,
		projectId,
		taskIndex: index,
		taskId: task.id,
	};
	populateFormFields(task);
	openModal();
};

const getFormValues = () => {
	return {
		title: document.getElementById("todo-title").value.trim(),
		desc: document.getElementById("todo-description").value.trim(),
		dueDate: document.getElementById("todo-due-date").value,
		priority: document.getElementById("todo-priority").value,
		note: document.getElementById("todo-notes").value.trim(),
		createdAt: new Date().toISOString(),
	};
};

const populateFormFields = (task) => {
	document.getElementById("todo-title").value = task.title;
	document.getElementById("todo-description").value = task.desc;
	document.getElementById("todo-due-date").value = task.dueDate;
	document.getElementById("todo-priority").value = task.priority;
	document.getElementById("todo-notes").value = task.note;
};

const clearFormFields = () => {
	document.getElementById("todo-title").value = "";
	document.getElementById("todo-description").value = "";
	document.getElementById("todo-due-date").value = "";
	document.getElementById("todo-priority").value = "low";
	document.getElementById("todo-notes").value = "";
};

document.getElementById("confirmBtn").addEventListener("click", () => {
	const task = getFormValues();

	if (modalContext.mode === "create") {
		if (modalContext.target === "project") {
			addTaskToProject(modalContext.projectId, task);
		} else {
			addStandaloneTask(task);
		}
	} else if (modalContext.mode === "edit") {
		task.id = modalContext.taskId;
		if (modalContext.target === "project") {
			const project = state.projects.find(
				(p) => p.id === modalContext.projectId,
			);
			const existingTask = project.todos[modalContext.taskIndex];
			project.todos[modalContext.taskIndex] = {
				...task,
				createdAt: existingTask.createdAt,
			};
		} else {
			const existingTask = state.standaloneTasks[modalContext.taskIndex];
			state.standaloneTasks[modalContext.taskIndex] = {
				...task,
				createdAt: existingTask.createdAt,
			};
		}
	}

	saveToLocalStorage();
	closeModal();
	renderTasks(modalContext.projectId);
});
