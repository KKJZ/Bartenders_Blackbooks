'use strict';
const express = require('express');
const morgan = require('morgan');
const request = require('request');
const mongoose = require('mongoose');
//es6 promise
mongoose.Promise = global.Promise;

const app = express();
const {PORT, DATABASE_URL} = require('./config');

//logging
app.use(morgan('common'));
app.use(express.static('public'));

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

//pull up all drinks
app.get('/drinksearch', (req, res) => {});

//search that filters by main alchol type
app.post('/drinksearch/:i', (req, res) => {});

//search that works by glass type
app.post('/drinksearch/:g', (req, res) => {});

//make user profile
app.post('/users', (req, res) => {});

//login request would return a jwt
app.post('/login', (req, res) => {});

//add a drink to the user profile
app.post('/mydrink', (req, res) => {});

//update a drink you have saved
app.put('/mydrink/:id', (req,res) => {});

//remove drink from user profile
app.delete('/mydrink/:id', (req, res) => {});

let server;

function runServer (databaseURL, port = PORT) {
	return new Promise ((resolve, reject) => {
		mongoose.connect(databaseURL, err => {
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