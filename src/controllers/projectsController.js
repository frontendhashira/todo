import { createProject, deleteProject, state } from "../state/state";
import { showNotification } from "../ui/notification";
import renderProjectsList from "../ui/projectList";
import { renderTasks } from "../ui/taskList";
import { closeMenu, openMenu } from "./menuController";
import { openCreateModal } from "./modal";

const projectInput = document.getElementById("project-input");
const addProject = document.getElementById("add-project-btn");
const container = document.getElementById("projects__list");

const handleAddProject = (name) => {
	createProject(name);
	renderProjectsList();
};

export const handleDeleteProject = (id) => {
	const deleted = deleteProject(id);
	if (deleted) {
		if (state.currentProjectId === null) {
			renderTasks();
		}
		renderProjectsList();
	}
};

const setupProjectHandlers = () => {
	addProject.addEventListener("click", () => {
		handleAddProject(projectInput.value);
		showNotification(`${projectInput.value} added to projects`);
		projectInput.value = "";
	});
};

export const handleAction = (action, projectName) => {
	closeMenu();

	let message = "";
	switch (action) {
		case "add":
			message = `Added ${projectName} task`;
			break;
		case "delete":
			message = `${projectName} deleted`;
			break;
	}

	showNotification(message);
};

const setupProjectsListEvents = () => {
	if (!container) return;
	let projectName;

	container.addEventListener("click", (e) => {
		const menuBtn = e.target.closest("[data-action-btn]");
		const menuItem = e.target.closest(".menu-item");
		const projectItem = e.target.closest(".project-item");

		if (projectItem && !menuBtn) {
			const allProjectItems = container.querySelectorAll(".project-item");
			// biome-ignore lint/complexity/noForEach: <explanation>
			allProjectItems.forEach((item) => item.classList.remove("active"));

			projectItem.classList.add("active");
			const projectId = projectItem.dataset.id;
			state.currentProjectId = projectId;
			renderTasks(projectId);
		}

		if (menuBtn) {
			const projectId = menuBtn.dataset.actionBtn;
			openMenu(projectId);
			projectName = state.projects.find((p) => p.id === projectId).name;
		}

		if (menuItem) {
			const action = menuItem.dataset.action;
			const parentMenu = e.target.closest(".menu");
			const actionBtn = parentMenu?.querySelector(".action-btn");
			const projectId = actionBtn?.dataset.actionBtn;

			if (action === "delete" && projectId) {
				handleDeleteProject(projectId);
				handleAction(action, projectName);
			}

			if (action === "add") {
				closeMenu();
				openCreateModal("project", projectItem.dataset.id);
			}
		}
	});
};

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") closeMenu();
});

export { setupProjectHandlers, setupProjectsListEvents };
