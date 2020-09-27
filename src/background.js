chrome.runtime.onInstalled.addListener((e) => {
	if (e.reason === "install") window.open("../welcome.html");
	console.log(e);
});
