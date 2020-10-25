let input = document.querySelector(".wcl-input");
let button = document.querySelector(".wlcBtn");

function handleEnter(e) {
	if (e.keyCode === 13 && e.target.value.trim()) {
		localStorage.setItem("username", e.target.value);
		addedUserName();
	}
}

function addedUserName() {
	if (!localStorage.username) {
		window.open(chrome.extension.getURL("../pages/welcome.html"), "_self");
	} else {
		window.open(chrome.extension.getURL("../index.html"), "_self");
	}
}

function handleClick(e) {
	e.preventDefault();
	if (input.value.trim()) {
		localStorage.setItem("username", input.value);
		addedUserName();
	}
	input.value = "";
}

input.addEventListener("keydown", handleEnter);
button.addEventListener("click", handleClick);
