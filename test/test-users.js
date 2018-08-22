'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

// const {DrinkCollection} = require('../models/drinks');
const {Users} = require('../models/users');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

//seed db
function seedUsers () {
	console.log('seeding user data');
	const seedData = [];
	for (let i=0; i<=10; i++) {
		seedData.push(generateUserData());
	}
	return Users.insertMany(seedData);
};

//make tests users
function generateUserData () {
	const generatedData = {
		userName: faker.internet.userName(),
		password: faker.internet.password(),
		email: faker.internet.email()
	};
	return generatedData;
};

//tear down db
function tearDownDb () {
	console.warn('Deleting Database');
	return mongoose.connection.dropDatabase();
};

describe('BlackBook API resource', function() {
	before (function() {
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function() {
		return seedDrinks();
	});
	afterEach(function() {
		return tearDownDb();
	});
	after(function() {
		return closeServer();
	});
	//GET All Users should give just userName and Email
	describe('GET users', function () {
		it('Should return all users in db', function () {
			let res;
			return chai.request(app).get('/users')
			.then(function(_res) {
			res = _res;
			expect(res).to.have.status(200);
			expect(res.body).to.have.lengthOf.at.least(1);
			return Users.count();
		})
			.then(function(count) {
				expect(res.body).to.have.lengthOf(count)
			});
		});
		it('Users should return userName and Email only', function() {
			return chai.request(app).get('/users')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
				res.body.forEach(function(user) {
					expect(user).to.be.a('object');
					expect(user).to.include.keys("userName", "email");
				});
		})
});
	//POST Make User 
	// describe('')
	//POST Login
	// describe('')
