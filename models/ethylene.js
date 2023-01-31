'use strict';

const db = require('../db');
const { NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');

class Ethylene {
	// Create ethylene sensitivity information (from data), update db, return new ethylene sensitivity data.
	// Data should be {commodityId, temperature, c2h4Production, c2h4Class}
	// Returns {commodityId, temperature, c2h4Production, c2h4Class}

	static async create(commodityId, data) {
		try {
			const result = await db.query(
				`INSERT INTO ethylene_sensitivity (commodity_id,
            temperature,
            c2h4_production,
            c2h4_class)
               VALUES ($1, $2, $3, $4)
               RETURNING id, commodity_id AS "commodityId",  c2h4_production AS "c2h4Production", c2h4_class AS "c2h4Class", temperature`,
				[
					commodityId,
					data.temperature,
					data.c2h4Production,
					data.c2h4Class
				]
			);
			let ethyleneSensitivity = result.rows[0];

			return ethyleneSensitivity;
		} catch (e) {
			throw new NotFoundError(`Commodity id:${commodityId} not found`);
		}
	}

	/** Given an id, return ethylene sensitivty data.
   *
	  * Returns { commodityId, temperature, c2h4Production, c2h4Class, id }

	  * Throws NotFoundError if commodity not found.
	   **/

	static async getById(id) {
		const ethyleneRes = await db.query(
			`SELECT id, commodity_id AS "commodityId",  c2h4_production AS "c2h4Production", c2h4_class AS "c2h4Class", temperature FROM ethylene_sensitivity  WHERE id = $1 `,
			[
				id
			]
		);

		if (ethyleneRes.rows.length === 0) {
			throw new NotFoundError(`Could not find ethylene data with id: ${id}`);
		}

		const ethyleneSensitivity = ethyleneRes.rows[0];

		return ethyleneSensitivity;
	}

	// // 	/** Given a commodity id, return all ethylene sensitivty data about commodity.
	// //    *
	// //    * Returns [...{ commodityId, temperature, c2h4Production, c2h4Class, id }]

	// //    * Throws NotFoundError if commodity not found.
	// //    **/

	static async getByCommodity(commodityId) {
		try {
			const ethyleneRes = await db.query(
				`SELECT id, commodity_id AS "commodityId",  c2h4_production AS "c2h4Production", c2h4_class AS "c2h4Class", temperature FROM ethylene_sensitivity  WHERE commodity_id = $1 `,
				[
					commodityId
				]
			);

			const ethyleneSensitivity = ethyleneRes.rows;

			return ethyleneSensitivity;
		} catch (e) {
			return [];
		}
	}

	// Given an id, update ethylene sensitivity data.
	// Returns { commodityId, temperature, c2h4Production, c2h4Class, id }

	static async update(id, data) {
		const { setCols, values } = sqlForPartialUpdate(data, {
			commodityId    : 'commodity_id',
			c2h4Production : 'c2h4_production',
			c2h4Class      : 'c2h4_class',
			temperature    : 'temperature'
		});

		const querySql = `UPDATE ethylene_sensitivity
	                  SET ${setCols}
	                  WHERE id = '${id}'
	                  RETURNING id, commodity_id  AS "commodityId", temperature, c2h4_class AS "c2h4Class", c2h4_production AS "c2h4Production"`;

		try {
			const result = await db.query(querySql, [
				...values
			]);

			return result.rows[0];
		} catch (e) {
			throw new NotFoundError(`No id found: ${id}`);
		}
	}

	// Given an id, remove ethyleneSensitivity data.
	// Returns "deleted" message

	static async remove(id) {
		const querySql = `DELETE
		FROM ethylene_sensitivity
		WHERE id = $1
		RETURNING id AS "id"`;

		try {
			const result = await db.query(querySql, [
				id
			]);

			if (result.rowCount === 0) {
				throw new NotFoundError(`Could not find id to delete: ${id}`);
			}
			return `Removed ethylene sensitivity data for commodity`;
		} catch (e) {
			throw new NotFoundError(`Could not find id to delete: ${id}`);
		}
	}
}

module.exports = Ethylene;
