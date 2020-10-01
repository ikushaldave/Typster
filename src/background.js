chrome.runtime.onInstalled.addListener((e) => {
	if (e.reason === "install") window.open("../pages/welcome.html");
	console.log(e);
});
