'use strict';

/** Routes for authentication. */

const jsonschema = require('jsonschema');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const express = require('express');
const router = new express.Router();
const { createToken } = require('../helpers/tokens');
const userAuthSchema = require('../schemas/userAuth.json');
const { SECRET_KEY } = require('../config');
const userNewSchema = require('../schemas/userNew.json');
const { BadRequestError } = require('../expressError');
const { authenticateJWT } = require('../middleware/auth');

/** POST /auth/token:  { username, password } => { token }
 *Occurs when user tries to log in
 * 
 * If successful, returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post('/token', async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, userAuthSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const { username, password } = req.body;

		const user = await User.authenticate(username, password);
		const token = createToken(user);
		return res.json({ token });
	} catch (err) {
		return next(err);
	}
});

/** GET /auth/login:  { username, password } => { token }
 *Occurs when user tries to log in
 * 
 * If successful, returns Jsuccessful log in message with user data.
 *
 * Authorization required: none
 */
router.get('/login', (req, res) => {
	const token = req.query.token || req.body.token;

	//verify the JWT token generated for the user
	jwt.verify(token, SECRET_KEY, (err, authorizedData) => {
		if (err) {
			//If error send Forbidden (403)
			console.log('ERROR: Could not connect to the protected route');
			res.sendStatus(401);
		}
		else {
			//If token is successfully verified, we can send the autorized data
			res.json({
				message        : 'Successful log in',
				authorizedData
			});
			console.log('SUCCESS: Connected to protected route');
		}
	});
});

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post('/register', async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, userNewSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const newUser = await User.register({ ...req.body, isAdmin: false });
		const token = createToken(newUser);
		return res.status(201).json({ token });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
