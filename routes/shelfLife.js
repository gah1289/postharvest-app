'use strict';

/** Routes for shelf life studies. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureAdmin } = require('../middleware/auth');
const { BadRequestError, NotFoundError } = require('../expressError');
const ShelfLife = require('../models/shelfLife');

const shelfLifeNewSchema = require('../schemas/shelfLifeNew.json');
const shelfLifeUpdateSchema = require('../schemas/shelfLifeUpdate.json');

const router = express.Router();

/** POST / { shelfLife }  => { shelfLife }
 *
 * Adds a new shelf life object. 
 *
 * This returns the newly created shelf life data 
 *  {shelfLife: {id, commodityId, shelfLife, packaging, description} }
 *
 *  Authorization required: admin
 * 
 **/

router.post('/', ensureAdmin, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, shelfLifeNewSchema);

		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const shelfLife = await ShelfLife.create(req.body.commodityId, req.body.data);

		return res.status(201).json({ shelfLife });
	} catch (err) {
		return next(err);
	}
});

/** GET /[shelfLifeId] => {shelfLife}
 * 
 * Pass in a study id in req.params
 *
 *  Returns  {
        shelfLife: {
          id: int,
          commodityId: str,
          shelfLife: str,
          packaging: str,
          description: str
        }
      }
 *

 **/

router.get('/:id', async function(req, res, next) {
	try {
		const id = req.params.id;
		const shelfLife = await ShelfLife.getById(id);
		return res.json({ shelfLife });
	} catch (e) {
		next(e);
	}
});

/** GET /[commodityId] => [...{ shelfLife }]
 *
 *  Returns{
        shelfLife: [
          {
            id: 929,
            commodityId: 'id',
            shelfLife: '1 day',
            packaging: 'test',
            description: 'test'
          }
        ]
      }
 *

 **/

router.get('/commodity/:id', async function(req, res, next) {
	try {
		const shelfLife = await ShelfLife.getByCommodity(req.params.id);
		if (shelfLife.length === 0) {
			// throw error if not studies are found. I want to use this to redirect to a 404 page.
			throw new NotFoundError(`No studies found for commodity${id}`);
		}
		return res.json({ shelfLife });
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
        shelfLife: {
          id: int,
          commodityId: str,
          shelfLife: str,
          packaging: str,
          description: str
        }
      }
      Authorization required: admin

 **/

router.patch('/:id', ensureAdmin, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, shelfLifeUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}
		const shelfLife = await ShelfLife.update(req.params.id, req.body);
		return res.json({ shelfLife });
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
		await ShelfLife.remove(req.params.id);
		return res.json({ deleted: req.params.id });
	} catch (err) {
		return next(err);
	}
});
module.exports = router;
