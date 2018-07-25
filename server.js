'use strict';
const express = require('express');
const morgan = require('morgan');
const request = require('request');

const app = express();

app.use(morgan('common'));

app.get('/', (req,res) => {
	request('https://www.thecocktaildb.com/api/json/v1/1/random.php', function(err, _res, body) {
		const drinks = JSON.parse(body);
		const drink = drinks.drinks[0];
		console.log(drink);
		res.send(drink.strDrink);
	});
});

app.listen(5000, () => console.log('listening at port 5000'));