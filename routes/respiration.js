'use strict';

/** Routes for shelf life studies. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureAdmin } = require('../middleware/auth');
const { BadRequestError, NotFoundError } = require('../expressError');

const respirationNewSchema = require('../schemas/respirationNew.json');
const respirationUpdateSchema = require('../schemas/respirationUpdate.json');
const Respiration = require('../models/respiration');

const router = express.Router();

/** POST / { respiration }  => { respiration }
 *
 * Adds a new respiration rate object. 
 *
 * This returns the newly created respiration rate data 
 *  {respiration: {id, commodityId, temperature, rrRate, rrClass} }
 *
 *  Authorization required: admin
 * 
 **/

router.post('/', ensureAdmin, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, respirationNewSchema);

		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const respiration = await Respiration.create(req.body.commodityId, req.body.data);

		return res.status(201).json({ respiration });
	} catch (err) {
		return next(err);
	}
});

/** GET /[respirationId] => {respiration}
 * 
 * Pass in a respiration id in req.params
 *
 *  Returns  {
       respiration: {id, commodityId, temperature, rrRate, rrClass}
      }
 *

 **/

router.get('/:id', async function(req, res, next) {
	try {
		const id = req.params.id;
		const respiration = await Respiration.getById(id);
		return res.json({ respiration });
	} catch (e) {
		next(e);
	}
});

/** GET /[commodityId] => [...{ respiration }]
 *
 *  Returns{
        respiration: [
          {
           id: int,
          commodityId: str,
          temperature: str,
          rrRate: str,
          rrClass: str
          }
        ]
      }
 *

 **/

router.get('/commodity/:id', async function(req, res, next) {
	try {
		const respiration = await Respiration.getByCommodity(req.params.id);
		if (respiration.length === 0) {
			// throw error if not studies are found. I want to use this to redirect to a 404 page.
			throw new NotFoundError(`No respiration rate data found for commodity${id}`);
		}
		return res.json({ respiration });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /[id] { shelfLife } => { shelfLife }
 *
 * Data can include:
 *   { temperature, rrRate, rrClass }
 *
 * Returns  {
       
         respiration: 
          {
           id: int,
          commodityId: str,
          temperature: str,
          rrRate: str,
          rrClass: str
          }
        
        
      }
      Authorization required: admin

 **/

router.patch('/:id', ensureAdmin, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, respirationUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}
		const respiration = await Respiration.update(req.params.id, req.body);
		return res.json({ respiration });
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
		await Respiration.remove(req.params.id);
		return res.json({ deleted: req.params.id });
	} catch (err) {
		return next(err);
	}
});
module.exports = router;
