let input = document.querySelector("input");
console.dir(input);
input.addEventListener("keydown", function (e) {
	console.log(e.keyCode);
	if (e.keyCode === 13) {
		console.log("enter pressed");
		console.log(e.target.value);
		localStorage.setItem("username", e.target.value);
	}
});
