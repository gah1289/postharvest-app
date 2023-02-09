'use strict';

/** Routes for commodities. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureAdmin } = require('../middleware/auth');
const { BadRequestError, NotFoundError } = require('../expressError');
const Commodity = require('../models/commodity');

const commodityNewSchema = require('../schemas/commodityNew.json');
const commodityUpdateSchema = require('../schemas/commodityUpdate.json');

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
		const searchFilters = req.query;

		const commodities = await Commodity.findAll({ ...searchFilters });
		return res.json({ commodities });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => { commodity }
 *
 * Returns { commodity: [ {commodityName, variety, scientificName, coolingMethod, climacteric }, ... ] }
 *   
 *
 * Authorization required: none
 **/

router.get('/:id', async function(req, res, next) {
	try {
		const commodity = await Commodity.get(req.params.id);
		return res.json({ commodity });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /[id] { commodity } => { commodity }
 *
 * Data can include:
 *   { commodityName, variety, scientificName, coolingMethod, climacteric }
 *
 * Returns { id, commodityName, variety, scientificName, coolingMethod, climacteric }
 *
 * Authorization required: admin 
 **/

router.patch('/:id', ensureAdmin, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, commodityUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}
		const commodity = await Commodity.update(req.params.id, req.body);
		if (!commodity) throw new NotFoundError();
		return res.json({ commodity });
	} catch (err) {
		next(err);
	}
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin 
 **/

router.delete('/:id', ensureAdmin, async function(req, res, next) {
	try {
		await Commodity.remove(req.params.id);
		return res.json({ deleted: req.params.id });
	} catch (err) {
		return next(err);
	}
});
module.exports = router;
