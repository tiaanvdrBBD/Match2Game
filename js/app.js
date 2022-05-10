const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
var url = "C:/GradProgramme/LevelUps/Match2Game/";
var maxTime = 10;
var timeTaken = 0;
var countDownDate = new Date();
let gameDone = 0;
var successful = 0;
var unsuccessful = 0;

countDownDate.setMinutes(countDownDate.getMinutes() + 10);
countDownDate = new Date(countDownDate);
console.log(countDownDate);

// landing page
function logSession() {
  
  // add username to session storage
  sessionStorage.setItem("username", JSON.stringify(document.getElementById("username").value));

  // TODO: remove (show username for dev)
  alert(sessionStorage.getItem('username'));
}


var x = setInterval(function () {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and second
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("demo").innerHTML = minutes + "m " + seconds + "s ";
  var newMin = maxTime - minutes;
  var newSec = 60 - seconds;
  timeTaken = newMin * 60 + newSec;
  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
    gameDone = 1;
  } else if (gameDone == 1) {
    clearInterval(x);
    console.log(heuristic());
  }
}, 1000);


function heuristic() {
  var fraction = successful / (successful + unsuccessful);
  var result = (maxTime * 60) - timeTaken + (maxTime * 60) * fraction;
  return result > 0 ? result : 0;
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

  //isMatch ? disableCards() : unflipCards();

  if (isMatch) {
    successful++;
    disableCards();
  } else {
    unsuccessful++;
    unflipCards();
  }

  console.log(heuristic());
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