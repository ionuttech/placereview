const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const placeController = require('../controllers/placeController');
const reviewController = require('../controllers/reviewController');

router.get('/', placeController.getPlaces, function(req, res) {
	res.render('index', { title: 'Homepage', styleFile: 'index.css', places: req.places });
});

router.get('/register', userController.checkLoggedOut, function(req, res) {
	res.render('register', { title: 'Register', styleFile: 'register.css' });
});

router.post('/register', userController.validateRegister, userController.registerUser, function(req, res) {
	res.send('User registered');
});

router.get('/login', userController.checkLoggedOut, function(req, res) {
	res.render('login', { title: 'Login' });
});

router.post('/login', userController.login);

router.get('/signout', userController.signout);

router.get('/account', userController.checkSession, function(req, res) {
	res.render('account', { title: 'User account' });
});

router.get('/create-place', userController.checkSession, function(req, res) {
	res.render('createPlace', { title: 'Create a new place' });
});

router.post(
	'/create-place',
	placeController.upload,
	placeController.resize,
	placeController.createSlug,
	placeController.createPlace
);

router.get('/place/:slug', reviewController.getReviewWithSlug, placeController.getPlaceWithSlug, function(
	req,
	res,
	next
) {
	res.render('place', { title: res.locals.place.name, styleFile: 'place.css' });
});

router.post('/create-review/:place', reviewController.createReview);

module.exports = router;
