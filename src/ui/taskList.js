import {
	createButton,
	createElementWithClass,
	setAttributes,
} from "../../utils/utils.js";

import { getAllTasks, state } from "../state/state.js";

export const renderTasks = (projectId = null) => {
	state.currentProjectId = projectId;

	const taskWrapper = document.createElement("div");
	const allTaskBtn = createButton("allTasks", "all tasks");
	allTaskBtn.className = "all-tasks";

	const heading = document.createElement("h2");
	const project = state.projects.find((p) => p.id === projectId);

	if (projectId) taskWrapper.appendChild(allTaskBtn);
	heading.textContent = projectId ? `${project.name}'s Tasks` : "All Tasks";
	taskWrapper.appendChild(heading);

	const todoList = createElementWithClass("div", "todo-list");
	todoList.id = "todo-list";

	const tasks = getTasksToRender(projectId);
	const sortedtasks = tasks.sort(
		(a, b) => new Date(b.createdAt) - new Date(a.createdAt),
	);

	// biome-ignore lint/complexity/noForEach: <explanation>
	sortedtasks.forEach((task) => {
		const priorityClass = task.priority.toLowerCase();
		const taskEl = createElementWithClass("div", `todo__item ${priorityClass}`);

		const header = createElementWithClass("div", "todo__item-header");

		const title = createElementWithClass("h3", "todo__title");
		title.textContent = task.title;

		const actions = createElementWithClass("div", "todo__actions");
		const editBtn = document.createElement("button");
		const editImg = setAttributes(document.createElement("img"), {
			src: "./edit-white.svg",
			alt: "edit icon",
			width: "18",
			height: "18",
		});

		setAttributes(editBtn, {
			className: "todo__btn--edit",
			"aria-label": "Edit todo",
			"data-id": task.id,
			"data-action": "edit-task",
		});
		editBtn.appendChild(editImg);

		const deleteBtn = document.createElement("button");
		const delImg = setAttributes(document.createElement("img"), {
			src: "./delete-white.svg",
			alt: "delete icon",
			width: "18",
			height: "18",
		});

		setAttributes(deleteBtn, {
			className: "todo__btn--delete",
			"aria-label": "Delete todo",
			"data-id": task.id,
			"data-action": "delete-task",
		});

		deleteBtn.appendChild(delImg);

		actions.appendChild(editBtn);
		actions.appendChild(deleteBtn);

		header.appendChild(title);
		header.appendChild(actions);
		taskEl.appendChild(header);

		const meta = createElementWithClass("div", "todo__meta");
		meta.textContent = `Priority: ${capitalize(task.priority)} | Due Date: ${task.dueDate}`;
		taskEl.appendChild(meta);

		const desc = createElementWithClass("p", "todo__description");
		desc.textContent = task.desc;
		taskEl.appendChild(desc);

		const notes = createElementWithClass("div", "todo__notes");
		notes.textContent = task.note;
		taskEl.appendChild(notes);

		todoList.appendChild(taskEl);
	});

	taskWrapper.appendChild(todoList);

	const target = document.querySelector(".tasks__container");

	if (target) {
		target.innerHTML = "";
		target.appendChild(taskWrapper);
	}
};

const getTasksToRender = (projectId) => {
	if (projectId) {
		const project = state.projects.find((p) => p.id === projectId);
		return project?.todos || [];
	}
	return getAllTasks();
};

const capitalize = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
