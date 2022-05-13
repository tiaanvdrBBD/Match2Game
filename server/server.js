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
const {
    response
} = require('express');

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
        console.log(`Error connecting to Db...\n ${err}`);
        return;
    } else {
        // success
        console.log('Db connected...');
        db_connected = true;
    }
});

// turns error-first callback function into promise.
const query = util.promisify(connection.query).bind(connection);


app.post('/api/scores', async (request, response) => {
    console.log(`POST/api/scores request received...grid id: ${request.query.gridID}`);

    if (db_connected) {
        // get users from db
        let data = await query(`select * from Score where gridID=${request.query.gridID}`)
        // sort ascending
        let data_sorted = data.sort((a, b) => {
            // compare logic
            if (a.score < b.score) return -1;
            if (a.score > b.score) return 1;
            return 0;
        });

        // send response to client
        response.send(data_sorted);
    } else {
        // send data
        response.send('server error');
    }
});

app.post('/api/usernames', async (request, response) => {
    console.log(`POST/api/usernames request received...`);

    if (db_connected) {
        // get users from db
        let usernames = await query(`select username from Score;`)

        // send response to client
        response.send(usernames);
    } else {
        // send data
        response.send('server error');
    }
});

app.post('/api/insert', async (request, response) => {
    console.log(`POST/api/insert request received...`);

    if (db_connected) {
        // get users from db
        let feedback = await query(`insert into Score (username, time_, moves, score, gridID) values ('${request.query.username}', ${request.query.time}, ${request.query.moves}, ${request.query.score}, ${request.query.gridID});`)

        // send response to client
        response.send(feedback);
    } else {
        // send data
        response.send('server error');
    }
});

app.put('/api/update', async (request, response) => {
    console.log(`PUT/api/update request received...`);

    if (db_connected) {
        // get users from db

        let feedback = await query(`update Score set time_=${request.query.time}, moves=${request.query.moves}, score=${request.query.score}, gridID=${request.query.gridID} where username='${request.query.username}';`)

        // send response to client
        response.send(feedback);
        //  response.send(feedback);
    } else {
        // send data
        response.send('server error: not connected to db yet... try again');
    }
});
