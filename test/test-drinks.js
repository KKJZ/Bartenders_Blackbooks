'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const {DrinkCollection} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

//seed db
function seedDrinks () {
	console.log('seeding drink data');
	const seedData = [];
	for (let i=0; i<=10; i++) {
		seedData.push(generateDrinkData());
	}
	return DrinkCollection.insertMany(seedData);
};

//make tests drinks
function generateDrinkData () {
	const generatedData = {
		user: faker.name.firstName(),
		drinkName: faker.name.title(),
		glass: faker.lorem.word(),
		ingredents:[
		{
			ingredent: faker.lorem.word(),
			measurement: faker.random.number()
		},
		{
			ingredent: faker.lorem.word(),
			measurement: faker.random.number(),
		}],
		garnish: faker.lorem.word(),
		instructions: faker.lorem.words()
	};
	return generatedData;
};

//tear down db
function tearDownDb () {
	console.warn('Deleting Database');
	return mongoose.connection.dropDatabase();
};

//describe drink api
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
	//GET Request
	describe('GET endpoint', function() {
		it('should return all drinks in db', function () {
			let res;
			return chai.request(app).get('/drinks')
			.then(function(_res) {
				res = _res;
				expect(res).to.have.status(200);
				expect(res.body).to.have.lengthOf.at.least(1);
				return DrinkCollection.count();
			})
			//should be 10
			.then(function(count) {
				expect(res.body).to.have.lengthOf(count)
			});
		});
		it('Drink objects should have correct fields', function() {
			let testDrink;
			return chai.request(app).get('/drinks')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
				res.body.forEach(function(drink) {
					expect(drink).to.be.a('object');
					expect(drink).to.include.keys("id", "user", "drinkName", "glass", "ingredents", "garnish", "instructions");
					expect(drink.ingredents).to.be.a('array');
				});
				testDrink = res.body[0];
				return DrinkCollection.findById(res.body[0].id);
			})
			.then(function(drink) {
				expect(testDrink.id).to.equal(drink.id);
				expect(testDrink.user).to.equal(drink.user);
				expect(testDrink.drinkName).to.equal(drink.drinkName);
				expect(testDrink.glass).to.equal(drink.glass);
				expect(testDrink.ingredents[0].ingredent).to.equal(drink.ingredents[0].ingredent);
				expect(testDrink.ingredents[0].measurement).to.equal(drink.ingredents[0].measurement);
				expect(testDrink.ingredents.length).to.equal(drink.ingredents.length);
				expect(testDrink.garnish).to.equal(drink.garnish);
				expect(testDrink.instructions).to.equal(drink.instructions);
			})
		});
	})

	//POST Request
	describe('POST endpoint', function() {
		it('should be able to add an item to the drink db', function() {
			const newDrink = generateDrinkData();
			return chai.request(app).post('/drinks')
			.send(newDrink)
			.then(function(res) {
				expect(res).to.have.status(201);
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys("id", "user", "drinkName", "glass", "ingredents", "garnish", "instructions");
				expect(res.body.id).to.not.be.null;
				return DrinkCollection.findById(res.body.id)
			})
			.then(function(drink) {
				expect(drink.user).to.equal(newDrink.user);
				expect(drink.drinkName).to.equal(newDrink.drinkName);
				expect(drink.glass).to.equal(newDrink.glass);
				expect(drink.ingredents[0].ingredent).to.equal(newDrink.ingredents[0].ingredent);
				expect(drink.ingredents[0].measurement).to.equal(JSON.stringify(newDrink.ingredents[0].measurement));
				expect(drink.garnish).to.equal(newDrink.garnish);
				expect(drink.instructions).to.equal(newDrink.instructions)
			})
		});
	})

	//PUT Request
	describe('PUT endpoint', function() {
		it('should be able to change a drink(by id) already in the db', function() {
			const updateData = {
				user: "changed user",
				drinkName: "changed name",
				glass: "changed glass",
				ingredents:[
					{ingredent: "changed ingredent",
					measurement: "changed measurement"}
					],
				garnish: "changed garnish",
				instructions: "changed instructions"
			};
			return DrinkCollection.findOne()
				.then(function(drink) {
					updateData.id = drink.id;
					return chai.request(app).put(`/drinks/${drink.id}`).send(updateData)
				})
				.then(function(res) {
					expect(res).to.have.status(204);
					return DrinkCollection.findById(updateData.id)
				})
				.then(function(drink) {
					expect(drink.id).to.equal(updateData.id);
					expect(drink.user).to.equal(updateData.user);
					expect(drink.drinkName).to.equal(updateData.drinkName);
					expect(drink.glass).to.equal(updateData.glass);
					expect(drink.ingredents[0].ingredent).to.equal(updateData.ingredents[0].ingredent);
					expect(drink.ingredents[0].measurement).to.equal(updateData.ingredents[0].measurement);
					expect(drink.garnish).to.equal(updateData.garnish);
					expect(drink.instructions).to.equal(updateData.instructions);
				})
		});
	})

	//DELETE Request
	describe('DELETE endpoint', function() {
		it('should be able to delete a drink(by id) from the db', function() {
			let deleteMe;
			return DrinkCollection.findOne()
			.then(function(newDrink) {
				deleteMe = newDrink;
				return chai.request(app).delete(`/drinks/${deleteMe.id}`);
			})
			.then(function(res) {
				expect(res).to.have.status(204);
				return DrinkCollection.findById(deleteMe.id);
			})
			.then(function(_res) {
				expect(_res).to.be.null;
			})
		});
	})

});