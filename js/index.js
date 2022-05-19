const doc = this.document ;

function showHowToPlay(){
    doc.getElementById("form").style.display = 'none';
    doc.getElementById("howToInfo").style.display = 'flex';

    sessionStorage.setItem("howToPlay", true);
}

function hideHowToPlay(){
    doc.getElementById("form").style.display = 'flex';
    doc.getElementById("howToInfo").style.display = 'none';

    sessionStorage.setItem("howToPlay", false);
}


window.addEventListener('load', (event) => {
    document.getElementById("appNavbar").innerHTML =  navbar() ;
    document.getElementById("navButtons").style.display = 'none';

    if (sessionStorage.getItem("howToPlay")) {
      showHowToPlay();
    }
});