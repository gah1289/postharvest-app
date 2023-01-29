'use strict';

const db = require('../db');
const { NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');

class Respiration {
	// Create respiration rate information (from data), update db, return new respiration rate data.
	// Data should be {commodityId, temperature, rrRate, rrClass}
	// Returns {id, commodityId, temperature, rrRate, rrClass}
	// Respiration rate is in units mm*kg*hr
	// Temperature is in celsius

	static async create(commodityId, data) {
		try {
			const result = await db.query(
				`INSERT INTO respiration_rates (commodity_id,
                temperature_celsius,
                rr_mg_kg_hr,
                rr_class)
                   VALUES ($1, $2, $3, $4)
                   RETURNING id, commodity_id AS "commodityId", temperature_celsius AS "temperature", rr_mg_kg_hr AS "rrRate", rr_class AS "rrClass"`,
				[
					commodityId,
					data.temperature,
					data.rrRate,
					data.rrClass
				]
			);
			let respirationRes = result.rows[0];
			return respirationRes;
		} catch (e) {
			throw new NotFoundError(`Commodity id:${commodityId} not found`);
		}
	}

	/** Given an id, return respiration rate data.
   *
	  * Returns {id, commodityId, temperature, rrRate, rrClass}

	  * Throws NotFoundError if id not found.
	   **/

	static async getById(id) {
		const respirationRes = await db.query(
			`SELECT id, commodity_id AS "commodityId", temperature_celsius AS "temperature", rr_mg_kg_hr AS "rrRate", rr_class AS "rrClass" FROM respiration_rates  WHERE id = $1 `,
			[
				id
			]
		);

		const respirationRate = respirationRes.rows[0];

		return respirationRate;
	}

	/** Given a commodity id, return all respiration rate data about commodity.
	   *
	   * Returns [...{ id, commodityId, temperature, rrRate, rrClass }]

	   * Throws NotFoundError if commodity not found.
	   **/

	static async getByCommodity(commodityId) {
		try {
			const respirationRes = await db.query(
				`SELECT id, commodity_id AS "commodityId", temperature_celsius AS "temperature", rr_mg_kg_hr AS "rrRate", rr_class AS "rrClass" FROM respiration_rates  WHERE commodity_id = $1  `,
				[
					commodityId
				]
			);

			const respirationRate = respirationRes.rows;

			return respirationRate;
		} catch (e) {
			throw new NotFoundError(`Commodity id:${commodityId} not found`);
		}
	}

	// // Given an id, return new respiration rate data.
	// Data should be {commodityId, temperature, rrRate, rrClass}
	// Returns {id, commodityId, temperature, rrRate, rrClass}
	// Respiration rate is in units mm*kg*hr
	// Temperature is in celsius

	static async update(id, data) {
		const { setCols, values } = sqlForPartialUpdate(data, {
			commodityId : 'commodity_id',
			rrRate      : 'rr_mg_kg_hr',
			rrClass     : 'rr_class',
			temperature : 'temperature_celsius'
		});

		const querySql = `UPDATE respiration_rates
	                  SET ${setCols}
	                  WHERE id = '${id}'
	                  RETURNING id, commodity_id AS "commodityId", temperature_celsius AS "temperature", rr_mg_kg_hr AS "rrRate", rr_class AS "rrClass"`;

		try {
			const result = await db.query(querySql, [
				...values
			]);
			const respirationRate = result.rows[0];

			return { respirationRate };
		} catch (e) {
			throw new NotFoundError(`No id found: ${id}`);
		}
	}

	// // Given an id, remove respirationRate data.
	// // Returns "deleted" message

	static async remove(id) {
		const querySql = `DELETE
		FROM respiration_rates
		WHERE id = $1
		RETURNING id AS "id"`;

		try {
			await db.query(querySql, [
				id
			]);

			return `Removed respiration rate data`;
		} catch (e) {
			throw new NotFoundError(`Could not find id to delete: ${id}`);
		}
	}
}

module.exports = Respiration;
