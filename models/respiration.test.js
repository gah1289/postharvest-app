'use strict';

const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const db = require('../db.js');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testModelsCommon');
const Respiration = require('./respiration');
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
		await Respiration.create(commodity.id, {
			temperature : '10',
			rrRate      : '10-20',
			rrClass     : 'mod'
		});
		const found = await db.query(`SELECT * FROM respiration_rates WHERE commodity_id = '${commodity.id}' `);
		expect(found.rows.length).toEqual(1);
	});
	test('throw error with bad id', async function() {
		try {
			await Respiration.create('commodity.id', {
				temperature : '10',
				rrRate      : '10-20',
				rrClass     : 'mod'
			});
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
		}
	});
});

/************************************** get respiration rate info by commodity */

describe('getByCommodity', function() {
	test('works', async function() {
		const res = await Respiration.getByCommodity('id');
		expect(res.length).toEqual(1);
		expect(res[0].commodityId).toEqual('id');
		expect(res[0].rrClass).toEqual('high');
	});
	test('throws error if commodity id doesnt exist', async function() {
		try {
			await Respiration.get('nope');
		} catch (e) {
			expect(e).toBeTruthy();
		}
	});
});

/************************************** get respiration rate info by id */

describe('getById', function() {
	test('works', async function() {
		const newRespirationData = await Respiration.create('id', {
			temperature : '10',
			rrRate      : '10-20',
			rrClass     : 'mod'
		});

		const res = await Respiration.getById(newRespirationData.id);
		expect(res.commodityId).toEqual('id');
		expect(res.rrClass).toEqual('mod');
	});
	test('throws error if commodity id doesnt exist', async function() {
		try {
			await Respiration.get('nope');
		} catch (e) {
			expect(e).toBeTruthy();
		}
	});
});

/************************************** update respiration rate info */

describe('update', function() {
	test('works', async function() {
		const respirationRes = await Respiration.getByCommodity('id');

		const res = await Respiration.update(respirationRes[0].id, {
			rrRate : 'low'
		});

		const { respirationRate } = res;

		expect(respirationRate.commodityId).toEqual('id');
		expect(respirationRate.rrRate).toEqual('low');
	});
	test('throws not found error if commodity not found', async function() {
		try {
			await Respiration.update('nope', {
				rrRate : 'low'
			});
		} catch (e) {
			expect(e.status).toBe(404);
			expect(e instanceof NotFoundError).toBeTruthy();
		}
	});
});

/************************************** remove ethylene sensitivity info */

describe('remove', function() {
	test('works', async function() {
		const respirationRes = await Respiration.getByCommodity('id');
		const res = await Respiration.remove(respirationRes[0].id);

		expect(res).toEqual('Removed respiration rate data');
	});
	test('throws not found error if commodity not found', async function() {
		try {
			await Respiration.remove('nope');
		} catch (e) {
			expect(e.status).toBe(404);
			expect(e instanceof NotFoundError).toBeTruthy();
		}
	});
});
