const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
	message: {
		type: String,
		required: 'You must write a review',
	},
	rating: {
		type: Number,
		required: 'You must choose a rating',
		min: 1,
		max: 5,
	},
	created: {
		type: Date,
		default: Date.now,
	},
	author: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'You must supply a username',
	},
	place: {
		type: mongoose.Schema.ObjectId,
		ref: 'Place',
		required: 'You must supply a place',
	},
});

function autopopulate(next) {
	this.populate('author');
	next();
}

ReviewSchema.pre('find', autopopulate);
ReviewSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Review', ReviewSchema);
