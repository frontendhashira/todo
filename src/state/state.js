import { saveToLocalStorage } from "./storage";

export const state = {
	currentProjectId: "",
	projects: [],
	standaloneTasks: [],
};

export const findTaskLocation = (id) => {
	const standaloneIndex = state.standaloneTasks.findIndex(
		(task) => task.id === id,
	);
	if (standaloneIndex !== -1)
		return { type: "standalone", index: standaloneIndex };

	for (const project of state.projects) {
		const taskIndex = project.todos.findIndex((task) => task.id === id);
		if (taskIndex !== -1)
			return { type: "project", projectId: project.id, index: taskIndex };
	}
	return null;
};

export const addTaskToProject = (projectId, task) => {
	const project = state.projects.find((p) => p.id === projectId);
	if (!project) return false;

	if (!task.id) {
		task.id = generateId();
	}
	project.todos.unshift(task);
	saveToLocalStorage();
	return true;
};

export const addStandaloneTask = (task) => {
	if (!task.id) {
		task.id = generateId();
	}
	state.standaloneTasks.unshift(task);
	saveToLocalStorage();
	return task;
};

export const deleteTask = (id) => {
	const loc = findTaskLocation(id);
	let deleted = false;

	if (loc?.type === "standalone") {
		state.standaloneTasks.splice(loc.index, 1);
		deleted = true;
	} else if (loc?.type === "project") {
		const project = state.projects.find((p) => p.id === loc.projectId);
		if (project) {
			project.todos.splice(loc.index, 1);
			deleted = true;
		}
	}

	if (deleted) {
		saveToLocalStorage();
	}
	return deleted;
};

export const editTask = (id) => {
	const loc = findTaskLocation(id);
	if (loc?.type === "standalone") {
		const task = state.standaloneTasks.find((p) => p.id === id);
		openEditModal(task, loc.index, "standalone");
	} else if (loc?.type === "project") {
		const project = state.projects.find((p) => p.id === loc.projectId);
		const task = project?.todos.find((p) => p.id === id);
		openEditModal(task, loc.index, "project", loc.projectId);
	}
};

export const getAllTasks = () => {
	const projectTasks = state.projects.flatMap((project) =>
		project.todos.map((todo) => ({ ...todo })),
	);

	return [...projectTasks, ...state.standaloneTasks];
};

export const updateTask = (id, updates) => {
	const loc = findTaskLocation(id);
	let updated = false;

	if (loc?.type === "standalone") {
		const task = state.standaloneTasks[loc.index];
		Object.assign(task, updates);
		updated = true;
	} else if (loc?.type === "project") {
		const project = state.projects.find((p) => p.id === loc.projectId);
		const task = project?.todos[loc.index];
		if (task) {
			Object.assign(task, updates);
			updated = true;
		}
	}

	if (updated) saveToLocalStorage();
	return updated;
};

export const getTask = (id) => {
	const loc = findTaskLocation(id);
	if (loc?.type === "standalone") {
		return state.standaloneTasks.find((t) => t.id === id);
	}

	if (loc?.type === "project") {
		const project = state.projects.find((p) => p.id === loc.projectId);
		return project?.todos.find((t) => t.id === id);
	}
	return null;
};

const getTaskName = (id) => {
	const loc = findTaskLocation(id);

	if (loc?.type === "standalone") {
		const task = state.standaloneTasks.find((p) => p.id === id);
		return task.title;
	}

	if (loc?.type === "project") {
		const project = state.projects.find((p) => p.id === loc.projectId);
		const task = project?.todos.find((p) => p.id === id);
		return task.title;
	}
};

export const createDefaultTask = () => {
	if (state.projects.standaloneTasks > 0) return;

	const task = {
		id: generateId(),
		title: "Play chess with AI",
		desc: "Try not to lose to the bot… again.",
		dueDate: "2025-06-12",
		priority: "low",
		note: "Tried to castle, but life threw me a null pointer instead. Queen-side refactor coming soon.",
		createdAt: new Date().toISOString(),
	};

	state.standaloneTasks.push(task);
	saveToLocalStorage();
};

export const createDefaultProject = () => {
	if (state.projects.length > 0) return;
	const defaultProject = {
		id: generateId(),
		name: "Sample Project – Debugging Reality",
		todos: [
			{
				id: generateId(),
				title: "Refactor spaghetti code",
				desc: "Turn a pasta dish into a fine dining experience.",
				dueDate: "2025-06-12",
				priority: "high",
				note: "It's not a bug, it's an undocumented feature. Also, don't forget to sacrifice a rubber duck.",
				createdAt: new Date().toISOString(),
			},
		],
	};
	state.projects.push(defaultProject);
	state.currentProjectId = defaultProject.id;
	saveToLocalStorage();
};

export const createProject = (name) => {
	const projectName = name.trim();
	if (projectName) {
		const newProject = {
			id: generateId(),
			name: projectName,
			todos: [],
		};
		state.projects.push(newProject);
		saveToLocalStorage();
		return newProject;
	}
};

export const deleteProject = (id) => {
	const projectInd = state.projects.findIndex((p) => p.id === id);
	if (projectInd !== -1) {
		state.projects.splice(projectInd, 1);
		if (state.currentProjectId === id) {
			state.currentProjectId = null;
		}
		saveToLocalStorage();
		return true;
	}
	return false;
};

export const generateId = () => {
	const id =
		Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
	return id;
};

export { getTaskName };
