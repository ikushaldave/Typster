let latest = null;
let index = 0;
let mistakes = 0;
let startTimer = null;
let start = false;
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
let min = document.querySelector(".min");
let sec = document.querySelector(".sec");


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
		stopInterval();
		createUi(levels[active][index].typing);
	}
}

function createUi(writingTest, m, s, w, er = 0, g = 0, sp = 0) {
	writingText.innerText = writingTest;
	sec.innerText = "00";
	error.innerText = er;
	wordsArray = writingTest.split(" ");
	wordLen = wordsArray[0].length;
	wordLeft.innerText = writingTest.split(" ").length;
	text = [...writingText.innerText];
	speed.innerText = sp;
	started = true
	for (let i = 0; i < g; i++) {
		grade.children[i].classList.remove("fa-star").add("fa-star-o");
	}

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
		console.log(startTimer);
		letterCounter++;
		limitChecker(e.target);
		gameCompleted();
	}
}

function gameCompleted() {
	if (text.length === letterCounter) {
		console.log("game over");
		stopInterval();
		document.body.removeEventListener("keyup", gameLogicHandler);

	}
}

function timer(){
    if( min.innerText == 0 && sec.innerText == 0){
        min.innerText = 0;
        sec.innerText = 0;
    } else if(sec.innerText != 0){
        sec.innerText--;
    } else if(min.innerText != 0 && sec.innerText == 0){
        sec.innerText = 59;
        min.innerText--;
    } else if( min.innerText == 0){
        min.innerText = 60;
    }
    return;
}
function startInterval() {
  startTimer = setInterval(function () {
    timer();
  }, 1000);
}
function stopInterval() {
	clearInterval(startTimer);
	startTimer = null;
}

function limitChecker(e) {
	if (
		mistakes > totalError.innerText
	)
	{
		console.log(levels[active][e.children[0].innerText - 1]);
		createUi(levels[active][(e.children[0].innerText)-1].typing);
		stopInterval();
		}
}


latestIndex();
createUi(latest.typing);
carouselUi(levels[active].length, active);

level.addEventListener("click", levelHandler);
