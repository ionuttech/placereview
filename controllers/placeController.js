const mongoose = require('mongoose');
const Place = mongoose.model('Place');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const slug = require('slugs');

const multerOptions = {
	storage: multer.memoryStorage(),
	fileFilter(req, file, next) {
		const isPhoto = file.mimetype.startsWith('image/');
		if (isPhoto == true) {
			next(null, true);
		} else {
			next({ message: 'That file is not allowed' }, false);
		}
	}
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async function(req, res, next) {
	if (!req.file) {
		next();
		return;
	}

	const extension = req.file.mimetype.split('/')[1];
	req.body.photo = uuid.v4() + '.' + extension;

	const photo = await jimp.read(req.file.buffer);
	await photo.resize(1024, jimp.AUTO);
	await photo.write('./public/uploads/' + req.body.photo);

	next();
};

exports.createSlug = function(req, res, next) {
	console.log(req.body.name);
	let slugName = slug(req.body.name);
	const slugRegEx = new RegExp(`^(${slugName})((-[0-9]*$)?)$`, 'i');
	Place.find({ slug: slugRegEx }).then(function(places) {
		if (places.length > 0) {
			slugName = slugName + '-' + places.length;
		}
		req.body.slug = slugName;
		next();
	});
};

exports.createPlace = function(req, res, next) {
	const placeData = req.body;
	if (!placeData.name) {
		res.render('createPlace', { title: 'CreatePlace', errors: ['Missing name 🙅‍♀️'] });
	}
	if (!placeData.address) {
		res.render('createPlace', { title: 'CreatePlace', errors: ['Missing address 🙅‍♀️'] });
	}

	const place = new Place({
		name: placeData.name,
		description: placeData.description,
		address: placeData.address,
		photo: placeData.photo,
		slug: placeData.slug
	});

	place.save().then(function(place) {
		if (place) {
			res.redirect('/');
		}
	});
};

exports.getPlaceWithSlug = function(req, res, next) {
	const slug = req.params.slug;
	Place.findOne({ slug: slug }).then(function(place) {
		if (!place) {
			res.send('404 Place not found');
		}
		res.locals.place = place;
		console.log(place);
		next();
	});
};

exports.getPlaces = function(req, res, next) {
	Place.find({}).then(function(places) {
		req.places = places;
		next();
	});
};
