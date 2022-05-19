const doc = this.document ; 

function showHowToPlay(){
    doc.getElementById("form").style.display = 'none';
    doc.getElementById("howToInfo").style.display = 'flex';

}

function hideHowToPlay(){
    doc.getElementById("form").style.display = 'flex';
    doc.getElementById("howToInfo").style.display = 'none';

}


window.addEventListener('load', (event) => {
    document.getElementById("appNavbar").innerHTML =  navbar() ;
    document.getElementById("navButtons").style.display = 'none';
});