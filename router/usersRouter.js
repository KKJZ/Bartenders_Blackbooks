const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const {DrinkCollection} = require('../models/drinks');
const {Users} = require('../models/users');

const jsonParser = bodyParser.json();
//show users profiles
router.get('/', jsonParser, (req, res) => {
	Users.find()
	.then(users => {
		res.json(users.map(user => user.serialize()));
	})
	.catch(err => {
		console.eror(err);
		res.status(500).json({error: 'Something happened'});
	})
})

//make user profile
router.post('/', jsonParser, (req, res) => {
	console.log(req.body);
	const requiredFields = ['userName', 'password', 'email'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const messege = `Request body is missing ${field}`;
			console.error(messege);
			return res.status(400).send(messege);
		}
	};
	let user = Users();
	let {userName, password, email} = req.body
	return Users.find({userName})
		.count()
		.then(count => {
			if (count > 0) {
				const messege = "User name is already taken";
				console.error(messege);
				res.status(400).json({error: messege})
			}
			return user.hashPass(password);
		})
		.then(hash => {
			return Users.create({
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

module.exports = router;