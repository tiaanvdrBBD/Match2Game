const doc = this.document ; 


function showGongratulations(){
    doc.getElementById("grid").style.display = 'none';
    doc.getElementById("gongratulations").style.display = 'flex';
}

function hideGongratulations(){
    doc.getElementById("gongratulations").style.display = 'none';
    doc.getElementById("grid").style.display = 'flex';

function showHowToPlay(){
    doc.getElementById("form").style.display = 'none';
    doc.getElementById("howToInfo").style.display = 'flex';

}

function hideHowToPlay(){
    doc.getElementById("form").style.display = 'flex';
    doc.getElementById("howToInfo").style.display = 'none';


}