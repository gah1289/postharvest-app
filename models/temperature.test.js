'use strict';

const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const db = require('../db.js');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testModelsCommon');
const Temperature = require('./temperature');
const Commodity = require('./commodity');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('create', function() {
	test('works', async function() {
		const commodity = await Commodity.create({
			commodityName  : 'Commodity',
			variety        : 'Test',
			scientificName : 'Test2',
			coolingMethod  : 'Test2',
			climacteric    : true
		});
		await Temperature.create(commodity.id, {
			minTemp     : '10',
			optimumTemp : '12',
			description : 'test',
			rh          : '95'
		});
		const found = await db.query(
			`SELECT * FROM temperature_recommendations WHERE commodity_id = '${commodity.id}' `
		);
		expect(found.rows.length).toEqual(1);
	});
	test('throw error with bad id', async function() {
		try {
			await Temperature.create('commodity.id', {
				minTemp     : '10',
				optimumTemp : '12',
				description : 'test',
				rh          : '95'
			});
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
		}
	});
});

/************************************** get shelf life info by commodity */

describe('getByCommodity', function() {
	test('works', async function() {
		const res = await Temperature.getByCommodity('id');
		expect(res.length).toEqual(1);
		expect(res[0].commodityId).toEqual('id');
		expect(res[0].minTemp).toEqual('5');
	});
	test('throws error if commodity id doesnt exist', async function() {
		try {
			await Temperature.get('nope');
		} catch (e) {
			expect(e).toBeTruthy();
		}
	});
});

// /************************************** get shelf life info by id */

describe('getById', function() {
	test('works', async function() {
		const data = await Temperature.create('id', {
			minTemp     : '10',
			optimumTemp : '12',
			description : 'test',
			rh          : '95'
		});

		const res = await Temperature.getById(data.id);
		expect(res.commodityId).toEqual('id');
		expect(res.minTemp).toEqual('10');
	});
	test('throws error if commodity id doesnt exist', async function() {
		try {
			await Temperature.getById('nope');
		} catch (e) {
			expect(e).toBeTruthy();
		}
	});
});

// /************************************** update temperature recommendation info */

describe('update', function() {
	test('works', async function() {
		const res = await Temperature.getByCommodity('id');

		const updateRes = await Temperature.update(res[0].id, {
			minTemp : '20'
		});

		expect(updateRes.commodityId).toEqual('id');
		expect(updateRes.minTemp).toEqual('20');
	});
	test('throws not found error if commodity not found', async function() {
		try {
			await Temperature.update('nope', {
				minTemp : '20'
			});
		} catch (e) {
			expect(e.status).toBe(404);
			expect(e instanceof NotFoundError).toBeTruthy();
		}
	});
});

// /************************************** remove temperature recommendation info */

describe('remove', function() {
	test('works', async function() {
		const res = await Temperature.getByCommodity('id');
		const tempRes = await Temperature.remove(res[0].id);

		expect(tempRes).toEqual('Removed temperature recommendations data');
	});
	test('throws not found error if commodity not found', async function() {
		try {
			await Temperature.remove('nope');
		} catch (e) {
			expect(e.status).toBe(404);
			expect(e instanceof NotFoundError).toBeTruthy();
		}
	});
});
