'use strict';

/** Routes for Windham Packaging study data. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureAdmin } = require('../middleware/auth');
const { BadRequestError, NotFoundError } = require('../expressError');

const studyNewSchema = require('../schemas/studyNew.json');
const studyUpdateSchema = require('../schemas/studyUpdate.json');
const WindhamStudies = require('../models/studies');

const router = express.Router();

/** POST / { study }  => { study }
 *
 * Adds a new Windham Packaging study object. 
 *
 * This returns the newly created study data 
 *  {study: {id,  title, date, source, objective} }
 *
 *  Authorization required: admin
 * 
 **/

router.post('/', ensureAdmin, async function(req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, studyNewSchema);

		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const study = await WindhamStudies.create(req.body);
		return res.status(201).json({ study });
	} catch (err) {
		return next(err);
	}
});

/** GET /[studyId] => {study}
 * 
 * Pass in a study id in req.params
 *
 *  Returns  {
        study: {id, title, date, source, objective
      }
 *

 **/

router.get('/:id', async function(req, res, next) {
	try {
		const id = req.params.id;
		const study = await WindhamStudies.getById(id);
		console.log({ study });
		return res.json({ study });
	} catch (e) {
		next(e);
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
		const validator = jsonschema.validate(req.body, studyUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}
		const study = await WindhamStudies.update(req.params.id, req.body);
		return res.json({ study });
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
		await WindhamStudies.remove(req.params.id);
		return res.json({ deleted: req.params.id });
	} catch (err) {
		return next(err);
	}
});
module.exports = router;
