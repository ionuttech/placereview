const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: 'You must provide a name'
	},
	description: {
		type: String,
		trim: true
	},
	address: {
		type: String,
		trim: true,
		required: 'You must provide an address'
	},
	photo: {
		type: String
	},
	slug: {
		type: String,
		unique: true
	}
});

placeSchema.virtual('reviews', {
	ref: 'Review',
	localField: '_id',
	foreignField: 'place'
});

module.exports = mongoose.model('Place', placeSchema);
