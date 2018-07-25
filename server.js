'use strict';
const express = require('express');
const morgan = require('morgan');
const request = require('request');

const app = express();

app.use(morgan('common'));

app.get('/', (req,res) => {
	res.send('Working');
});

app.listen(5000, () => console.log('listening at port 5000'));