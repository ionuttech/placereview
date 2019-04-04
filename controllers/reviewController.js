const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const Place = mongoose.model('Place');

exports.createReview = function(req, res) {
	const reviewData = req.body;
	const review = new Review({
		message: reviewData.message,
		rating: reviewData.rating,
		author: req.session.user._id,
		place: req.params.place
	});

	review.save().then(function(store) {
		if (store) {
			res.redirect('back');
		}
	});
};

exports.getReviewWithSlug = function(req, res, next) {
	const slug = req.params.slug;
	Place.findOne({ slug: slug }).then(function(place) {
		if (place) {
			Review.find({ place: place._id }).then(function(reviews) {
				if (reviews) {
					res.locals.reviews = reviews;
					next();
				}
			});
		}
	});
};
