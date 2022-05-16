const express = require('express'); //  import the Express framework
const cors = require('cors');
const util = require('util');
const app = express(); // instantiate Express
app.use(cors({
    origin: '*'
}));
app.use(express.json({ // protects against large requests
    limit: '1mb'
}));

const port = 3000; // set up our port
app.listen(port, () => console.log(`Server started on ${port}...`)); // start server

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'match2game.cn20xj6c080k.us-east-1.rds.amazonaws.com',
    port: 3306,
    user: 'admin',
    password: 'match2game',
    database: 'Match2Game',
});

let db_connected = false;

// connect
connection.connect((err) => {
    // failure
    if (err) {
        console.log(`Error connecting to Db...`);
        db_connected = false;
        return;
    } else {
        // success
        console.log('Db connected...');
        db_connected = true;
    }
});

// wraps queries of error-first callback nature into responses with custom returns 
// (why? so that we can handle errors as normal messages and not `errors` -meaning we dont break code).
const query = async (request) => {
    // turns error-first callback function into promise.
    const newQuery = util.promisify(connection.query).bind(connection);

    // now I can always return an object to client regardsless of query and result.
    return await newQuery(request)
        .then(r => {
            return {
                success: true,
                data: r
            };
        })
        .catch(e => {
            return {
                success: false,
                error: e
            };
        });
}

async function handleRequest(calculations, queryString, headerString, response) {
    console.log(`${headerString} request received...`);

    let response_obj = {};
    if (db_connected) {
        // query
        response_obj = await query(queryString);

        // (optional calculations to add logic to incoming data)
        if (calculations !== null) {
            response_obj = calculations(response_obj);
        }

    } else {
        // define obj to return
        response_obj = {
            success: false,
            error: "error: server not connected to db - try again."
        };
    }
    // send response
    response.send(response_obj);
    // print overall feedback
    console.log(`${headerString} request success: ${response_obj.success}`);
};

app.post('/api/scores', async (request, response) => {

    // custom logic needed to sort
    function calcs(curObj) {
        if (curObj.success) {
            // sort ascending
            let data_sorted = curObj.data.sort((a, b) => {
                // compare logic
                if (a.score < b.score) return -1;
                if (a.score > b.score) return 1;
                return 0;
            });
            curObj.data = data_sorted;
            return curObj;
        }
    }

    handleRequest(calcs, `select * from Score where gridID=${request.query.gridID}`, `POST/api/scores`, response);
});

app.post('/api/usernames', async (request, response) => {

    function getOnlyUsernames(curObj) {
        if (curObj.success) {
            // sort ascending
            let data_sorted = curObj.data.map(i => i.username);
            curObj.data = data_sorted;
            return curObj;
        }
    }
    handleRequest(getOnlyUsernames, `select username from Score;`, `POST/api/usernames`, response);
});

app.post('/api/insert', async (request, response) => {

    handleRequest(null, `insert into Score (username, time_, moves, score, gridID) values 
    ('${request.query.username}', ${request.query.time}, ${request.query.moves}, ${request.query.score}, ${request.query.gridID});`, `POST/api/insert`, response);
});

app.put('/api/update', async (request, response) => {

    handleRequest(null, `update Score set time_=${request.query.time}, moves=${request.query.moves}, score=${request.query.score}, gridID=${request.query.gridID} where username='${request.query.username}';`, `POST/api/update`, response);
});