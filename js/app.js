const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
var url = "C:/GradProgramme/LevelUps/Match2Game/";

// landing page
function logSession() {

  // add username to session storage
  sessionStorage.setItem("username", JSON.stringify(document.getElementById("username").value));

  // TODO: remove (show username for dev)
  console.log(sessionStorage.getItem('username'));
}

function getGrid(x, y) {
  sessionStorage.setItem("gridX", x);
  sessionStorage.setItem("gridY", y);

  //TODO: remove this: used as debug
  console.log(sessionStorage.getItem("gridX")+":"+sessionStorage.getItem("gridY"));
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