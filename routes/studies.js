'use strict';

/** Routes for Windham Packaging study data. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureAdmin } = require('../middleware/auth');
const { BadRequestError, NotFoundError } = require('../expressError');

const studyNewSchema = require('../schemas/studyNew.json');
const studyUpdateSchema = require('../schemas/studyUpdate.json');
const WindhamStudies = require('../models/studies');
const WindhamStudiesCommodities = require('../models/studiesCommodities');
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

/********************************* Studies + Commodities */
// Link a windham study to one or multiple commodities from commodities table

// POST /:commodityId {data: studyId, commodityId}=> { studyCommodity: { commodityId, studyId } }

router.post('/:commodityId', ensureAdmin, async function(req, res, next) {
	try {
		const data = { studyId: req.body.studyId, commodityId: req.params.commodityId };
		const studyCommodity = await WindhamStudiesCommodities.create(data);
		return res.status(201).json({ studyCommodity });
	} catch (err) {
		return next(err);
	}
});

// GET /studies/commodity/:id => { studyCommodity: { commodityId, studyId } }

// list all Windham studies associated with a commodity

router.get('/commodity/:id', ensureAdmin, async function(req, res, next) {
	try {
		const commodityId = req.params.id;

		const studies = await WindhamStudiesCommodities.getByCommodityId(commodityId);
		return res.status(200).json({ studies });
	} catch (err) {
		return next(err);
	}
});

// GET /studies/study/:id => { studyCommodity: { commodityId, studyId } }

// list all Windham studies associated with a commodity

router.get('/study/:id', ensureAdmin, async function(req, res, next) {
	try {
		const studyId = req.params.id;

		const commodities = await WindhamStudiesCommodities.getByStudyId(studyId);
		return res.status(200).json({ commodities });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
