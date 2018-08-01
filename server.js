'use strict';
const express = require('express');
const morgan = require('morgan');
const request = require('request');
const mongoose = require('mongoose');
//es6 promise 
mongoose.Promise = global.Promise;

const app = express();
const {PORT, DATABASE_URL} = require('./config');
const {DrinkCollection} =require('./models');
const {Users} = require('./users');

//logging
app.use(morgan('common'));
app.use(express.static('public'));
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

//pull up all drinks
app.get('/drinks', (req, res) => {
	DrinkCollection.find()
	.then(Drinks => { 
		res.json(Drinks.map(Drink => Drink.serialize()));
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'Something happened.'})
	})
});

//add a drink to the list
//when user is made add to their profile
app.post('/drinks', (req, res) => {
	const requiredFields = ["user", "drinkName","glass","ingredents","instructions"];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const messege = `Request body is missing ${field}`;
			console.error(messege);
			return res.status(400).send(messege);
		}
	}
	const item = DrinkCollection.create({
		user: req.body.user,
		drinkName: req.body.drinkName,
		glass: req.body.glass,
		ingredents: req.body.ingredents,
		garnish: req.body.garnish,
		instructions: req.body.instructions
	}).then(drink => res.status(201).json(drink.serialize()))
	.catch(err => {
		console.log(err);
		res.status(500).json({error: 'Something happened.'});
	});
});

//update a drink you have saved
//when user is made make sure user has access to this id
app.put('/drinks/:id', (req,res) => {
	if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({error: "Request path id and request body id values must match"});
	}
	const updated = {};
	const updatedFields = ["user", "drinkName", "glass", "ingredents", "garnish", "instructions"];
	updatedFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});
	DrinkCollection.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
	.then(updatedDrink => res.status(204).end())
	.catch(err => res.status(500).json({messege: 'Something happened.'}));
});

//remove drink from user profile and list
app.delete('/drinks/:id', (req, res) => {
	DrinkCollection.findByIdAndRemove(req.params.id)
	.then(() => {
		res.status(204).json({messege: "success"});
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'Something happened.'})
	})
});

//search that filters by main alchol type
// app.post('/drinksearch/:i', (req, res) => {});

//search that works by glass type
// app.post('/drinksearch/:g', (req, res) => {});

//make user profile
app.post('/users', (req, res) => {
	const requiredFields = ['userName', 'password', 'email'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const messege = `Request body is missing ${field}`;
			console.error(messege);
			return res.status(400).send(messege);
		}
	}
	console.log(req.body);
	let {userName, password, email} = req.body
	return Users.find({userName})
		.count()
		.then(count => {
			if (count > 0) {
				//return already made
			}
			return User.hashPassword(password);
		})
		.then(hash => {
			return User.create({
				userName,
				password: hash,
				email
			})
		})
		.then(user => {
			return res.status(201).json(user.serialize());
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Something happened'})
		})
});

//login request would return a jwt
// app.post('/login', (req, res) => {});

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