const overlay = document.getElementById("overlay");

let isMenuOpen = false;

export const openMenu = (projectId) => {
	const dropdown = document.querySelector(
		`.dropdown[data-dropdown="${projectId}"]`,
	);
	const actionBtn = document.querySelector(
		`.action-btn[data-action-btn="${projectId}"]`,
	);

	if (dropdown && actionBtn && overlay) {
		dropdown.classList.add("dropdown--active");
		actionBtn.classList.add("action-btn--active");
		overlay.classList.add("show");
		isMenuOpen = true;
	}
};

export const closeMenu = () => {
	const allDropdowns = document.querySelectorAll(".dropdown.dropdown--active");
	const allActionBtns = document.querySelectorAll(
		".action-btn.action-btn--active",
	);

	// biome-ignore lint/complexity/noForEach: <explanation>
	allDropdowns.forEach((dropdown) =>
		dropdown.classList.remove("dropdown--active"),
	);
	// biome-ignore lint/complexity/noForEach: <explanation>
	allActionBtns.forEach((btn) => btn.classList.remove("action-btn--active"));

	if (overlay) overlay.classList.remove("show");

	isMenuOpen = false;
};

overlay.addEventListener("click", () => {
	if (isMenuOpen) closeMenu();
});
