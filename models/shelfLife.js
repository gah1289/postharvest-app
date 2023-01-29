'use strict';

const db = require('../db');
const { NotFoundError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');

class ShelfLife {
	// Create shelf life information (from data), update db, return new rshelf life data.
	// Data should be {commodityId, temperature, shelfLife, description, packaging}
	// Returns {id, commodityId, temperature, shelfLife, description, packaging}

	// Temperature is in celsius

	static async create(commodityId, data) {
		try {
			const result = await db.query(
				`INSERT INTO shelf_life (commodity_id,
                temperature_celsius,
                shelf_life,
                packaging, description)
                   VALUES ($1, $2, $3, $4, $5)
                   RETURNING id, commodity_id AS "commodityId", shelf_life AS "shelfLife", packaging, description`,
				[
					commodityId,
					data.temperature,
					data.shelfLife,
					data.packaging,
					data.description
				]
			);
			let shelfLifeRes = result.rows[0];
			return shelfLifeRes;
		} catch (e) {
			throw new NotFoundError(`Commodity id:${commodityId} not found`);
		}
	}

	/** Given an id, return shelf life data.
   *
	  * Returns {id, commodityId, temperature, shelfLife, description, packaging}

	  * Throws NotFoundError if id not found.
	   **/

	static async getById(id) {
		const shelfLifeRes = await db.query(
			`SELECT id, commodity_id AS "commodityId", shelf_life AS "shelfLife", packaging, description FROM shelf_life  WHERE id = $1 `,
			[
				id
			]
		);

		return shelfLifeRes.rows[0];
	}

	/** Given a commodity id, return all shelf life data about commodity.
	   *
	   * Returns [...{ id, commodityId, temperature, shelfLife, description, packaging }]

	   * Throws NotFoundError if commodity not found.
	   **/

	static async getByCommodity(commodityId) {
		try {
			const res = await db.query(
				`SELECT id, commodity_id AS "commodityId", shelf_life AS "shelfLife", packaging, description FROM shelf_life   WHERE commodity_id = $1  `,
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
			shelfLife   : 'shelf_life',
			temperature : 'temperature_celsius'
		});

		const querySql = `UPDATE shelf_life
	                  SET ${setCols}
	                  WHERE id = '${id}'
	                  RETURNING id, commodity_id AS "commodityId", shelf_life AS "shelfLife", packaging, description`;

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
		FROM shelf_life
		WHERE id = $1
		RETURNING id AS "id"`;

		try {
			await db.query(querySql, [
				id
			]);

			return `Removed shelf life data`;
		} catch (e) {
			throw new NotFoundError(`Could not find id to delete: ${id}`);
		}
	}
}

module.exports = ShelfLife;
