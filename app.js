'use strict';

// Express app for postharvest database

const express = require('express');
const cors = require('cors');

const { NotFoundError } = require('./expressError');

const { authenticateJWT } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const commoditiesRoutes = require('./routes/commodities');
const usersRoutes = require('./routes/users');
const shelfLifeRoutes = require('./routes/shelfLife');
const ethyleneRoutes = require('./routes/ethylene');
const respirationRoutes = require('./routes/respiration');
const temperatureRoutes = require('./routes/temperature');
const referenceRoutes = require('./routes/refs');
const studiesRoutes = require('./routes/studies');

const morgan = require('morgan');

const app = express();

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});

app.use(express.json());
app.use(morgan('tiny'));
app.use(authenticateJWT);

app.use('/auth', authRoutes);
app.use('/commodities', commoditiesRoutes);
app.use('/users', usersRoutes);
app.use('/shelf-life', shelfLifeRoutes);
app.use('/ethylene', ethyleneRoutes);
app.use('/respiration', respirationRoutes);
app.use('/temperature', temperatureRoutes);
app.use('/ref', referenceRoutes);
app.use('/studies', studiesRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function(req, res, next) {
	return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function(err, req, res, next) {
	if (process.env.NODE_ENV !== 'test') console.error(err.stack);
	const status = err.status || 500;
	const message = err.message;

	return res.status(status).json({
		error : { message, status }
	});
});

module.exports = app;
