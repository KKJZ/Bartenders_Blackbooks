'use strict';
const express = require('express');
const morgan = require('morgan');
const request = require('request');

const app = express();

app.use(morgan('common'));

//returns random drink as response
app.get('/', (req,res) => {
	request('https://www.thecocktaildb.com/api/json/v1/1/random.php', function(err, _res, body) {
		const drinks = JSON.parse(body);
		const drink = drinks.drinks[0];
		//need to go through ingredients and measure make sure they have values to the keys
		const output = {
			Name: drink.strDrink,
			Category: drink.strCategory,
			Thumbnail: drink.strDrinkThumb,
			Glass: drink.strGlass,
			Ingredents: {
			Ingredient1: drink.strIngredient1, Measure1: drink.strMeasure1,
			Ingredient2: drink.strIngredient2, Measure2: drink.strMeasure2,
			Ingredient3: drink.strIngredient3, Measure3: drink.strMeasure3
			},
			Instructions: drink.strInstructions
			};
		res.json(output);
	});
});

//takes search and returns drinks by same name
app.post('/drinksearch', (req, res) => {
	const searchTerm = req.query.search;
	request(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`, function(err, _res, body) {
		const drinks = JSON.parse(body);
		res.send(drinks.drinks);
	})
})

app.listen(5000, () => console.log('listening at port 5000'));