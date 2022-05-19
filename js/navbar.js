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
            <a onclick="navHome()"><button class="tertiary-button">Pond Size</button></a>
          </li>
          <li>
           <a href="../html/leaderboard.html"><button class="tertiary-button">The Fish Pond</button>
          </li>
          <li>
            <a onclick="navHTP()"><button class="tertiary-button">How to play?</button></a>
          </li>
        </section>
        <section id="dropNavButtons" onclick="toggleDropMenu()">
          <i class="fas fa-bars"></i>
        </section>
      </ul>
      <ul id="verticalBar">
          <li>
            <a onclick="navHome()">Pond Size</a>
          </li>
          <li>
            <a href="../html/leaderboard.html">The Fish Pond</a>
          </li>
          <li>
            <a onclick="navHTP()">How to play?</a>
          </li>
      </ul>
    `
}

function navHTP() {
  sessionStorage.setItem("howToPlay", 'true');
  window.location.href = "../index.html";
}

function navHome() {
  sessionStorage.setItem("howToPlay", 'false');
  window.location.href = "../index.html";
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