const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let gameStart = 0;
// 0 - Game not over
// 1 - Game won
// 2 - No time left
let gameDone = 0;
let moves = 0;
let maxTime = 5;
let timeTaken = 0;
let successful = 0;
let unsuccessful = 0;
let xAxis = 0;
let yAxis = 0;
let pause = false;  //0 meaning it's not paused
let timeLeft = 0;
let multiplier = 0;

// added
let timerID = -1;
var minutes = 0;
var seconds = 0;

function showGrid() {
  populateGrid(sessionStorage.getItem("gridX"), sessionStorage.getItem("gridY"));
}

function playAgain() {
  alert('helle');
}

function evaluation() {
  let fraction = successful / (successful + unsuccessful);
  let result = Math.round(((maxTime * 60) - timeTaken + (maxTime * 60) * fraction) * multiplier);
  return result > 0 ? result : 0;
}

function tick() {
  
  if (!pause) {
    console.log('inside tick');
    
    timeLeft = timeLeft - 1000;

    let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    let m = minutes > 0 ? (minutes < 10 ? "0" : "") + minutes + ":" : "00:";
    let s = seconds > 0 ? (seconds < 10 ? "0" : "") + seconds : "00";
    // Display timer (id="timer")
    document.getElementById("timerLabel").innerHTML = m + s;

    let minutesLeft = maxTime - minutes;
    let secondsLeft = 60 - seconds;
    timeTaken = minutesLeft * 60 + secondsLeft;
    // time up
    if (timeLeft < 0) {
      clearInterval(timerID);
      gameDone = 1;
      //display timer
      document.getElementById("timerLabel").innerHTML = "EXPIRED, number of moves: " + (moves).toString();
    }

  }

}

// function called when card clicked (shows picture)
function flipCard() {
  if (lockBoard) return;
  if (pause) return;
  if (gameStart == 1) {
    gameStart = 0;
    countDownDate = new Date();
    countDownDate.setMinutes(countDownDate.getMinutes() + maxTime);
    countDownDate.setSeconds(countDownDate.getSeconds() + 1);
    countDownDate = new Date(countDownDate);
    timeLeft = 300000;

    if (timerID == -1) {
      // set unique ID to interval 
      timerID = setInterval(tick, 1000);
    }
  }

  moves++;
  document.getElementById("movesLabel").innerHTML = "Moves: " + moves;

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

  if (timerID == -1) {
    // set unique ID to interval
    timerID = setInterval(tick, 1000);
  }
  if (gameDone == 1) {
    clearInterval(timerID);
    showGameOver();
    document.getElementById("heading").innerHTML = `Congratulations!`;
    document.getElementById("gameOverMessage").innerHTML = `You made it out the fish pond.`;
    document.getElementById("score").innerHTML = `${heuristic()} - Vicky `;
    document.getElementById("moves").innerHTML = `Moves: ${successful + unsuccessful}`;
    document.getElementById("time").innerHTML = `Time: ${minutes + "m " + seconds + "s"}`;
    document.getElementById("gameOverImg").src = `../img/success.svg`;
    // reset everything
    hasFlippedCard = false;
    lockBoard = false;
    firstCard, secondCard;
    gameStart = 0;
    gameDone = 0; //sit next to line gameStart
    maxTime = 5;
    timeTaken = 0;
    successful = 0;
    unsuccessful = 0;
    xAxis = 0;
    yAxis = 0;
    moves = 0;
    timerID = -1;
  } else if (gameDone == 2) {
    showGameOver();
    document.getElementById("heading").innerHTML = `Oops!`;
    document.getElementById("gameOverMessage").innerHTML = `You were caught...`;
    document.getElementById("moves").innerHTML = `Moves: ${successful + unsuccessful}`;
    document.getElementById("time").innerHTML = `Time: ${minutes + "m " + seconds + "s"}`;
    document.getElementById("gameOverImg").src = `../img/unsuccess.svg`;
  } else {
    hideGameOver();
    console.log("Hide");
  }
};

function resetTimer(timerString) {
  if (timerID !== -1) {
    clearInterval(timerID);
    timerID = -1;
  }
  reset();
}

function resetTimer(timerString) {

  // set timer text
  document.getElementById("timerLabel").innerHTML = timerString;
  document.getElementById("movesLabel").innerHTML = "Moves: 0";
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
  let perfectGame = xAxis * yAxis;
  // If you've made each successfull move, you must've finished
  if (successful == perfectGame / 2) {
    gameDone = 1;
  }
  console.log(evaluation());
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

const cardImages = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50'];

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

function playpause() {
  pause = !pause;
  let button = document.getElementById("playpausebutton");
  
  if (button.src.match("../img/pause.png")){
    button.style.transform  = "rotate(360deg)";
    button.src =  "../img/play.png";
  } else {
    button.style.transform = "rotate(-360deg)";
    button.src = "../img/pause.png";
  }
}



function populateGrid(gridSizeX, gridSizeY) {
  resetTimer('05:00');
  xAxis = gridSizeX;
  yAxis = gridSizeY;
  console.log(xAxis + "     " + yAxis);
  multiplier = (xAxis == 4) ? 150 : ((xAxis == 6) ? 200 : 250);
  gameStart = 1;
  const grid = document.getElementsByClassName("memory-game")[0];
  grid.replaceChildren();
  let imageCount = 0;
  let randomSubsetWithDuplicates = randomCardImages(gridSizeX, gridSizeY);

  for (let i = 0; i < gridSizeX * gridSizeY; i++) {
    let imageSource = randomSubsetWithDuplicates[imageCount++];

    let card = document.createElement('article');
    card.setAttribute("class", "memory-card grid" + gridSizeX);
    card.setAttribute('data-framework', imageSource);

    let cardImage1 = document.createElement('img');
    cardImage1.setAttribute("class", "front-face");
    cardImage1.setAttribute("src", '../img/' + imageSource + '.svg');
    cardImage1.setAttribute("alt", imageSource);

    let cardImage2 = document.createElement('img');
    cardImage2.setAttribute("class", "back-face");
    cardImage2.setAttribute("src", "../img/rectangle_cover.svg");
    cardImage2.setAttribute("alt", "");

    card.appendChild(cardImage1);
    card.appendChild(cardImage2);

    card.addEventListener('click', flipCard);

    grid.appendChild(card);
  }

  const columnSpread = '1fr ';
  grid.style.gridTemplateColumns = `${columnSpread.repeat(gridSizeX)}`;
}

function reset() {
  hasFlippedCard = false;
  lockBoard = false;
  firstCard, secondCard;
  gameStart = 0;
  gameDone = 0; //sit next to line gameStart
  maxTime = 5;
  timeTaken = 0;
  successful = 0;
  unsuccessful = 0;
  xAxis = 0;
  yAxis = 0;
  moves = 0;
}