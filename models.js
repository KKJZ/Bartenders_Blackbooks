'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//Schema
const drinkSchema = mongoose.Schema({
	user: {type: String, required: true},
	drinkName: {type: String, required: true},
	glass: String,
	ingredents:[
	{
		ingredent: String,
		measurement: String
	},
	{
		ingredent: String,
		measurement: String
	}],
	garnish: String,
	instructions: {type: String, required: true}
});

//schema to make the ouptut look like ingredents: [ingredent measurement, ingredent measurement, ingredent measurement]
drinkSchema.virtual('pour').get(function() {
	for (let i=0; i<this.ingredents.length; i++) {
		if (this.ingredents[i].measurement === null) {
			return this.ingredents[i].ingredent + ","
		}
		else {
			return this.ingredents[i].ingredent + this.ingredents[i].measurement + ","
		};
	};
});

drinkSchema.methods.serialize = function() {
	return {
		id: this._id,
		user: this.user,
		drinkName: this.drinkName,
		glass: this.glass,
		ingredents: this.ingredents,
		garnish: this.garnish,
		instructions: this.instructions
	};
};

const DrinkCollection = mongoose.model("Drinks", drinkSchema);

module.exports = { DrinkCollection };