
let input = document.querySelector("input.wel-input");
let button = document.querySelector("button.wel-button");
console.dir(input);

function handleEnter(e) {
    if (e.keyCode === 13) {
        console.log("enter pressed");
        console.log(e.target.value);
        localStorage.setItem("username", e.target.value);
        window.location.href = chrome.extension.getURL('../index.html')
    }
}
function handleClick(e) {
    localStorage.setItem("username", input.value);
    window.location.href = chrome.extension.getURL('../index.html')
}

input.addEventListener("keydown", handleEnter);
button.addEventListener("click", handleClick);