'user strict';
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const {DrinkCollection} = require('../models/drinks');
const {Users} = require('../models/users');

const jsonParser = bodyParser.json();
//login request would return a jwt
router.post('/', jsonParser, (req, res) => {
	//make sure it is a valid request
	const requiredFields = ['userName', 'password'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i]
		if (!(field in req.body)) {
			const messge = `Request body is missing ${field}`
			console.error(messge);
			return res.status(400).send(messge);
		}
	}
	//user authen
	//check db to make sure user is there
	let {userName, password} = req.body;
	let users = Users();
	let torf;
	Users.findOne({"userName": userName}, (err, user) => {
		console.log('USER:', user)
		if (user === null) {
			return res.status(400).send('User not found')}
		console.log( "HASED PASSWORD:", users.validatePassword(password, user.password));
		torf = users.validatePassword(password, user.password);
		return torf;
	})
	.then(val => {
		if (torf === false) {
			res.status(400).send('Wrong password');
		} else {
			jwt.sign({user: userName}, "testCert", {expiresIn: '1m'}, (err, token) => {
				res.json({userName, token});
			})
		}
	})
	.catch(err => {
		return res.status(500).send('Something happened');
	})
});

//refresh endpoint
router.post('/refresh', verifyToken, (req, res) => {
	console.log("UserName", req);
	jwt.verify(req.token, "testCert", (err, authData) => {
		if (err) {
			res.sendStatus(403)
		} else {
			let user = req.body.userName;
			jwt.sign({user: userName}, "testCert", {expiresIn: '1m'}, (err, token) => {
				console.log(`ERROR: ${err}`);
				console.log(`TOKEN: ${token}`);
				return res.json({user, token})
			})
		};
	});
});

function verifyToken(req, res, next) {	//get auth header
	const bearerHeader = req.headers['authorization'];
	console.log(`AUTHORIZATION: ${bearerHeader}`);
	// check if bearer is undefined
	if (typeof bearerHeader !== 'undefined') {
		//split at space
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		console.log(`JWT: ${bearerToken}`)
		//set token
		req.token = bearerToken;
		next();
	} else {
		//forbidden
		res.sendStatus(403);
	}
};
module.exports = router;