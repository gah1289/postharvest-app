'use strict';

const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const db = require('../db.js');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testModelsCommon');
const Ethylene = require('./ethylene');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create ethylene sensitivity info */

describe('create', function() {
	test('works', async function() {
		await Ethylene.create('id', {
			temperature    : '10',
			c2h4Production : '5',
			c2h4Class      : 'low'
		});

		const found = await db.query(`SELECT * FROM ethylene_sensitivity WHERE commodity_id = 'id'`);
		expect(found.rows.length).toEqual(2);
		expect(found.rows[1].temperature).toEqual('10');
	});
});

/************************************** get ethylene sensitivity info */

describe('getByCommodity', function() {
	test('works', async function() {
		const res = await Ethylene.getByCommodity('id');
		expect(res.length).toEqual(1);
		expect(res[0].commodityId).toEqual('id');
		expect(res[0].c2h4Class).toEqual('low');
	});
	test('throws error if commodity id doesnt exist', async function() {
		try {
			await Ethylene.get('nope');
		} catch (e) {
			expect(e).toBeTruthy();
		}
	});
});

/************************************** update ethylene sensitivity info */

describe('update', function() {
	test('works', async function() {
		const ethyleneRes = await Ethylene.getByCommodity('id');

		const res = await Ethylene.update(ethyleneRes[0].id, {
			c2h4Class : 'high'
		});

		expect(res.commodityId).toEqual('id');
		expect(res.c2h4Class).toEqual('high');
	});
	test('throws not found error if commodity not found', async function() {
		try {
			await Ethylene.update('nope', {
				c2h4Class : 'high'
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
		const ethyleneRes = await Ethylene.getByCommodity('id');
		const res = await Ethylene.remove(ethyleneRes[0].id);

		expect(res).toEqual('Removed ethylene sensitivity data for commodity');
	});
	test('throws not found error if commodity not found', async function() {
		try {
			await Ethylene.remove('nope');
		} catch (e) {
			expect(e.status).toBe(404);
			expect(e instanceof NotFoundError).toBeTruthy();
		}
	});
});
