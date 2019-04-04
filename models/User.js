const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		required: 'Please supply an email address'
	},
	username: {
		type: String,
		unique: true,
		trim: true,
		required: 'Please supply an username'
	},
	password: {
		type: String,
		required: 'Please supply a password'
	}
});

module.exports = mongoose.model('User', userSchema);
