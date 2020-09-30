let latest = null;
let index = 0;

// DOM Selectors
const level = document.querySelector(".levels");
const levelSelector = document.querySelector(".exercise-level-list");
const ul = document.querySelector(".exercise-level-list");
const writingText = document.querySelector(".writing-text");
const typewriter = document.querySelector(".typewriter");
let active = document.querySelector(".active").textContent.toLowerCase();
let text = "";
// stats
const grade = document.querySelector(".grade");
const speed = document.querySelector(".speed");
const time = document.querySelector(".time");
const wordLeft = document.querySelector(".word-left");
const error = document.querySelector(".error");

function levelHandler(e) {
	if (e.target.classList.contains("level-btn")) {
		let targeted = e.target.innerText.toLowerCase();
		carouselUi(levels[targeted].length, targeted);
		[...level.children].forEach((e) => e.classList.remove("active"));
		e.target.classList.add("active");
		active = targeted;
	}
}
// carousel ui function

function carouselUi(len, lvl) {
	ul.innerHTML = "";
	for (let i = 0; i < len; i++) {
		let li = document.createElement("li");
		let btn = document.createElement("button");
		btn.innerHTML = `<span class="level-number">${i + 1}</span>
                          <span class="exercise-rating">
                              <i class="fa fa-star-o"></i>
                              <i class="fa fa-star-o"></i>
                              <i class="fa fa-star-o"></i>
                          </span>`;
		li.setAttribute("data-level", i);
		if (levels[lvl][i].locked) {
			li.classList.add("locked");
			let lock = document.createElement("i");
			lock.classList.add("fa", "fa-lock", "lock-icon");
			btn.append(lock);
		}
		li.append(btn);
		li.addEventListener("click", carouselHandler);
		ul.append(li);
	}
}

// carousel handler function
function carouselHandler(e) {
	if (!e.currentTarget.classList.contains("locked")) {
		let index = e.currentTarget.dataset.level;
		createUi(levels[active][index].typing);
	}
}

function createUi(writingTest, t, w, er, g = 0, s = 0) {
	console.trace("calling creaing UI");
	writingText.innerText = writingTest;
	time.innerText = t;
	error.innerText = er;
	wordLeft.innerText = writingTest.split(" ").length;
	text = [...writingText.innerText];
	for (let i = 0; i < g; i++) {
		grade.children[i].classList.remove("fa-star").add("fa-star-o");
	}
	speed.innerText = s;
	if (!document.querySelector(".overlay")) {
		overlayGenerate();
	}
	document.addEventListener("keyup", gameLogicHandler);
}

function overlayGenerate() {
	const div = document.createElement("div");
	const btn = document.createElement("button");
	btn.textContent = "Start Typing";
	div.classList.add("overlay");
	div.append(btn);
	typewriter.append(div);
}

function latestIndex() {
	levels[active].forEach((ele, i) => {
		if (!ele.locked) {
			latest = levels[active][i];
		}
	});
}

function gameLogicHandler(e) {
	e.preventDefault();
	let overlay = document.querySelector(".overlay");
	str = "";
	console.log(index);
	console.log(overlay);

	if (overlay && e.key === text[0]) {
		console.log("working");
		overlay = overlay.remove();
		index = 0;
	}

	if (!overlay && ((e.keyCode > 47 && e.keyCode < 91) || (e.keyCode > 95 && e.keyCode < 112) || (e.keyCode > 185 && e.keyCode < 223) || e.keyCode === 32)) {
		if (text[index] === e.key) {
			console.log("match");
			text[index] = `<span class="correct-text">${text[index]}</span>`;
			writingText.innerHTML = text.join("");
			console.log(text);
		} else {
			console.log("not match");
			text[index] = `<span class="wrong-text">${text[index]}</span>`;
			writingText.innerHTML = text.join("");
			console.log(text);
		}
		index++;

		gameCompleted();
	}
}

function gameCompleted() {
	if (text.length === index + 1) {
		console.log("game over");
		document.body.removeEventListener("keyup", gameLogicHandler);
	}
}

latestIndex();
createUi(latest.typing);
carouselUi(levels[active].length, active);

level.addEventListener("click", levelHandler);
