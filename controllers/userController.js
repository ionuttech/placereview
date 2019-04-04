const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');

exports.validateRegister = function(req, res, next) {
	const userData = req.body;

	const userWithEmail = User.findOne({ email: userData.email }).then(function(user) {
		if (user) {
			res.render('register', { title: 'Register', styleFile: 'register.css', errors: ['Email is already in use 🤦‍♀️'] });
		}
	});

	const userWithUsername = User.findOne({ username: userData.username }).then(function(user) {
		if (user) {
			res.render('register', {
				title: 'Register',
				styleFile: 'register.css',
				errors: ['Username is already in use 🤦‍♀️']
			});
		}
	});

	if (userData.password != userData.confirmPassword) {
		res.render('register', { title: 'Register', styleFile: 'register.css', errors: ["Passwords don't match"] });
	} else {
		next();
	}
};

exports.registerUser = function(req, res, next) {
	const hashPassword = bcrypt.hashSync(req.body.password, 8);
	const user = new User({
		email: req.body.email,
		username: req.body.username,
		password: hashPassword
	});

	user.save().then(function(user) {
		res.redirect('/');
	});
};

exports.login = function(req, res) {
	const userData = req.body;

	const user = User.findOne({ username: userData.username }).then(function(user) {
		if (!user) {
			res.render('login', { title: 'login', styleFile: 'register.css', errors: ['No user found with this email'] });
		}

		const validPassword = bcrypt.compareSync(userData.password, user.password);

		if (validPassword == true) {
			req.session.user = user;
			res.redirect('/');
		} else {
			res.render('login', { title: 'login', styleFile: 'register.css', errors: ['Wrong pasword'] });
		}
	});
};

exports.signout = function(req, res) {
	if (req.session.user) {
		res.clearCookie('user_sid');
		res.redirect('/');
	}
	res.redirect('/login');
};

exports.checkSession = function(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};

exports.checkLoggedOut = function(req, res, next) {
	if (req.session.user) {
		res.redirect('/');
	}
	next();
};
