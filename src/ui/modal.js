const modal = document.getElementById("modal");
const modalOverlay = document.getElementById("modalOverlay");
const closeBtn = document.getElementById("close-modal");
const cancleBtn = document.getElementById("cancelBtn");

export const openModal = () => {
	modalOverlay.classList.add("show");
	modal.classList.add("show");
	document.body.style.overflow = "hidden";
};

export const closeModal = () => {
	modalOverlay.classList.remove("show");
	modal.classList.remove("show");
	document.body.style.overflow = "";
};

export const initModal = () => {
	modalOverlay.addEventListener("click", (e) => {
		closeModal();
	});
	modal.addEventListener("click", (e) => {
		e.stopPropagation();
	});
	closeBtn.addEventListener("click", closeModal);
	cancleBtn.addEventListener("click", closeModal);

	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") closeModal();
	});
};
