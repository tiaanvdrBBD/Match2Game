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

app.post('/api/scores', async (request, response) => {
    console.log(`POST/api/scores request received...grid id: ${request.query.gridID}`);

    let gridScores_obj = {};

    if (db_connected) {
        // query
        gridScores_obj = await query(`select * from Score where gridID=${request.query.gridID}`);

        // db success
        if (gridScores_obj.success) {
            // sort ascending
            let data_sorted = gridScores_obj.data.sort((a, b) => {
                // compare logic
                if (a.score < b.score) return -1;
                if (a.score > b.score) return 1;
                return 0;
            });
            gridScores_obj.data = data_sorted;
        }
    } else {
        // define obj to return
        gridScores_obj = {
            success: false,
            error: "error: server not connected to db - try again."
        };
    }
    // send response
    response.send(gridScores_obj);
    // print overall feedback
    console.log(`POST/api/scores request success: ${gridScores_obj.success}`);
});

app.post('/api/usernames', async (request, response) => {
    console.log(`POST/api/usernames request received...`);

    let usernames_obj = {};
    if (db_connected) {
        // query
        usernames_obj = await query(`select username from Score;`);
    } else {
        // define obj to return
        usernames_obj = {
            success: false,
            error: "error: server not connected to db - try again."
        };
    }
    // send response
    response.send(usernames_obj);
    // print overall feedback
    console.log(`POST/api/usernames request success: ${usernames_obj.success}`);

});

app.post('/api/insert', async (request, response) => {
    console.log(`POST/api/insert request received...`);

    let feedback_obj = {};
    if (db_connected) {
        // query
        feedback_obj = await query(`insert into Score (username, time_, moves, score, gridID) values 
        ('${request.query.username}', ${request.query.time}, ${request.query.moves}, ${request.query.score}, ${request.query.gridID});`)
    } else {
        // define obj to return
        feedback_obj = {
            success: false,
            error: "error: server not connected to db - try again."
        };
    }
    // send response
    response.send(feedback_obj);
    // print overall feedback
    console.log(`POST/api/insert request success: ${feedback_obj.success}`);
});

app.put('/api/update', async (request, response) => {
    console.log(`PUT/api/update request received...`);

    let feedback_obj = {};
    if (db_connected) {
        // query
        feedback_obj = await query(`update Score set time_=${request.query.time}, moves=${request.query.moves}, score=${request.query.score}, gridID=${request.query.gridID} where username='${request.query.username}';`)

    } else {
        // define obj to return
        usernames_obj = {
            success: false,
            error: "error: server not connected to db - try again."
        };
    }
    // send response
    response.send(feedback_obj);
    // print overall feedback
    console.log(`PUT/api/update request success: ${feedback_obj.success}`);
});