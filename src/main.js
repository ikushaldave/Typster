const level = document.querySelector(".levels");
const levelSelector = document.querySelector(".exercise-level-list");
let ul = document.querySelector(".exercise-level-list");
let para = document.querySelector(".writing-text");

function levelHandler(e ) {
    if (e.target.classList.contains("level-btn")) {
        let targeted = e.target.innerText.toLowerCase();
    carouselUi(levels[targeted].length, targeted);
    
  }
}
// carousel ui function

function carouselUi(len, lvl) {
    ul.innerHTML = "";
  for (let i = 0; i < len; i++) {
      
      let li = document.createElement("li");
      let btn = document.createElement("button");
      btn.innerHTML = `<span class="level-number">${i+1}</span>
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
    if (!e.target.classList.contains("locked") && e.target.tagName == "BUTTON") 
    {
        
        }
    
    
        
        
}
function createUi() {
    
}


level.addEventListener("click", levelHandler);

 carouselUi(levels.beginner.length, "beginner");