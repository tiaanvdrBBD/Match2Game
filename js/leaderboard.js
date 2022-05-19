// handles requests to server
async function sendRequest(url, type) {
    const options = {
        method: `${type}`,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // async request -> server
    let response_obj = await fetch(url, options)
        .catch(e => {
            // failure: wrap error
            return serverError();
        });

    // optional chaining catch used when query is unsucessful (like ERR_CONNECTION_REFUSED)
    try {
        response_obj = await response_obj.json();
    } finally {
        return response_obj;
    }
}
// get all a grid's info with gridID = [4x4 = 1], [6x6 = 2], [8x8 = 3]
async function getAllGridScores(gridID) {

    let usersInfo = await sendRequest(`http://localhost:3000/api/scores?gridID=${gridID}`, 'GET');
    printQueryFeedback(`SERVER: get scores response sucess`, usersInfo);

    return usersInfo;
}


async function getPlayerGridScores(gridID, username) {
    let userInfo = await sendRequest(`http://localhost:3000/api/player/scores?gridID=${gridID}&username=${username}`, 'GET');
    printQueryFeedback(`SERVER: get player score(s) response sucess`, userInfo);

    return userInfo;
}


function printQueryFeedback(header, responseObj) {
    if (!responseObj.success) {
        console.log(`${header}: false... error: ${JSON.stringify(responseObj.error, null, 2)}`);
    } else {
        console.log(`${header}: true!`);
    }
}

function serverError() {
    return {
        success: false,
        error: "server not running... try again"
    };
}

const tableHeaders = ['rank', 'username', 'moves', 'time_', 'score'];

// TODO: remove static data below

let previousY = 0;
let currentY = 0;
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {

        // update 
        if (entry.target.classList.value === "activeFontColor") {
            currentY = entry.boundingClientRect.y
        }

        if (entry.target.classList.value === "activeFontColor") {

            if (entry.isIntersecting) {
                // showing (hide header/footer)
                document.getElementById("activePlayerResults-footer").style.color = "#FFFFFF";
                document.getElementById("activePlayerResults-header").style.color = "#FFFFFF";
            } else {
                if (currentY <= previousY && previousY !== 0) {
                    // show header
                    document.getElementById("activePlayerResults-footer").style.color = "#FFFFFF";
                    document.getElementById("activePlayerResults-header").style.color = "red";
                } else {
                    // show footer
                    document.getElementById("activePlayerResults-footer").style.color = "red";
                    document.getElementById("activePlayerResults-header").style.color = "#FFFFFF";
                }
            }
        }
        previousY = currentY;
    })
}, {
    threshold: [0.5]
});

function getCurPlayerPositionsAndScores(top100Data, curUsername) {

    let curPlayerScores = [];
    top100Data.forEach((player, index) => {
        if (curUsername === player.username) {

            if (player.curPlayerData) {

                curRank = index + 1;
            } else {
                curPlayerScores.push({
                    score: player.score,
                    position: index + 1,
                });
            }
        }
    });
    return curPlayerScores;
}

function assignScoreColor(prevRank, curRank) {

    console.log('curRank: ' + curRank);
    console.log('prevRank: ' + prevRank);

    if (curRank < prevRank) {
        showsArrow = true;
        return 'green';
    }
    if (curRank > prevRank) {
        showsArrow = true;
        return 'red';
    }

    showsArrow = false;
    return 'purple';
}

function assignPrevRank(curPlayerScoresAndPositions) {

    console.log(`old scores and pos: ${JSON.stringify(curPlayerScoresAndPositions, null, 2)}`);

    // assign prev pos 
    //above
    if (curRank < curPlayerScoresAndPositions[0].position)
        return curPlayerScoresAndPositions[0].position;

    //below
    if (curRank > curPlayerScoresAndPositions[curPlayerScoresAndPositions.length - 1].position)
        return curPlayerScoresAndPositions[curPlayerScoresAndPositions.length - 1].position;

    //same/between
    return curRank;
}

function getRankLabel(curRank) {

    return prevRank - curRank;
}

// TODO: remove static data below
let prevRank = -1; // can be null
let curRank = -1;
let activePlayerName = 'Trevor';
let activePlayerMoves = 12;
let activePlayerTime = 33;
let activePlayerScore = 10600;
let scoreColor = 'red';
let showsArrow = false;

async function populateLeaderboard() {

    // get old top 100 scores for grid
    let responseBody = await getAllGridScores(1);

    // add score
    let curPlayerData = {
        score: activePlayerScore,
        username: activePlayerName,
        moves: activePlayerMoves,
        time_: activePlayerTime,
        curPlayerData: true
    };

    responseBody.data.push(curPlayerData);

    // sort descending
    let leaderboardData = responseBody.data.sort((a, b) => {
        // compare logic
        if (a.score > b.score) return -1;
        if (a.score < b.score) return 1;
        return 0;
    });

    // only take top 100
    leaderboardData.data = responseBody.data.slice(0, 100);

    // ---------------------
    // get old current player POSITIONS from top 100 as array.
    let curPlayerScores = getCurPlayerPositionsAndScores(leaderboardData.data, activePlayerName);

    // logic for assigning old POS
    prevRank = assignPrevRank(curPlayerScores);

    // know if score is worse or bad (score color)
    scoreColor = assignScoreColor(prevRank, curRank);
    // ---------------------

    // populate grid
    const tableBody = document.getElementById("leaderBoardResults");

    let passedHighest = false;

    leaderboardData.data.forEach((leader, index) => {

        let leaderRow = document.createElement('tr');

        // add observer
        observer.observe(leaderRow);

        tableHeaders.forEach((tableProperty) => {

            let leaderColumn = document.createElement('td');

            // cur player normal row
            if (leader.username === activePlayerName && leader.score === activePlayerScore) {
                leaderRow.setAttribute('class', 'activeFontColor');
            } else {
                if (passedHighest) {
                    leaderRow.setAttribute('class', 'score-lower');
                } else {
                    leaderRow.setAttribute('class', 'score-higher');
                }
            }

            // cur player score row
            if (tableProperty === 'rank') {
                if (leader.username === activePlayerName && leader.score === activePlayerScore) {
                    // create table with arrow add to column
                    let scoreCol = document.createElement('td');
                    scoreCol.innerHTML = ` ${index + 1} `;

                    let arrow = document.createElement('li');
                    if (scoreColor === 'red') {
                        arrow.setAttribute('class', 'fas fa-arrow-down');
                    }
                    if (scoreColor === 'green') {
                        arrow.setAttribute('class', 'fas fa-arrow-up');
                    }

                    arrow.style.color = scoreColor;

                    let arrowCol = document.createElement('td');

                    arrowCol.innerHTML = `${getRankLabel(index + 1)} `;
                    arrowCol.appendChild(arrow);

                    leaderRow.style.color = scoreColor;

                    leaderColumn.appendChild(scoreCol);
                    // only show arrow if score is better/worse
                    if (showsArrow) {
                        leaderColumn.appendChild(arrowCol);
                    }
                    leaderColumn.setAttribute('class', 'td-rank');

                } else {
                    leaderColumn.innerHTML = index + 1;
                }
            } else {
                leaderColumn.innerHTML = leader[tableProperty];
            }

            // cur player header and footer
            if (leader.username === activePlayerName && leader.score === activePlayerScore) {
                let tableFoot = document.getElementById('activePlayerResults-footer');
                let tableHead = document.getElementById('activePlayerResults-header');

                let footerData = document.createElement('td');
                let headerData = document.createElement('td');

                if (tableProperty === 'rank') {
                    footerData.innerHTML = index + 1;
                    headerData.innerHTML = index + 1;
                } else {
                    footerData.innerHTML = leader[tableProperty];
                    headerData.innerHTML = leader[tableProperty];
                }

                if (tableProperty != 'rank' && tableProperty != 'username') {

                    footerData.setAttribute('class', 'hideColumn');
                    headerData.setAttribute('class', 'hideColumn');
                }
                footerData.style.color = scoreColor;
                headerData.style.color = scoreColor;
                tableFoot.appendChild(footerData);
                tableHead.appendChild(headerData);
            }

            if (tableProperty != 'rank' && tableProperty != 'username') {
                leaderColumn.setAttribute('class', 'hideColumn');
            }

            if (leader.username === activePlayerName && leader.score === activePlayerScore) {
                passedHighest = true;
            }

            leaderRow.appendChild(leaderColumn);
        });

        tableBody.appendChild(leaderRow);

    });

}

window.addEventListener('load', (event) => {
    document.getElementById("appNavbar").innerHTML = navbar();
});