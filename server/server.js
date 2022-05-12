//  import the Express framework
const express = require('express');

// instantiate Express
const app = express();

// set up our port
const port = 3000;

// home page
app.get('/', (req, res) => {
    res.send('Hello World, from express');
});

// start
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))