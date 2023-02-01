'use strict';

/** Routes for temperature recommendation data. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureAdmin } = require('../middleware/auth');
const { BadRequestError, NotFoundError } = require('../expressError');

const temperatureNewSchema = require('../schemas/temperatureNew.json');
const temperatureUpdateSchema = require('../schemas/temperatureUpdate.json');
const Temperature = require('../models/temperature');

const router = express.Router();

/** POST / { temperature }  => { temperature }
 *
 * Adds a new temperature recommendation object. 
 *
 * This returns the newly created temperature recommendation data 
 *  {temperature: {id, commodityId, minTemp, optimumTemp, description, rh} }
 *
 *  Authorization required: admin
 * 
 **/

router.post('/', ensureAdmin, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, temperatureNewSchema);

		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const temperature = await Temperature.create(req.body.commodityId, req.body.data);

		return res.status(201).json({ temperature });
	} catch (err) {
		return next(err);
	}
});

/** GET /[temperatureId] => {temperature}
 * 
 * Pass in a temperature id in req.params
 *
 *  Returns  {
        temperature: {id, commodityId, minTemp, optimumTemp, description, rh
      }
 *

 **/

router.get('/:id', async function(req, res, next) {
	try {
		const id = req.params.id;
		const temperature = await Temperature.getById(id);
		return res.json({ temperature });
	} catch (e) {
		next(e);
	}
});

/** GET /[commodityId] => [...{ temperature }]
 *
 *  Returns{
        temperature: [
          {
           id, commodityId, minTemp, optimumTemp, description, rh
          }
        ]
      }
 *

 **/

router.get('/commodity/:id', async function(req, res, next) {
	try {
		const temperature = await Temperature.getByCommodity(req.params.id);
		if (temperature.length === 0) {
			// throw error if not studies are found. I want to use this to redirect to a 404 page.
			throw new NotFoundError(`No temperature recommendation data found for commodity${id}`);
		}
		return res.json({ temperature });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /[id] { temperature } => { temperature }
 *
 * Data can include:
 *   { minTemp, optimumTemp, description, rh }
 *
 * Returns  {
       
         temperature: 
           {
           id, commodityId, minTemp, optimumTemp, description, rh
          }
        
        
      }
      Authorization required: admin

 **/

router.patch('/:id', ensureAdmin, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, temperatureUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}
		const temperature = await Temperature.update(req.params.id, req.body);
		return res.json({ temperature });
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
		await Temperature.remove(req.params.id);
		return res.json({ deleted: req.params.id });
	} catch (err) {
		return next(err);
	}
});
module.exports = router;
