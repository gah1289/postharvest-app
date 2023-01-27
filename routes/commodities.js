'use strict';

/** Routes for commodities. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureAdmin } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const Commodity = require('../models/commodity');

const commodityNewSchema = require('../schemas/commodityNew.json');

const router = express.Router();

/** POST / { commodity }  => { commodity }
 *
 * Adds a new commodity. 
 *
 * This returns the newly created commodity 
 *  {commodity: {id, commodityName, variety, scientificName, coolingMethod, climacteric} }
 *
 * Authorization required: admin
 **/

router.post('/', ensureAdmin, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, commodityNewSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const commodity = await Commodity.create(req.body);

		return res.status(201).json({ commodity });
	} catch (err) {
		return next(err);
	}
});

/** GET / => { commodities: [ {commodityName, variety, scientificName, coolingMethod, climacteric }, ... ] }
 *
 * Returns list of all commodities.
 *
 * Authorization required: logged in
 **/

router.get('/', async function(req, res, next) {
	try {
		const commodities = await Commodity.findAll();
		return res.json({ commodities });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => { commodity }
 *
 * Returns { commodity: [ {commodityName, variety, scientificName, coolingMethod, climacteric }, ... ] }
 *   where ethyleneSensitivity is { commodityId, temperature, c2h4Production, c2h4Class }
 *
 * Authorization required: logged in
 **/

router.get('/:id', async function(req, res, next) {
	try {
		const user = await Commodity.get(req.params.id);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});
module.exports = router;
