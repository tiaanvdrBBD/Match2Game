const doc = this.document ; 

function showHowToPlay(){
    doc.getElementById("form").style.display = 'none';
    doc.getElementById("howToInfo").style.display = 'flex';

}

function hideHowToPlay(){
    doc.getElementById("form").style.display = 'flex';
    doc.getElementById("howToInfo").style.display = 'none';

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
});