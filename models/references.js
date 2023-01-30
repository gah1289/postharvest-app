'use strict';

const db = require('../db');
const { NotFoundError } = require('../expressError');

class References {
	// Create reference information (from data), update db, return new reference data.
	// Data should be {commodityId, source}
	// Returns {commodityId, source}

	static async create(commodityId, data) {
		const result = await db.query(
			`INSERT INTO refs (commodity_id,
            source)
               VALUES ($1, $2)
               RETURNING commodity_id AS "commodityId", source`,
			[
				commodityId,
				data.source
			]
		);
		return result.rows[0];
	}

	// // 	/** Given a commodity id, return all reference data about commodity.
	// //    *
	// //    * Returns [...{ commodityId, source }]

	// //    * Throws NotFoundError if commodity not found.
	// //    **/

	static async getByCommodity(commodityId) {
		try {
			const referenceRes = await db.query(
				`SELECT  commodity_id AS "commodityId", source FROM refs  WHERE commodity_id = $1 `,
				[
					commodityId
				]
			);
			return referenceRes.rows;
		} catch (e) {
			return [];
		}
	}

	static async remove(commodityId) {
		const querySql = `DELETE
		FROM refs
		WHERE commodity_id = $1
		`;

		try {
			const result = await db.query(querySql, [
				commodityId
			]);

			if (result.rowCount === 0) {
				throw new NotFoundError(`Could not find commodity to delete: ${commodityId}`);
			}
			return `Removed reference data for commodity: ${commodityId}`;
		} catch (e) {
			throw new NotFoundError(`Could not find commodity to delete: ${commodityId}`);
		}
	}
}

module.exports = References;
