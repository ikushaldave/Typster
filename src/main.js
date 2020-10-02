function main() {
	const levels = JSON.parse(localStorage.getItem("levels")) || data();

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
	let isTypeCompleted = null;
	const speedArr = [];
	let speedAvg = null;

	// DOM Selectors
	const level = document.querySelector(".levels");
	const levelSelector = document.querySelector(".exercise-level-list");
	const ul = document.querySelector(".exercise-level-list");
	const writingText = document.querySelector(".writing-text");
	const typewriter = document.querySelector(".typewriter");
	let active = findActive();

	// stats
	const grade = document.querySelector(".grade");
	const speed = document.querySelector(".speed");
	const time = document.querySelector(".time");
	const wordLeft = document.querySelector(".word-left");
	const error = document.querySelector(".error");
	const totalError = document.querySelector(".total-error");
	const min = document.querySelector(".min");
	const sec = document.querySelector(".sec");

	function findActive() {
		for (let level in levels) {
			for (let obj of levels[level]) {
				if (obj.isCompleted == false) {
					document.querySelector(`.${level}`).classList.add("active");

					activeLvl = levels[level].indexOf(obj);
					return level;
				}
			}
		}
	}

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
			e.currentTarget.children[0].classList.add("active-carosel");

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
		img.src = "https://i.ibb.co/3m9hCKY/gray-cat.png";
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
		btn.addEventListener("click", replay);
	}

	function replay() {
		document.querySelector(".retry").remove();
		createUi(levels[active][activeLvl].typing);
	}

	function congratsOverlay() {
		const statObj = levels[active][activeLvl];
		const time = String(statObj.time[statObj.time.length - 1]);
		const div = document.createElement("div");
		div.classList.add("result", "container");
		const congo = document.createElement("div");
		congo.classList.add("congo");
		congo.innerHTML = ` <h1>Congratulations ! </h1>
            ${generateStars()}`;

		const statResult = document.createElement("div");
		statResult.classList.add("stats-result");
		statResult.innerHTML = ` <div>
                <p>Speed:</p>
                <p>${statObj.speed[statObj.speed.length - 1]} wpm</p>
            </div>
            <div>
                <p>Errors:</p>
                <p>${statObj.error[statObj.error.length - 1]} / ${active == "beginner" ? "10" : active == "intermediate" ? "8" : 8}</p>
            </div>
            <div>
                <p>Time:</p>
                <p>${time[0]}:${Math.round(60 / +time.slice(2))}s</p>
			</div>`;
		const buttons = document.createElement("div");
		buttons.classList.add("buttons");
		const playAgain = document.createElement("button");
		playAgain.innerText = "Play Again";
		const next = document.createElement("button");
		next.innerText = "Next";
		buttons.append(playAgain, next);
		div.append(congo, statResult, buttons);
		typewriter.append(div);

		playAgain.addEventListener("click", function () {
			document.querySelector(".result").remove();
			createUi(levels[active][activeLvl].typing);
		});
		next.addEventListener("click", nextLevel);
	}

	function nextLevel() {
		document.querySelector(".result").remove();
		if (isTypeCompleted && active === "beginner") {
			[...level.children].forEach((e) => e.classList.remove("active"));
			level.children[1].classList.add("active");
			active = "intermediate";
			activeLvl = 0;
		} else if (isTypeCompleted && active === "intermediate") {
			[...level.children].forEach((e) => e.classList.remove("active"));
			level.children[2].classList.add("active");
			active = "expert";
			activeLvl = 0;
		} else if (isTypeCompleted && active === "expert") {
		} else {
			activeLvl++;
		}
		levels[active][activeLvl].locked = false;
		localStorage.setItem("levels", JSON.stringify(levels));
		createUi(levels[active][activeLvl].typing);
		window.location.reload();
	}

	function generateStars() {
		let span = document.createElement("span");
		span.classList.add("exercise-rating");
		let gradeArr = levels[active][activeLvl].grades;
		let gradeLastStat = gradeArr[gradeArr.length - 1];
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
		return span.outerHTML;
	}

	function gameLogicHandler(e) {
		e.preventDefault();
		let overlay = document.querySelector(".overlay");
		str = "";

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
				text[index] = `<span class="correct-text">${text[index]}</span>`;
				writingText.innerHTML = text.join("");
			} else {
				text[index] = `<span class="wrong-text">${text[index]}</span>`;
				writingText.innerHTML = text.join("");

				error.innerText = ++mistakes;
			}

			if (letterCounter === wordLen) {
				wordCounter++;
				wordLen += wordsArray[wordCounter].length + 1;

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
			wordLeft.innerText = 0;
			stopInterval();
			levels[active][activeLvl]["grades"].push(grade.querySelectorAll(".fas").length);
			levels[active][activeLvl]["time"].push((3 - (min.innerText * 60 + +sec.innerText) / 60).toFixed(2));
			levels[active][activeLvl]["error"].push(mistakes);
			speedAvg = Math.round(speedArr.reduce((a, c) => a + c) / speedArr.length);
			levels[active][activeLvl]["speed"].push(speedAvg);
			levels[active][activeLvl]["isCompleted"] = true;
			isTypeCompleted = levels[active].every((lvl) => lvl.isCompleted == true);
			document.body.removeEventListener("keyup", gameLogicHandler);
			localStorage.setItem("levels", JSON.stringify(levels));
			congratsOverlay();
		}
	}

	function limitChecker() {
		if (mistakes > totalError.innerText || (min.innerText == "0" && sec.innerText == "0" && wordLeft.innerText > 1)) {
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

	function wpm() {
		const time = (3 - (+min.innerText + +sec.innerText / 60)).toFixed(2);
		const grossWPM = Math.round([letterCounter / 5] / time);
		const netWPM = Math.round(grossWPM - mistakes / time);
		speedArr.push(Math.abs(netWPM));
		speed.innerText = Math.abs(netWPM);
	}

	createUi(levels[active][activeLvl].typing);
	carouselUi(levels[active].length, active);

	level.addEventListener("click", levelHandler);
}

main();
