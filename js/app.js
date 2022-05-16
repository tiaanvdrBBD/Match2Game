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
