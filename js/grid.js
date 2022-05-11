const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

var maxTime = 5;
var timeTaken = 0;
var countDownDate = new Date();
let gameDone = 0;
var successful = 0;
var unsuccessful = 0;
var xAxis = 0;
var yAxis = 0;
countDownDate.setMinutes(countDownDate.getMinutes() + maxTime);
countDownDate = new Date(countDownDate);

function heuristic() {
  var fraction = successful / (successful + unsuccessful);
  var result = (maxTime * 60) - timeTaken + (maxTime * 60) * fraction;
  return result > 0 ? result : 0;
}

// Ticks every one second
var x = setInterval(function () {

  var now = new Date().getTime();
  var timeLeft = countDownDate - now;
  var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("demo").innerHTML = minutes + "m " + seconds + "s ";
  var minutesLeft = maxTime - minutes;
  var secondsLeft = 60 - seconds;
  timeTaken = minutesLeft * 60 + secondsLeft;

  if (timeLeft < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
    console.log("Your time has expired!");
    console.log("Number of moves: " + (successful+unsuccessful).toString());
    gameDone = 1;
  } else if (gameDone == 1) {
    clearInterval(x);
    console.log(heuristic());
    console.log("You won the game!");
    console.log("Your score is: " + heuristic());
    console.log("Number of moves: " + (successful+unsuccessful).toString());
  }
}, 1000);

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

  if (isMatch) {
    successful++;
    disableCards();
  } else {
    unsuccessful++;
    unflipCards();
  }
  var perfectGame = xAxis * yAxis;
  console.log("Perfect game:" + perfectGame);
  // If you've made each successfull move, you must've finished
  if(successful == perfectGame/2){
    gameDone = 1;
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


const cardImages = ['angular.svg', 'aurelia.svg', 'backbone.svg', 'ember.svg', 'js-badge.svg', 'react.svg', 'vue.svg', 'js-log.png'];

function randomCardImages(gridSizeX, gridSizeY) {
  let randomSubset = cardImages.map(img => [img, Math.random()]).sort((a, b) => {
    return a[1] < b[1] ? -1 : 1;
  }).slice(0, gridSizeX * gridSizeY / 2).map(a => a[0]);
  return [...randomSubset, ...randomSubset].sort(() => Math.random() - 0.5);
}

function freePlayShow() {
  document.getElementById('freePlayInputSection').style.display = 'flex';
}

function freePlayGenerate() {
  document.getElementById('freePlayInputSection').style.display = 'none';
  populateGrid(document.getElementById('freePlayGridInput1').value, document.getElementById('freePlayGridInput2').value);
}


function populateGrid(gridSizeX, gridSizeY) {
  xAxis = gridSizeX;
  yAxis = gridSizeY;
  const grid = document.getElementsByClassName("memory-game")[0];
  grid.replaceChildren();
  let imageCount = 0;
  let randomSubsetWithDuplicates = randomCardImages(gridSizeX, gridSizeY);

  for (var i = 0; i < gridSizeX * gridSizeY; i++) {
    let imageSource = randomSubsetWithDuplicates[imageCount++];

    let card = document.createElement('article');
    card.setAttribute("class", "memory-card");
    card.setAttribute('data-framework', imageSource);
    card.style.width = `${100/gridSizeX - 2}vw`;
    card.style.height = `${gridSizeY*2}vw`;

    let cardImage1 = document.createElement('img');
    cardImage1.setAttribute("class", "front-face");
    cardImage1.setAttribute("src", '../img/' + imageSource);
    cardImage1.setAttribute("alt", imageSource);

    let cardImage2 = document.createElement('img');
    cardImage2.setAttribute("class", "back-face");
    cardImage2.setAttribute("src", "../img/star.svg");
    cardImage2.setAttribute("alt", "");

    card.appendChild(cardImage1);
    card.appendChild(cardImage2);

    card.addEventListener('click', flipCard);

    grid.appendChild(card);
  }

  const columnSpread = 'auto ';
  grid.style.gridTemplate = `${100/gridSizeY}% / ${columnSpread.repeat(gridSizeX)}`;
}