const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer =  require('multer');

const {DrinkCollection} = require('../models/drinks');
const {Users} = require('../models/users');

//multer setup
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null,'./images');
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + file.originalname);
	}
});
const fileFilter = function (req, file, cb) {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true)
	} else{
		cb(new Error("File must be jpeg or png file type"),false)
	}
}
const upload = multer({
	storage: storage,
	//max img file size: 5mb
	limit: {fileSize: 1024 * 1024 * 5},
	fileFilter: fileFilter
});

//pull up all drinks
router.get('/', (req, res) => {
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
//need to make a secure route
router.post('/', upload.single('drinkImage'), verifyToken, (req, res) => {
	jwt.verify(req.token, "testCert", (err, authData) => {
		if (err) {
			res.sendStatus(403);
		}	else {
			console.log(authData);
			const requiredFields = ["drinkName","glass","ingredents","instructions"];
			for (let i=0; i<requiredFields.length; i++) {
				const field = requiredFields[i];
				if (!(field in req.body)) {
					const messege = `Request body is missing ${field}`;
					console.error(messege);
					return res.status(400).send(messege);
				}
			};
			const item = DrinkCollection.create({
				user: authData.user,
				drinkName: req.body.drinkName,
				drinkImage: req.file.path, 
				glass: req.body.glass,
				ingredents: req.body.ingredents,
				garnish: req.body.garnish,
				instructions: req.body.instructions
				//Add Drink id to User model
			}).then(drink => res.status(201).json(drink.serialize()))
			.catch(err => {
				console.log(err);
				res.status(500).json({error: 'Something happened.'});
			});
		}
	});

});

//update a drink you have saved
//when user is made make sure user has access to this id
//need to make a secure route
router.put('/:id', verifyToken, (req,res) => {
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
//need to make a secure route
router.delete('/:id', verifyToken, (req, res) => {
	DrinkCollection.findByIdAndRemove(req.params.id)
	.then(() => {
		res.status(204).json({messege: "success"});
	})
	.catch(err => {
		console.error(err);
		res.status(500).json({error: 'Something happened.'})
	})
});

//verify token
function verifyToken(req, res, next) {
	//get auth header
	const bearerHeader = req.headers['authorization'];
	// check if bearer is undefined
	if (typeof bearerHeader !== 'undefined') {
		//split at space
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		//set token
		req.token = bearerToken;
		next();
	} else {
		//forbidden
		res.sendStatus(403);
	}
};

//search that filters by main alchol type
// router.post('/drinks/:i', (req, res) => {});

//search that works by glass type
// router.post('/drinks/:g', (req, res) => {});
module.exports = router;