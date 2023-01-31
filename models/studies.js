'use strict';

const db = require('../db');
const { NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');
const { ExpressError } = require('../expressError');

class WindhamStudies {
	// Create windham study (from data), update db, return new windham study data.
	// Data should be { title, date, source, objective}
	// Returns {id, title, date, source, objective}

	static async create(data) {
		if (!data.title) {
			throw new ExpressError('Study needs a title', 404);
		}
		try {
			const result = await db.query(
				`INSERT INTO windham_studies (title,
                date,
                source,
                objective)
                   VALUES ($1, $2, $3, $4)
                   RETURNING id, title, date, source, objective`,
				[
					data.title,
					data.date,
					data.source,
					data.objective
				]
			);
			return result.rows[0];
		} catch (e) {
			return e;
		}
	}

	/** Given an id, return study data.
   *
	  * Returns { id, title, date, objective }

	  * Throws NotFoundError if study not found.
	   **/

	static async getById(id) {
		const res = await db.query(`SELECT * FROM windham_studies  WHERE id = $1 `, [
			id
		]);

		return res.rows[0];
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

module.exports = WindhamStudies;
