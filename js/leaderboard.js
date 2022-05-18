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
let usersInfo = "";
// get all a grid's info with gridID = [4x4 = 1], [6x6 = 2], [8x8 = 3]
async function getScores(gridID) {

    usersInfo = await sendRequest(`http://localhost:3000/api/scores?gridID=${gridID}`, 'GET');
    printQueryFeedback(`SERVER: get scores response sucess`, usersInfo);

    return usersInfo;

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

let activePlayerName = 'JJJ';
let activePlayerMoves = 12;
let activePlayerTime = 33;
let activePlayerScore = 10481;

function between(x, min, max) {
    return x >= min && x <= max;
}
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

async function populateLeaderboard() {
    // get top 100 scores for a grid
    let responseBody = await getScores(1);

    // add player score
    let curPlayerData = {
        score: activePlayerScore,
        username: activePlayerName,
        moves: activePlayerMoves,
        time_: activePlayerTime
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

    const tableBody = document.getElementById("leaderBoardResults");

    let passedHighest = false;
    leaderboardData.data.forEach((leader, index) => {

        let leaderRow = document.createElement('tr');

        // add observer
        observer.observe(leaderRow);

        tableHeaders.forEach((tableProperty) => {

            let leaderColumn = document.createElement('td');

            // cur player
            if (leader.username === activePlayerName) {
                leaderRow.setAttribute('class', 'activeFontColor');
            } else {
                if (passedHighest) {
                    leaderRow.setAttribute('class', 'score-lower');
                } else {
                    leaderRow.setAttribute('class', 'score-higher');
                }
            }

            // other players
            if (tableProperty === 'rank') {
                leaderColumn.innerHTML = index + 1;
            } else {
                leaderColumn.innerHTML = leader[tableProperty];
            }

            // cur player
            if (leader.username === activePlayerName) {
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

                tableFoot.appendChild(footerData);
                tableHead.appendChild(headerData);
            }

            if (tableProperty != 'rank' && tableProperty != 'username') {
                leaderColumn.setAttribute('class', 'hideColumn');
            }

            if (leader.username === activePlayerName) {
                passedHighest = true;
            }

            leaderRow.appendChild(leaderColumn);
        });

        tableBody.appendChild(leaderRow);
    });

}