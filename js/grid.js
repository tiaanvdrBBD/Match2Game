const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let gameStart = 0;
let gameDone = 0;
var maxTime = 5;
var timeTaken = 0;
var countDownDate = 0;
var successful = 0;
var unsuccessful = 0;
var xAxis = 0;
var yAxis = 0;

let timerID = -1;

function playAgain() {
  alert('helle');
}

function heuristic() {
  var fraction = successful / (successful + unsuccessful);
  var result = Math.round((maxTime * 60) - timeTaken + (maxTime * 60) * fraction);
  return result > 0 ? result : 0;
}

function tick() {
  console.log('inside tick');
  var now = new Date().getTime();
  var timeLeft = countDownDate - now;
  var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  // Display timer (id="timer")
  document.getElementById("timerLabel").innerHTML = minutes + "m " + seconds + "s ";

  var minutesLeft = maxTime - minutes;
  var secondsLeft = 60 - seconds;
  timeTaken = minutesLeft * 60 + secondsLeft;
  // time up
  if (timeLeft < 0) {
    clearInterval(timerID);
    gameDone = 1;
    //display timer
    document.getElementById("timerLabel").innerHTML = "EXPIRED, number of moves: " + (successful + unsuccessful).toString();
  }
}
// function called when card clicked (shows picture)
function flipCard() {
  if (lockBoard) return;
  if (gameStart == 1) {
    gameStart = 0;
    countDownDate = new Date();
    countDownDate.setMinutes(countDownDate.getMinutes() + maxTime);
    countDownDate.setSeconds(countDownDate.getSeconds() + 1);
    countDownDate = new Date(countDownDate);

    if (timerID == -1) {
      // set unique ID to interval 
      timerID = setInterval(tick, 1000);
    }
  }
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

  if (gameDone == 1) {
    resetTimer(`Complete! Score: ${heuristic()}
    Moves: ${successful + unsuccessful}`);
  }

};
function resetTimer(timerString) {

  // set timer text
  document.getElementById("timerLabel").innerHTML = timerString;

  //stop running the interval
  if (timerID !== -1) {
    clearInterval(timerID);
    timerID = -1;
  }
  reset();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  if (isMatch) {
    successful++;
    disableCards();
    if (successful == (xAxis * yAxis / 2)) {
      gameDone = 1;
    }
  } else {
    unsuccessful++;
    unflipCards();
  }
  var perfectGame = xAxis * yAxis;
  // If you've made each successfull move, you must've finished
  if (successful == perfectGame / 2) {
    gameDone = 1;
  }
  console.log(heuristic());
};

/* when other cards picked*/
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
};

// hide picture
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

//card layouts
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
  // reset timer
  resetTimer('5m 0s');
  xAxis = gridSizeX;
  yAxis = gridSizeY;
  gameStart = 1;

  const grid = document.getElementsByClassName("memory-game")[0];
  grid.replaceChildren();
  let imageCount = 0;
  let randomSubsetWithDuplicates = randomCardImages(gridSizeX, gridSizeY);

  for (var i = 0; i < gridSizeX * gridSizeY; i++) {
    let imageSource = randomSubsetWithDuplicates[imageCount++];

    let card = document.createElement('article');
    card.setAttribute("class", "memory-card");
    card.setAttribute('data-framework', imageSource);
    card.style.width = `${100 / gridSizeX - 2}vw`;
    card.style.height = `${gridSizeY * 2}vw`;

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
  grid.style.gridTemplate = `${100 / gridSizeY}% / ${columnSpread.repeat(gridSizeX)}`;
}


function reset() {
  hasFlippedCard = false;
  lockBoard = false;
  firstCard, secondCard;
  gameStart = 0;
  gameDone = 0; //sit next to line gameStart
  maxTime = 5;
  timeTaken = 0;
  countDownDate = 0;
  successful = 0;
  unsuccessful = 0;
  xAxis = 0;
  yAxis = 0;
}