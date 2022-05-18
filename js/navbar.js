function navbar(){
    return `
      <ul id="horizontalBar">
        <section>
          <li id="gameLogo" class="secondary-button">AquaFind</li>
        </section>
        <section id="navButtons">
          <li>
            <button class="tertiary-button">Pond Size</button>
          </li>
          <li>
            <button class="tertiary-button">The Fish Pond</button>
          </li>
          <li>
            <button class="tertiary-button">How to play?</button>
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

function toggleDropMenu(){
  let elementSelected = document.getElementById("verticalBar");

  if(elementSelected.style.display == 'flex'){
    elementSelected.style.display = 'none';
  }else{
    elementSelected.style.display = 'flex';
  }
}