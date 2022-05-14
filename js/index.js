const doc = this.document ; 

function showGongratulations(){
    doc.getElementById("grid").style.display = 'none';
    doc.getElementById("gongratulations").style.display = 'flex';
}

function hideGongratulations(){
    doc.getElementById("gongratulations").style.display = 'none';
    doc.getElementById("grid").style.display = 'flex';
}