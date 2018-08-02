const express = require('express');
const router = express.Router();

const {DrinkCollection} = require('../models/drinks');
const {Users} = require('../models/users');

//login request would return a jwt
router.post('/', (req, res) => {
	const requiredFields = ['userName', 'password'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i]
		if (!(field in req.body)) {
			const messge = `Request body is missing ${field}`
			console.error(messge);
			return res.status(400).send(messge);
		}
	}
	let user = Users();
	let {userName, password} = req.body;
	user.validatePassword(password)
});

module.exports = router;