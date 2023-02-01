'use strict';

const db = require('../db');
const { NotFoundError, BadRequestError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');
const { ExpressError } = require('../expressError');

class WindhamStudiesCommodities {
	// Create windham study relationship with commodity(from data), update db, return new windham study data.
	// Data should be { commodityId, studyId}
	// Returns {commodityId, studyId}

	static async create(data) {
		console.log({ data });
		const { studyId, commodityId } = data;

		if (!studyId) {
			throw new ExpressError('Please pick a study', 404);
		}
		if (!commodityId) {
			throw new ExpressError('Please pick a commodity', 404);
		}

		try {
			const result = await db.query(
				`INSERT INTO windham_studies_commodities (commodity_id,
                study_id)
                   VALUES ($1, $2)
                   RETURNING commodity_id AS "commodityId", study_id AS "studyId"`,
				[
					commodityId,
					studyId
				]
			);

			return result.rows[0];
		} catch (e) {
			return e;
		}
	}

	/** Given a study id, return all commodities associated with that study.
   *
	  * Returns { studyId:[...commodities] }

	  * Throws NotFoundError if study not found.
	   **/

	static async getByStudyId(studyId) {
		try {
			const res = await db.query(
				`SELECT commodity_id AS "commodityId" FROM windham_studies_commodities WHERE study_id = $1`,
				[
					studyId
				]
			);

			return res.rows;
		} catch (e) {
			throw new BadRequestError(`Study id not found:${studyId}`);
		}
	}

	/** Given a commodity id, return all studies associated with that study.
   *
	  * Returns { commodityId:[...studyIds] }

	  * Throws NotFoundError if study not found.
	   **/

	static async getByCommodityId(commodityId) {
		try {
			const res = await db.query(
				`SELECT study_id AS "studyId" FROM windham_studies_commodities WHERE commodity_id = $1`,
				[
					commodityId
				]
			);

			return res.rows;
		} catch (e) {
			throw new BadRequestError(`Commodity id not found:${studyId}`);
		}
	}

	// Given an id, update windham study (from data), update db, return new windham study data.
	// Data should be { title, date, source, objective}
	// Returns {id, title, date, source, objective}

	static async update(id, data) {
		const { setCols, values } = sqlForPartialUpdate(data, {});

		const querySql = `UPDATE windham_studies
	                  SET ${setCols}
	                  WHERE id = '${id}'
                      RETURNING id, title, date, source, objective`;

		try {
			const result = await db.query(querySql, [
				...values
			]);

			return result.rows[0];
		} catch (e) {
			throw new NotFoundError(`No id found: ${id}`);
		}
	}

	// Given an id, remove windham study data.
	// Returns "deleted" message

	static async remove(id) {
		const querySql = `DELETE
		FROM windham_studies
		WHERE id = $1
		`;

		try {
			const result = await db.query(querySql, [
				id
			]);

			if (result.rowCount === 0) {
				throw new NotFoundError(`Could not find id to delete: ${id}`);
			}
			return `Removed Windham Packaging study: ${id}`;
		} catch (e) {
			throw new NotFoundError(`Could not find id to delete: ${id}`);
		}
	}
}

module.exports = WindhamStudiesCommodities;
