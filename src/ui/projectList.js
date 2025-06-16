import { createElementWithClass, setAttributes } from "../../utils/utils";
import { state } from "../state/state";

const container = document.getElementById("projects__list");

const renderProjectsList = () => {
	if (!container) return;

	container.innerHTML = "";

	for (const project of state.projects) {
		const projectItem = createElementWithClass("div", "project-item");

		setAttributes(projectItem, { "data-id": project.id });

		const projectName = document.createElement("p");
		projectName.textContent = project.name;
		projectItem.appendChild(projectName);

		const menu = createElementWithClass("div", "menu");

		const actionBtn = setAttributes(document.createElement("button"), {
			className: "action-btn",
			"data-action-btn": project.id,
			ariaLabel: "Menu",
		});

		const ellipsisImg = setAttributes(document.createElement("img"), {
			src: "./ellipses.svg",
			alt: "Vertical ellipsis icon with three evenly spaced dots, commonly used to indicate a menu with more options.",
			width: "18",
			height: "18",
		});
		actionBtn.appendChild(ellipsisImg);

		const dropdown = createElementWithClass("div", "dropdown");
		setAttributes(dropdown, {
			"data-dropdown": project.id,
			role: "menu",
		});

		const dropdownGroup = createElementWithClass("div", "");
		setAttributes(dropdownGroup, {
			role: "group",
			"aria-label": "Project actions",
		});

		const addBtn = createMenuItem(
			"add",
			"Add New Task",
			"./add.svg",
			"Plus sign icon representing the action to add a new item.",
		);

		const deleteBtn = createMenuItem(
			"delete",
			"Delete",
			"./delete.svg",
			"Delete icon",
		);

		dropdownGroup.append(addBtn, deleteBtn);
		dropdown.appendChild(dropdownGroup);
		menu.append(actionBtn, dropdown);
		projectItem.appendChild(menu);

		container.appendChild(projectItem);
	}
};

const createMenuItem = (id, text, imgSrc, imgAlt) => {
	const menuItem = setAttributes(document.createElement("button"), {
		className: "menu-item",
		role: "menuitem",
		"data-action": id,
	});

	const img = setAttributes(document.createElement("img"), {
		src: imgSrc,
		alt: imgAlt,
		width: "18",
		height: "18",
	});

	menuItem.appendChild(img);
	menuItem.append(document.createTextNode(text));

	return menuItem;
};

export default renderProjectsList;
