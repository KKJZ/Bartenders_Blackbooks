'use strict';
const express = require('express');
const morgan = require('morgan');
const request = require('request');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

const drinkRouter = require('./router/drinkRouter');
const usersRouter = require('./router/usersRouter');
const loginRouter = require('./router/loginRouter');
//es6 promise 
mongoose.Promise = global.Promise;

const app = express();
const {PORT, DATABASE_URL} = require('./config');
const {DrinkCollection} =require('./models/drinks');
const {Users} = require('./models/users');

//logging
app.use(morgan('common'));

app.use("/", express.static('./public'));
app.use('/images', express.static('images'));
app.use(express.json());

//CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

//router to endpoints
app.use('/login', loginRouter);
app.use('/drinks', drinkRouter);
app.use('/users', usersRouter);

let server;

function runServer (databaseURL, port = PORT) {
	return new Promise ((resolve, reject) => {
		mongoose.connect(databaseURL, { useNewUrlParser: true }, err => {
			if (err) 
				return reject(err);
			})
			console.log(`connected to ${databaseURL}`)
			server = app.listen(port, () => {
				console.log(`Server is listening on PORT: ${port}`);
				resolve();
			})
			.on("error", err => {
				mongoose.disconnect();
				reject(err);
			})
	})
};

function closeServer () {
	return mongoose.disconnect().then(() => {
		return new Promise ((resolve, reject) => {
			console.log("Closing Server")
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
};

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.log(err));
}

module.exports = {app, runServer, closeServer}