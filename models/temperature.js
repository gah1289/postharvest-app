'use strict';

const db = require('../db');
const { NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');

class Temperature {
	// Create temperature recommendation information (from data), update db, return new temperature recommendation data.
	// Data should be {commodityId, minTemp, optimumTemp, description, rh}
	// Returns {id, commodityId, minTemp, optimumTemp, description, rh}

	// Temperature is in celsius
	// RH is relative humidity (%)

	static async create(commodityId, data) {
		try {
			const result = await db.query(
				`INSERT INTO temperature_recommendations (commodity_id,
                min_temp_celsius,
                optimum_temp_celsius,
                description, rh)
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING id, commodity_id AS "commodityId", min_temp_celsius AS "minTemp", optimum_temp_celsius AS "optimumTemp", description, rh`,
				[
					commodityId,
					data.minTemp,
					data.optimumTemp,
					data.description,
					data.rh
				]
			);

			return result.rows[0];
		} catch (e) {
			throw new NotFoundError(`Commodity id:${commodityId} not found`);
		}
	}

	/** Given an id, return temperature recommendation data.
   *
	  * Returns {id, commodityId, minTemp, optimumTemp, description, rh}

	  * Throws NotFoundError if id not found.
	   **/

	static async getById(id) {
		const res = await db.query(
			`SELECT id, commodity_id AS "commodityId", min_temp_celsius AS "minTemp", optimum_temp_celsius AS "optimumTemp", description, rh FROM temperature_recommendations WHERE id = $1 `,
			[
				id
			]
		);

		if (res.rows.length === 0) {
			throw new NotFoundError(`Could not find temperature recommendation data with id: ${id}`);
		}

		return res.rows[0];
	}

	/** Given a commodity id, return all shelf life data about commodity.
	   *
	   * Returns [...{ id, commodityId, temperature, shelfLife, description, packaging }]

	   * Throws NotFoundError if commodity not found.
	   **/

	static async getByCommodity(commodityId) {
		try {
			const res = await db.query(
				`SELECT id, commodity_id AS "commodityId", min_temp_celsius AS "minTemp", optimum_temp_celsius AS "optimumTemp", description, rh FROM temperature_recommendations   WHERE commodity_id = $1 ORDER BY min_temp_celsius `,
				[
					commodityId
				]
			);

			return res.rows;
		} catch (e) {
			throw new NotFoundError(`Commodity id:${commodityId} not found`);
		}
	}

	// // Given an id, return new shelf life data.
	// Data should be { commodityId, temperature, shelfLife, description, packaging}
	// Returns {id, commodityId, temperature, shelfLife, description, packaging}

	// Temperature is in celsius

	static async update(id, data) {
		const { setCols, values } = sqlForPartialUpdate(data, {
			commodityId : 'commodity_id',
			minTemp     : 'min_temp_celsius',
			optimumTemp : 'optimum_temp_celsius'
		});

		const querySql = `UPDATE temperature_recommendations
	                  SET ${setCols}
	                  WHERE id = '${id}'
                      RETURNING id, commodity_id AS "commodityId", min_temp_celsius AS "minTemp", optimum_temp_celsius AS "optimumTemp", description, rh`;

		try {
			const result = await db.query(querySql, [
				...values
			]);
			return result.rows[0];
		} catch (e) {
			throw new NotFoundError(`No id found: ${id}`);
		}
	}

	// // Given an id, remove shelf life data.
	// // Returns "deleted" message

	static async remove(id) {
		const querySql = `DELETE
		FROM temperature_recommendations
		WHERE id = $1
		RETURNING id AS "id"`;

		try {
			await db.query(querySql, [
				id
			]);

			return `Removed temperature recommendations data`;
		} catch (e) {
			throw new NotFoundError(`Could not find id to delete: ${id}`);
		}
	}
}

module.exports = Temperature;
