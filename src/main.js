const level = document.querySelector(".levels");
const levelSelector = document.querySelector(".exercise-level-list");
const ul = document.querySelector(".exercise-level-list");
const writingText = document.querySelector(".writing-text");
const active = document.querySelector(".active").textContent.toLowerCase();

const grade = document.querySelector(".grade");
const speed = document.querySelector(".speed");
const time = document.querySelector(".time");
const wordLeft = document.querySelector(".word-left");
const error = document.querySelector(".error");
let latest = null;
function levelHandler(e) {
	if (e.target.classList.contains("level-btn")) {
		let targeted = e.target.innerText.toLowerCase();
		carouselUi(levels[targeted].length, targeted);
		[...level.children].forEach(e =>
			e.classList.remove("active"));
		e.target.classList.add("active");
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
		if (!levels[lvl][i].isCompleted) {
			btn.classList.add("locked");
			let lock = document.createElement("i");
			lock.classList.add("fa", "fa-lock", "lock-icon");
			btn.append(lock);
		}
		li.append(btn);
		ul.append(li);
	}
	ul.addEventListener("click", carouselHandler);
}

// carousel handler function
function carouselHandler(e) {
	if (!e.target.classList.contains("locked") && e.target.tagName == "BUTTON") {
		console.log(e.target.children[0].innerText);
		let index = +(e.target.children[0].innerText)-1;
		createUi(levels[active][index].typing);
	}

}

function createUi(writingTest, t, w, er, g = 0, s = 0) {
	console.log("working");
	writingText.innerText = writingTest;
	time.innerText = t;
	error.innerText = er;
	wordLeft.innerText = writingTest.split(" ").length;
	for (let i = 0; i < g; i++) {
		grade.children[i].classList.remove("fa-star").add("fa-star-o");
	}
	speed.innerText = s;
}

level.addEventListener("click", levelHandler);

carouselUi(levels[active].length, active);

function latestIndex() {
	
	levels[active].forEach((ele, i) => {
		if (ele.isCompleted ) {
			latest = levels[active][i+1];
		}
	})
}
latestIndex();
createUi(latest.typing);