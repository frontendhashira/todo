import { state } from "./state";

const loadFromLocalStorage = () => {
	const data = localStorage.getItem("todoApp");
	if (data) {
		const parsedData = JSON.parse(data);
		state.projects = parsedData.projects || [];
		state.projects.currentProjectId = parsedData.currentProjectId;
		state.standaloneTasks = parsedData.standaloneTasks;
	}
};

const saveToLocalStorage = () => {
	localStorage.setItem(
		"todoApp",
		JSON.stringify({
			projects: state.projects,
			currentProjectId: state.currentProjectId,
			standaloneTasks: state.standaloneTasks,
		}),
	);
};

export { loadFromLocalStorage, saveToLocalStorage };
