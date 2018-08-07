'user strict';
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const {DrinkCollection} = require('../models/drinks');
const {Users} = require('../models/users');

//login request would return a jwt
router.post('/', (req, res) => {
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
		console.log( "HASED PASSWORD:", users.validatePassword(password, user.password));
		torf = users.validatePassword(password, user.password);
		console.log(torf);
		return torf;
	})
	.then(val => {
		if (torf === false) {
			res.send('Wrong password').end();
		} else {
			jwt.sign({user: userName, password: password}, "testCert", {expiresIn: '1h'}, (err, token) => {
				res.json({token});
			})
		}
	})
	.catch(err => {
		return res.status(500).send('Something happened');
	})
})
	// Users.findOne({"userName": userName}, function (err, user) {
	// 	if (user === null) {
	// 		const messege = "User name or password not found.";
	// 		return res.send(400).send(messege);
	// 	} else{
	// 		users.hashPass(password)
	// 		.then((hashedpass) => {Users.findOne({"userName": userName}), (err, user) => {
	// 			console.log(hashedpass, user.password)
	// 		}})
	// 	}
	// })
	//validate password
	//jwt sign
	// jwt.sign({user: userName, password: password}, 'testCert', {expiresIn: '1h'}, (err, token) => {
	// 	res.json({token: token});
	// })

module.exports = router;