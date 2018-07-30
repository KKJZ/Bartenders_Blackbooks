'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//Schema
const drinkSchema = mongoose.Schema({
	user: {type: String, required: true},
	name: {type: String, required: true},
	glass: String,
	ingredents:[
	{
		ingredent: String,
		measurement: String
	}
	{
		ingredent: String,
		measurement: String
	}]
	garnish: String,
	insrtuctions: {type: String, required: true}
});

//schema to make the ouptut look like ingredents: [ingredent measurement, ingredent measurement, ingredent measurement]
drinkSchema.virual('pour').get(function() {
	for (let i=0; i<this.ingredents.length; i++) {
		if (this.ingredents[i].measurement === null) {
			return `${this.ingredents[i].ingredent},`
		};
		else {
			return `${this.ingredents[i].ingredent} ${this.ingredents[i].measurement},` 
		};
	};
});

drinkSchema.methods.serialize = function() {
	return {
		id: this._id,
		user: this.user,
		glass: this.glass,
		ingredents: [this.pour],
		garnish: this.garnish,
		insrtuctions: this.insrtuctions
	};
};

const Drinks = mongoose.model('Drinks', drinkSchema);

module.exports = { Drinks }