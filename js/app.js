const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
var url = "C:/GradProgramme/LevelUps/Match2Game/";

// add username to session
function initLanding() {
  // is same session?
  if (sessionStorage.getItem("username") !== null) {
    document.getElementById("username").value = sessionStorage.getItem("username");
  }
}

function usernameChanged(value) {
  //check if username is not empty
  if (value !== "") {
    // show play button
    document.getElementById("btn-start-game").style.display = "block";
  } else {
    // hide play button
    document.getElementById("btn-start-game").style.display = "none";
  }
}

function startGame() {
  // override storage with input value (can change so just update anyway)
  sessionStorage.setItem("username", document.getElementById("username").value.trim());
}

function getGrid(x, y, buttonClicked) {

  // show play button if username not empty
  if (document.getElementById("username").value.trim() !== "") {
    document.getElementById("btn-start-game").style.display = "block";
  }

  // change other buttons to default
  document.querySelectorAll('.fake-secondary').forEach(btn => {
    // rest 
    btn.setAttribute("class", "button primary-button");
  });

  // change styling
  buttonClicked.setAttribute("class", "button primary-button fake-secondary");

  sessionStorage.setItem("gridX", x);
  sessionStorage.setItem("gridY", y);

  //TODO: remove this: used as debug
  console.log(sessionStorage.getItem("gridX") + ":" + sessionStorage.getItem("gridY"));
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    //first click
    hasFlippedCard = true;
    firstCard = this;

    return;
  }
  //second click
  hasFlippedCard = false;
  secondCard = this;

  checkForMatch();
};


function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();

};

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
};

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
};

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));