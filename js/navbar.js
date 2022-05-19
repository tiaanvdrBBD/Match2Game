function navbar(){
    return `
      <ul id="horizontalBar">
        <section>
          <li id="gameLogo" class="secondary-button">
            <img src="img/logo.png" alt="AquaFind" id="logoImage" onerror="this.src='../img/logo.png';" >
          </li>
        </section>
        <section id="navButtons">
          <li>
            <a href="../index.html"><button class="tertiary-button">Pond Size</button></a>
          </li>
          <li>
           <a href="../html/leaderboard.html"><button class="tertiary-button">The Fish Pond</button>
          </li>
          <li>
            <a href="../index.html" onclick="showHowToPlay()"><button class="tertiary-button">How to play?</button></a>
          </li>
        </section>
        <section id="dropNavButtons" onclick="toggleDropMenu()">
          <i class="fas fa-bars"></i>
        </section>
      </ul>
      <ul id="verticalBar">
          <li>Pond Size</li>
          <li>The Fish Pond</li>
          <li>How to play?</li>
      </ul>
    `
}

function showHowToPlay() {
  this.document.getElementById("form").style.display = 'none';
  this.document.getElementById("howToInfo").style.display = 'flex';
}

function toggleDropMenu(){
  let elementSelected = document.getElementById("verticalBar");
  let path = window.location.pathname;
  let page = path.split("/").pop();

  if(page !== 'index.html'){
    if(elementSelected.style.display == 'flex'){
      elementSelected.style.display = 'none';
    }else{
      elementSelected.style.display = 'flex';
    }
  }


}