let latest = null;
let index = 0;
let mistakes = 0;
// DOM Selectors
const level = document.querySelector(".levels");
const levelSelector = document.querySelector(".exercise-level-list");
const ul = document.querySelector(".exercise-level-list");
const writingText = document.querySelector(".writing-text");
const typewriter = document.querySelector(".typewriter");
let active = document.querySelector(".active").textContent.toLowerCase();
let text = "";
let wordsArray = null;
// stats
const grade = document.querySelector(".grade");
const speed = document.querySelector(".speed");
const time = document.querySelector(".time");
const wordLeft = document.querySelector(".word-left");
const error = document.querySelector(".error");
const totalError = document.querySelector(".total-error");
let wordCounter = 0;
let wordLen = 0;
let letterCounter = 0;

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
		mistakes = 0;
		wordCounter = 0;
		wordLen = 0;
		letterCounter = 0;
		createUi(levels[active][index].typing);
	}
}

function createUi(writingTest, t, w, er = 0, g = 0, s = 0) {
	writingText.innerText = writingTest;
	time.innerText = t;
	error.innerText = er;
	wordsArray = writingTest.split(" ");
	wordLen = wordsArray[0].length;
	wordLeft.innerText = writingTest.split(" ").length;
	text = [...writingText.innerText];
	speed.innerText = s;

	for (let i = 0; i < g; i++) {
		grade.children[i].classList.remove("fa-star").add("fa-star-o");
	}

	if (active == "beginner") {
		totalError.innerText = "10";
	} else if (active == "intermediate") {
		totalError.innerText = "8";
	} else {
		totalError.innerText = "6";
	}

	if (!document.querySelector(".overlay")) {
		overlayGenerate();
	}
	document.body.addEventListener("keyup", gameLogicHandler);
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

	if (overlay && e.key === text[0]) {
		overlay = overlay.remove();
		index = 0;
	}

	if (!overlay && ((e.keyCode > 47 && e.keyCode < 91) || (e.keyCode > 95 && e.keyCode < 112) || (e.keyCode > 185 && e.keyCode < 223) || e.keyCode === 32)) {
		if (text[index] === e.key) {
			console.log("match");
			text[index] = `<span class="correct-text">${text[index]}</span>`;
			writingText.innerHTML = text.join("");
		} else {
			console.log("not match");
			text[index] = `<span class="wrong-text">${text[index]}</span>`;
			writingText.innerHTML = text.join("");

			error.innerText = ++mistakes;
			console.log(mistakes);
		}
		console.log(letterCounter, wordLen);
		if (letterCounter === wordLen) {
			wordCounter++;
			wordLen += wordsArray[wordCounter].length + 1;
			console.log(wordLen, "counter");
			wordLeft.innerText = +wordLeft.innerText - 1;
		}
		index++;
		letterCounter++;
		gameCompleted();
	}
}

function gameCompleted() {
	if (text.length === letterCounter) {
		console.log("game over");
		document.body.removeEventListener("keyup", gameLogicHandler);
	}
}

latestIndex();
createUi(latest.typing);
carouselUi(levels[active].length, active);

level.addEventListener("click", levelHandler);
