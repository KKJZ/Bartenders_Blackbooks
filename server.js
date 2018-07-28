'use strict';
const express = require('express');
const morgan = require('morgan');
const request = require('request');

const app = express();

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

//SCHEMA
//NAME: DRINK.NAME
//CATEGORY: DRINK.CATEGORY
//GLASS: DRINK.GLASS
//INGREDENTS: [DRINK.INGREDIENT1 + DRINK.MEASURE1, ETC...]
//INSTRUCTIONS: DRINK.INSTRUCTIONS

//returns random drink as response
app.get('/random', (req,res) => {
	request('https://www.thecocktaildb.com/api/json/v1/1/random.php', function(err, _res, body) {
		const drinks = JSON.parse(body);
		const drink = drinks.drinks[0];
		//need to go through ingredients and measure make sure they have values to the keys
		const output = {
			name: drink.strDrink,
			category: drink.strCategory,
			thumbnail: drink.strDrinkThumb,
			glass: drink.strGlass,
			ingredents: {
			ingredient1: drink.strIngredient1, measure1: drink.strMeasure1,
			ingredient2: drink.strIngredient2, measure2: drink.strMeasure2,
			ingredient3: drink.strIngredient3, measure3: drink.strMeasure3
			},
			instructions: drink.strInstructions
			};
		res.json(output);
	});
});

//takes search and returns drinks by same name
app.post('/drinksearch', (req, res) => {
	console.log(req);
	const searchTerm = req.query.search;
	request(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`, function(err, _res, body) {
		const drinks = JSON.parse(body);
		res.send(drinks.drinks);
	})
});


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

app.listen(5000, () => console.log('listening at port 5000'));