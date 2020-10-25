function addedUserName() {
	if (!localStorage.username) {
		window.open(chrome.extension.getURL("../pages/welcome.html"));
	} else {
		window.open(chrome.extension.getURL("../index.html"));
	}
}

document.querySelector(".start-typing").addEventListener("click", addedUserName);
