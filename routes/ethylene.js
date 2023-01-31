'use strict';

/** Routes for shelf life studies. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureAdmin } = require('../middleware/auth');
const { BadRequestError, NotFoundError } = require('../expressError');
const Ethylene = require('../models/ethylene');

const ethyleneNewSchema = require('../schemas/shelfLifeNew.json');
const ethyleneUpdateSchema = require('../schemas/shelfLifeUpdate.json');

const router = express.Router();

/** POST / { ethylene }  => { ethylene }
 *
 * Adds a new ethylene sensitivity object. 
 *
 * This returns the newly created shelf life data 
 *  {ethylene: {id, commodityId, temperature, c2h4Production, c2h4Class} }
 *
 *  Authorization required: admin
 * 
 **/

router.post('/', ensureAdmin, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, ethyleneNewSchema);

		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const ethylene = await Ethylene.create(req.body.commodityId, req.body.data);

		return res.status(201).json({ ethylene });
	} catch (err) {
		return next(err);
	}
});

/** GET /[ethyleneId] => {ethylene}
 * 
 * Pass in a study id in req.params
 *
 *  Returns  {
        ethylene: {
          id: int,
          commodityId: str,
          temperature: str,
          c2h4Production: str,
          c2h4Class: str
        }
      }
 *

 **/

router.get('/:id', async function(req, res, next) {
	try {
		const id = req.params.id;
		const ethylene = await Ethylene.getById(id);
		return res.json({ ethylene });
	} catch (e) {
		next(e);
	}
});

/** GET /[commodityId] => [...{ ethylene }]
 *
 *  Returns{
        ethylene: [
          {
           id: int,
          commodityId: str,
          temperature: str,
          c2h4Production: str,
          c2h4Class: str
          }
        ]
      }
 *

 **/

router.get('/commodity/:id', async function(req, res, next) {
	try {
		const ethylene = await Ethylene.getByCommodity(req.params.id);
		if (ethylene.length === 0) {
			// throw error if not studies are found. I want to use this to redirect to a 404 page.
			throw new NotFoundError(`No ethylene data found for commodity${id}`);
		}
		return res.json({ ethylene });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /[id] { shelfLife } => { shelfLife }
 *
 * Data can include:
 *   { shelfLife, temperature, packaging, description }
 *
 * Returns  {
       
        ethylene: 
          {
        	id: int,
          commodityId: str,
          temperature: str,
          c2h4Production: str,
          c2h4Class: str
          }
        
      }
      Authorization required: admin

 **/

router.patch('/:id', ensureAdmin, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, ethyleneUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}
		const ethylene = await Ethylene.update(req.params.id, req.body);
		return res.json({ ethylene });
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
		await Ethylene.remove(req.params.id);
		return res.json({ deleted: req.params.id });
	} catch (err) {
		return next(err);
	}
});
module.exports = router;
