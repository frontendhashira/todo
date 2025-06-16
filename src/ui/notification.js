const notification = document.getElementById("notification");

export const showNotification = (message) => {
	notification.textContent = message;
	notification.classList.add("notification--show");

	setTimeout(() => {
		notification.classList.remove("notification--show");
	}, 3000);
};
