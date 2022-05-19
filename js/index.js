const doc = this.document ;

function showHowToPlay(){
    doc.getElementById("form").style.display = 'none';
    doc.getElementById("howToInfo").style.display = 'flex';

    sessionStorage.setItem("howToPlay", 'true');
}

function hideHowToPlay(){
    doc.getElementById("form").style.display = 'flex';
    doc.getElementById("howToInfo").style.display = 'none';

    sessionStorage.setItem("howToPlay", 'false');
}

function showGameOver(){
    console.log("Show game over");
    doc.getElementById("grid").style.display = 'none';
    doc.getElementById("gameOver").style.display = 'flex';
}

function hideGameOver(){
    console.log("Hide game over");
    doc.getElementById("gameOver").style.display = 'none';
    doc.getElementById("grid").style.display = 'flex';
}

function playAgain() {
    console.log("Hide game over");
    doc.getElementById("gameOver").style.display = 'none';
    doc.getElementById("grid").style.display = 'flex';

}

window.addEventListener('load', (event) => {
    document.getElementById("appNavbar").innerHTML =  navbar() ;
    document.getElementById("navButtons").style.display = 'none';

    if (sessionStorage.getItem("howToPlay") === 'true') {
      showHowToPlay();
    }
    else {
      hideHowToPlay();
    }
});