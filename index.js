const express = require("express");
const app = express();
var cors = require("cors");
var bodyParser = require('body-parser');
var logger = require('morgan');
var debug = require('debug')('nodeproxy');

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

const authMongodb = require("./src/routes/authMongodb");

var myLogger = function (req, res, next) {
	console.log('LOGGED')
	next()
}

require('./mongooes.js');
app.use(myLogger)
// app.use(express.json());
app.use(authMongodb);

app.get("/", (req, res) => {
	res.send({ email: req.user.email })
})

var server = app.listen(3000,app.get('port'), () => {
	debug('Express server listening on port ' + server.address().port);
});