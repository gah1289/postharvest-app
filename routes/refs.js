'use strict';

/** Routes for references. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureAdmin } = require('../middleware/auth');
const { BadRequestError, NotFoundError } = require('../expressError');

const referenceNewSchema = require('../schemas/referenceNew.json');

const References = require('../models/references');

const router = express.Router();

/** POST / { reference }  => { reference }
 *
 * Adds a new reference object. 
 *
 * This returns the newly created reference data 
 *  {reference: { commodityId, source} }
 *
 *  Authorization required: admin
 * 
 **/

router.post('/', ensureAdmin, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, referenceNewSchema);

		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}
		const reference = await References.create(req.body.commodityId, req.body.data);

		return res.status(201).json({ reference });
	} catch (err) {
		return next(err);
	}
});

/** GET /[commodityId] => [...{ reference }]
 *
 *  Returns{
        reference: [
          {
           commodityId,source
          }
        ]
      }
 *

 **/

router.get('/commodity/:id', async function(req, res, next) {
	try {
		const reference = await References.getByCommodity(req.params.id);
		if (reference.length === 0) {
			// throw error if not studies are found. I want to use this to redirect to a 404 page.
			throw new NotFoundError(`No reference data found for commodity${id}`);
		}
		return res.json({ reference });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin 
 **/

router.delete('/:id', ensureAdmin, async function(req, res, next) {
	try {
		await References.remove(req.params.id);
		return res.json({ deleted: req.params.id });
	} catch (err) {
		return next(err);
	}
});
module.exports = router;
