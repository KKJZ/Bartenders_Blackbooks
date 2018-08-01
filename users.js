'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
	userName: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true}
});

//serialize

userSchema.methods.serialize = function() {
	return {
		userName: this.userName,
		email: this.email
	};
};

//validate password
userSchema.methods.validatePassword = function(password) {
	return bcrypt.compare(password, this.password);
};

//hash password
userSchema.methods.hashPassword = function(password) {
	return bcrypt.hash(password, 10);
}

const Users = mongoose.model('Users', userSchema);

module.exports = {Users};