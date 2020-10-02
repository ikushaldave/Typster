let latest = null;
let index = 0;
let mistakes = 0;
let startTimer = null;
let start = false;
let text = "";
let wordsArray = null;
let wordCounter = 0;
let wordLen = 0;
let letterCounter = 0;
let activeLvl = null;

// DOM Selectors
const level = document.querySelector(".levels");
const levelSelector = document.querySelector(".exercise-level-list");
const ul = document.querySelector(".exercise-level-list");
const writingText = document.querySelector(".writing-text");
const typewriter = document.querySelector(".typewriter");
let active = document.querySelector(".active").textContent.toLowerCase();

// stats
const grade = document.querySelector(".grade");
const speed = document.querySelector(".speed");
const time = document.querySelector(".time");
const wordLeft = document.querySelector(".word-left");
const error = document.querySelector(".error");
const totalError = document.querySelector(".total-error");
const min = document.querySelector(".min");
const sec = document.querySelector(".sec");

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
		let gradeArr = levels[lvl][i].grades;
		let gradeLastStat = gradeArr[gradeArr.length - 1];
		let li = document.createElement("li");
		let btn = document.createElement("button");
		let lvlNum = document.createElement("span");
		lvlNum.classList.add("level-number");
		lvlNum.innerText = i + 1;
		let span = document.createElement("span");
		span.classList.add("exercise-rating");
		console.log(len, lvl);
		for (let j = 0; j < 3; j++) {
			const star = document.createElement("i");
			if (gradeLastStat) {
				star.classList.add("fas", "fa-star");
				gradeLastStat--;
			} else {
				star.classList.add("far", "fa-star");
			}
			span.append(star);
		}
		btn.append(lvlNum, span);
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
		activeLvl = +e.currentTarget.dataset.level;
		resetData();
		if (document.querySelector(".retry")) {
			document.querySelector(".retry").remove();
		}
		createUi(levels[active][activeLvl].typing);
	}
}

function createUi(writingTest) {
	writingText.innerText = writingTest;
	sec.innerText = "00";
	error.innerText = 0;
	wordsArray = writingTest.split(" ");
	wordLen = wordsArray[0].length;
	wordLeft.innerText = writingTest.split(" ").length;
	text = [...writingText.innerText];
	speed.innerText = 0;
	started = true;

	if (active == "beginner") {
		totalError.innerText = "10";
		min.innerText = 3;
	} else if (active == "intermediate") {
		totalError.innerText = "8";
		min.innerText = 2;
	} else {
		totalError.innerText = "6";
		min.innerText = 1;
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

function retryOverlay() {
	const div = document.createElement("div");
	div.classList.add("retry", "container");
  const img = document.createElement("img");
  img.src =
    "../assets/Images/gray-cat.png"
	;
	const tryAgain = document.createElement("div");
	const h1 = document.createElement("h1");
	h1.innerText = "Better Luck Next Time !";
	const icon = document.createElement("i");
	icon.classList.add("fal", "fa-redo");
	const btn = document.createElement("button");
	btn.innerText = "Retry";
	btn.append(icon);
	tryAgain.append(h1, btn);
	
	div.append(img, tryAgain);
	
	typewriter.append(div);
	btn.addEventListener("click", function () {
		document.querySelector(".retry").remove();
		createUi(levels[active][activeLvl].typing);
	});
}

function latestIndex() {
	levels[active].forEach((ele, i) => {
		if (!ele.locked) {
			latest = levels[active][i];
			activeLvl = i;
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
		if (started) {
			startInterval();
			started = false;
		}

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
		limitChecker();
		gameCompleted();
	}
}

function resetData() {
	mistakes = 0;
	wordCounter = 0;
	wordLen = 0;
	letterCounter = 0;
	[...grade.children].forEach((e) => {
		e.classList.remove("far");
		e.classList.add("fas");
	});
	stopInterval();
}

function gameCompleted() {
	if (text.length === letterCounter) {
		console.log("Game Completed");
		wordLeft.innerText = 0;
		stopInterval();
		data[active][activeLvl]["grades"].push(grade.querySelectorAll(".fas").length);
		data[active][activeLvl]["time"].push((3 - (min.innerText * 60 + +sec.innerText) / 60).toFixed(2));
		data[active][activeLvl]["error"].push(mistakes);
		data[active][activeLvl]["isCompleted"] = true;
		data[active][activeLvl + 1]["locked"] = false;
		localStorage.setItem("levels", JSON.stringify(data));
		document.body.removeEventListener("keyup", gameLogicHandler);
	}
}

function limitChecker() {
	if (mistakes > totalError.innerText || (min.innerText == "0" && sec.innerText == "0" && wordLeft.innerText > 1)) {
		console.log("Game Over");
		document.body.removeEventListener("keyup", gameLogicHandler);
		resetData();
		stopInterval();
		retryOverlay();
	}
}

function timer() {
	if (min.innerText == 0 && sec.innerText == 0) {
		min.innerText = 0;
		sec.innerText = 0;
	} else if (sec.innerText != 0) {
		sec.innerText--;
	} else if (min.innerText != 0 && sec.innerText == 0) {
		sec.innerText = 59;
		min.innerText--;
	} else if (min.innerText == 0) {
		min.innerText = 60;
	}
	return;
}

function startInterval() {
	startTimer = setInterval(function () {
		timer();
		limitChecker();
		grades();
		wpm();
	}, 1000);
}

function stopInterval() {
	clearInterval(startTimer);
	startTimer = null;
}

function grades() {
	if (active === "beginner" && min.innerText < 1) {
		grade.children[1].classList.remove("fas");
		grade.children[1].classList.add("far");
	} else if (active === "beginner" && min.innerText < 2) {
		grade.children[2].classList.remove("fas");
		grade.children[2].classList.add("far");
	} else if (active === "intermediate" && min.innerText < 1 && sec.innerText == 50) {
		grade.children[1].classList.remove("fas");
		grade.children[1].classList.add("far");
	} else if (active === "intermediate" && min.innerText < 2 && sec.innerText == 45) {
		grade.children[2].classList.remove("fas");
		grade.children[2].classList.add("far");
	} else if (active === "expert" && sec.innerText == 30) {
		grade.children[1].classList.remove("fas");
		grade.children[1].classList.add("far");
	} else if (active === "expert" && sec.innerText == 45) {
		grade.children[2].classList.remove("fas");
		grade.children[2].classList.add("far");
	}
}

function wpm() {}

latestIndex();
createUi(latest.typing);
carouselUi(levels[active].length, active);

level.addEventListener("click", levelHandler);
