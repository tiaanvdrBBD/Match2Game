 const cards = document.querySelectorAll('.memory-card');

 let hasFlippedCard = false;
 let lockBoard = false;
 let firstCard, secondCard;
 let gameStart = 0;
 let gameDone = 0; //sit next to line gameStart

 var maxTime = 5;
 var timeTaken = 0;
 var countDownDate = 0;
 var successful = 0;
 var unsuccessful = 0;
 var xAxis = 0;
 var yAxis = 0;
 let timerID = -1;

 function showGrid() {
  populateGrid(sessionStorage.getItem("gridX"),sessionStorage.getItem("gridY"));
}

 // when DOM rendered first time
 function init() {

   // session handling
   if (isUserSessionLogged()) {
     // show welcome
     document.getElementsByClassName('label')[0].innerHTML = `Welcome ${localStorage.getItem('username').replace(/"/g, '')}!`;
   } else {
     getUsernames();
   }
 }

 function isUserSessionLogged() {
   if (localStorage.getItem("username") === null) return false;
   else return true;
 }

 // session
 function logSession() {
   // is username available?
   if (usernameAvailable) {
     localStorage.setItem("username", JSON.stringify(document.getElementById("username").value));
   } else {
     alert(`username ${JSON.stringify(document.getElementById("username").value)} already taken`);
   }
 }
 // as user types username color of text changes (black means not taken - valid) (red means taken - not valid)
 let usernameAvailable = false;

 function usernameChanged(input) {
   if (usernames.includes(input.value.trim()) && input.value.trim !== "") {
     input.style.color = '#ff0c0c';
     usernameAvailable = false;
     document.getElementsByClassName('btn_play_container')[0].style.visibility = 'hidden';
     document.getElementsByClassName('label')[0].innerHTML = 'username is taken';
   } else {
     input.style.color = '#000000';
     usernameAvailable = true;
     document.getElementsByClassName('btn_play_container')[0].style.visibility = 'visible';
     document.getElementsByClassName('label')[0].innerHTML = 'username';
   }
 }

 // handles requests to server
 async function sendRequest(url, type) {
   const options = {
     method: `${type}`,
     headers: {
       'Content-Type': 'application/json'
     }
   };

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
    //stop running the interval
    clearInterval(timerID);
    // display score
    showGongratulations();
    document.getElementById("timerLabel").innerHTML = `You Won! Score: ${heuristic()}
    Moves: ${successful + unsuccessful}`;
    document.getElementById("vicoryMessage").innerHTML = `You Won! Score: ${heuristic()}
    Moves: ${successful + unsuccessful}`;
    // reset everything
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
    timerID = -1;
  } else {
    hideGongratulations();
    console.log("Hide");
  }

};

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
  hideGongratulations();
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

const cardImages = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50'];

function randomCardImages(gridSizeX, gridSizeY) {
  hideGongratulations();
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
  hideGongratulations();
  xAxis = gridSizeX;
  yAxis = gridSizeY;
  gameStart = 1;
  const grid = document.getElementsByClassName("memory-game")[0];
  grid.replaceChildren();
  let imageCount = 0;
  let randomSubsetWithDuplicates = randomCardImages(gridSizeX, gridSizeY);
   // async request -> server
   let response_obj = await fetch(url, options)
     .catch(e => {
       // failure: set error message
       return serverError();
     });
   // optional chaining catch used when query is unsucessful (like ERR_CONNECTION_REFUSED)
   try {
     response_obj = await response_obj.json();
   } finally {
     return response_obj;
   }
 }

 function serverError() {
   return {
     success: false,
     error: "server not running... try again"
   };
 }

 function printQueryFeedback(header, responseObj) {
   if (!responseObj.success) {
     console.log(`${header}: false... error: ${JSON.stringify(responseObj.error, null, 2)}`);
   } else {
     console.log(`${header}: true!`);
   }
 }

 let usersInfo = "";
 // get all a grid's info with gridID = [4x4 = 1], [6x6 = 2], [8x8 = 3]
 async function getScores(gridID) {

   usersInfo = await sendRequest(`http://localhost:3000/api/scores?gridID=${gridID}`, 'POST');

   printQueryFeedback(`SERVER: get scores response sucess`, usersInfo);
 }

 let usernames = "";
 let username = "";

 // get all saved usernames in db
 async function getUsernames() {
   const response_obj = await sendRequest(`http://localhost:3000/api/usernames`, 'POST');

   if (response_obj.success) {
     usernames = response_obj.data;
   }

   printQueryFeedback(`SERVER: get usernames response sucess`, response_obj);
 }

 function test() {
   getScores(2);
 }

 // adds user and score to db.
 async function addUser(username, time, moves, score, gridID) {

   // TODO: first see if user score is within top 100

   // yes - request update
   const response_obj = await sendRequest(`http://localhost:3000/api/insert?username=${username}&time=${time}&moves=${moves}&score=${score}&gridID=${gridID}`, 'POST');

   printQueryFeedback(`SERVER: add user response sucess`, response_obj);

 }

 // updates user's score for a grid
 async function updateScore(username, time, moves, score, gridID) {

   const response_obj = await sendRequest(`http://localhost:3000/api/update?username=${username}&time=${time}&moves=${moves}&score=${score}&gridID=${gridID}`, 'PUT');

   printQueryFeedback(`SERVER: update user score response sucess`, response_obj);
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
     countDownDate = new Date(countDownDate);
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

   if (timerID == -1) {
     // set unique ID to interval 
     timerID = setInterval(tick, 1000);
   }
   if (gameDone == 1) {
     //stop running the interval
     clearInterval(timerID);
     // display score
     document.getElementById("timerLabel").innerHTML = `
       Complete!Score: $ {
         heuristic()
       }
       Moves: $ {
         successful + unsuccessful
       }
       `;
     // reset everything
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
     timerID = -1;
   }

 };

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
     card.style.width = `
       $ {
         100 / gridSizeX - 2
       }
       vw `;
     card.style.height = `
       $ {
         gridSizeY * 2
       }
       vw `;

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
   grid.style.gridTemplate = `
       $ {
         100 / gridSizeY
       } % / ${columnSpread.repeat(gridSizeX)}`;
 }