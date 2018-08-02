const express = require('express');
const router = express.Router();

const {DrinkCollection} = require('../models/drinks');
const {Users} = require('../models/users');

//login request would return a jwt
// app.post('/', (req, res) => {});

module.exports = router;