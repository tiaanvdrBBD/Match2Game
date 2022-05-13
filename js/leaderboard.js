const leaderboardData = [   { rank: 1, name: "Bob", moves: "***", time:"***", points:"***"},
                            { rank: 2, name: "George", moves: "***", time:"***", points:"***"},
                            { rank: 3, name: "Kevin", moves: "***", time:"***", points:"***"},
                            { rank: 4, name: "Alice", moves: "***", time:"***", points:"***"},
                            { rank: 5, name: "John", moves: "***", time:"***", points:"***"},
                            { rank: 6, name: "Marco", moves: "***", time:"***", points:"***"},
                            { rank: 7, name: "Marie", moves: "***", time:"***", points:"***"},
                            { rank: 8, name: "Luan", moves: "***", time:"***", points:"***"},
                            { rank: 9, name: "Tiaan", moves: "***", time:"***", points:"***"},
                            { rank: 10, name: "Sandy", moves: "***", time:"***", points:"***"},
                            { rank: 11, name: "Bob", moves: "***", time:"***", points:"***"},
                            { rank: 12, name: "George", moves: "***", time:"***", points:"***"},
                            { rank: 13, name: "Kevin", moves: "***", time:"***", points:"***"},
                            { rank: 14, name: "Alice", moves: "***", time:"***", points:"***"},
                            { rank: 15, name: "John", moves: "***", time:"***", points:"***"},
                            { rank: 16, name: "Marco", moves: "***", time:"***", points:"***"},
                            { rank: 17, name: "Marie", moves: "***", time:"***", points:"***"},
                            { rank: 18, name: "Luan", moves: "***", time:"***", points:"***"},
                            { rank: 19, name: "Tiaan", moves: "***", time:"***", points:"***"},
                            { rank: 20, name: "Sandy", moves: "***", time:"***", points:"***"},
                            { rank: 21, name: "Bob", moves: "***", time:"***", points:"***"},
                            { rank: 22, name: "George", moves: "***", time:"***", points:"***"},
                            { rank: 23, name: "Kevin", moves: "***", time:"***", points:"***"},
                            { rank: 24, name: "Alice", moves: "***", time:"***", points:"***"},
                            { rank: 25, name: "John", moves: "***", time:"***", points:"***"},
                            { rank: 26, name: "Marco", moves: "***", time:"***", points:"***"},
                            { rank: 27, name: "Marie", moves: "***", time:"***", points:"***"},
                            { rank: 28, name: "Luan", moves: "***", time:"***", points:"***"},
                            { rank: 29, name: "Tiaan", moves: "***", time:"***", points:"***"},
                            { rank: 30, name: "Sandy", moves: "***", time:"***", points:"***"},
                            { rank: 31, name: "Bob", moves: "***", time:"***", points:"***"},
                            { rank: 32, name: "George", moves: "***", time:"***", points:"***"},
                            { rank: 33, name: "Kevin", moves: "***", time:"***", points:"***"},
                            { rank: 34, name: "Alice", moves: "***", time:"***", points:"***"},
                            { rank: 35, name: "John", moves: "***", time:"***", points:"***"},
                            { rank: 36, name: "Marco", moves: "***", time:"***", points:"***"},
                            { rank: 37, name: "Marie", moves: "***", time:"***", points:"***"},
                            { rank: 38, name: "Luan", moves: "***", time:"***", points:"***"},
                            { rank: 39, name: "Tiaan", moves: "***", time:"***", points:"***"},
                            { rank: 40, name: "Sandy", moves: "***", time:"***", points:"***"},
                            { rank: 41, name: "Bob", moves: "***", time:"***", points:"***"},
                            { rank: 42, name: "George", moves: "***", time:"***", points:"***"},
                            { rank: 43, name: "Kevin", moves: "***", time:"***", points:"***"},
                            { rank: 44, name: "Alice", moves: "***", time:"***", points:"***"},
                            { rank: 45, name: "John", moves: "***", time:"***", points:"***"},
                            { rank: 46, name: "Carmen", moves: "***", time:"***", points:"***"},
                            { rank: 47, name: "Marie", moves: "***", time:"***", points:"***"},
                            { rank: 48, name: "Luan", moves: "***", time:"***", points:"***"},
                            { rank: 50, name: "Tiaan", moves: "***", time:"***", points:"***"}
                        ];


const tableHeaders = ['rank' , 'name', 'moves', 'time', 'points'];

let activePlayerName = 'Carmen';

function populateLeaderboard(){
    /***
     * TODO: API call here for getting top 100 
     */
    const tableBody = document.getElementById("leaderBoardResults");

     leaderboardData.forEach((leader)=>{
        let leaderRow = document.createElement('tr') ;

        if(leader.name === activePlayerName){
            let tableFoot = document.getElementById('activePlayerResults') ;
            let footerRow = document.createElement('tr') ; 

        }

        tableHeaders.forEach((tableProperty) =>{
            let leaderColumn = document.createElement('td');
            leaderColumn.innerHTML = leader[tableProperty];
            
            if(leader.name === activePlayerName){
                let tableFoot = document.getElementById('activePlayerResults') ;
                let footerData = document.createElement('td') ; 
                footerData.innerHTML = leader[tableProperty];

                if(tableProperty != 'rank' && tableProperty != 'name'){
                    footerData.setAttribute('class', 'hideColumn') ; 
                }

                tableFoot.appendChild(footerData) ;
            }


            if(tableProperty != 'rank' && tableProperty != 'name'){
                leaderColumn.setAttribute('class', 'hideColumn') ; 
            }

            leaderRow.appendChild(leaderColumn);
        });

        tableBody.appendChild(leaderRow);
     }); 
    
}