//  import the Express framework
const express = require('express');

const cors = require('cors');

var sql = require("mssql");

// instantiate Express
const app = express();

app.use(cors({
    origin: '*'
}));

// set up our port
const port = 3000;

// start
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

var sql = require("mssql");

// config for your database
var config = {
    user: 'admin',
    password: 'match2game',
    server: 'cloud-db.cn20xj6c080k.us-east-1.rds.amazonaws.com',
    database: 'Match2Game',
    ssl: {
        ca: fs.readFileSync(path.resolve('rds-combined-ca-bundle.pem'), "utf-8")
    }
};

// connect to your database
sql.connect(config, function (err) {

    if (err) console.log(err);

    // create Request object
    var request = new sql.Request();
});


// protects against large requests
app.use(express.json({
    limit: '1mb'
}));

// post
app.post('/api', (request, response) => {
    console.log('request received!');
    response.send('hello');
});

// home page
app.get('/', (req, res) => {
    res.send('Hello World, from express');
});