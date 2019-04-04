const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 7000;

require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE);
mongoose.connection.on('error', function(error) {
	console.log('🙅‍♀️🙅‍♀️🙅‍♀️', error.message);
});

require('./models/User');
require('./models/Place');
require('./models/Review');

const routes = require('./routes/routes');

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser());

app.use(cookieParser());

app.use(
	session({
		key: 'user_sid',
		secret: '123secretstuff',
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 600000,
		},
	})
);

app.use(function(req, res, next) {
	if (req.session.user) {
		res.locals.user = req.session.user;
	}
	next();
});

app.use(function(req, res, next) {
	if (req.cookies.user_sid && !req.session.user) {
		res.clearCookie('user_sid');
	}
	next();
});

app.use('/', routes);

const server = app.listen(PORT, function() {
	console.log('Express server running on port', PORT);
});
