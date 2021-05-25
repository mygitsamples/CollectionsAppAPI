const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();


const fs = require('fs');

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(cors());
const routes = require('./app/routes/routes')(app, fs);

const server = app.listen(3200, () => {
  console.log('listening on port ', server.address().port);
});