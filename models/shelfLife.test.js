'use strict';

const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const db = require('../db.js');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testModelsCommon');
const ShelfLife = require('./shelfLife');
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
		await ShelfLife.create(commodity.id, {
			temperature : '10',
			shelfLife   : '10 days',
			description : 'test',
			packaging   : 'air'
		});
		const found = await db.query(`SELECT * FROM shelf_life WHERE commodity_id = '${commodity.id}' `);
		expect(found.rows.length).toEqual(1);
	});
	test('throw error with bad id', async function() {
		try {
			await ShelfLife.create('commodity.id', {
				temperature : '10',
				shelfLife   : '10 days',
				description : 'test',
				packaging   : 'air'
			});
		} catch (e) {
			expect(e instanceof NotFoundError).toBeTruthy();
		}
	});
});

/************************************** get shelf life info by commodity */

describe('getByCommodity', function() {
	test('works', async function() {
		const res = await ShelfLife.getByCommodity('id');
		expect(res.length).toEqual(1);
		expect(res[0].commodityId).toEqual('id');
		expect(res[0].shelfLife).toEqual('1 day');
	});
	test('throws error if commodity id doesnt exist', async function() {
		try {
			await Respiration.get('nope');
		} catch (e) {
			expect(e).toBeTruthy();
		}
	});
});

// /************************************** get shelf life info by id */

describe('getById', function() {
	test('works', async function() {
		const data = await ShelfLife.create('id', {
			temperature : '10',
			shelfLife   : '20 days',
			description : 'test',
			packaging   : 'air'
		});

		const res = await ShelfLife.getById(data.id);
		expect(res.commodityId).toEqual('id');
		expect(res.shelfLife).toEqual('20 days');
	});
	test('throws error if commodity id doesnt exist', async function() {
		try {
			await ShelfLife.get('nope');
		} catch (e) {
			expect(e).toBeTruthy();
		}
	});
});

// /************************************** update shelf life info */

describe('update', function() {
	test('works', async function() {
		const res = await ShelfLife.getByCommodity('id');

		const updateRes = await ShelfLife.update(res[0].id, {
			shelfLife : '2 days'
		});

		expect(updateRes.commodityId).toEqual('id');
		expect(updateRes.shelfLife).toEqual('2 days');
	});
	test('throws not found error if commodity not found', async function() {
		try {
			await ShelfLife.update('nope', {
				shelfLife : '2 days'
			});
		} catch (e) {
			expect(e.status).toBe(404);
			expect(e instanceof NotFoundError).toBeTruthy();
		}
	});
});

// /************************************** remove shelf life info */

describe('remove', function() {
	test('works', async function() {
		const res = await ShelfLife.getByCommodity('id');
		const shelfLifeRes = await ShelfLife.remove(res[0].id);

		expect(shelfLifeRes).toEqual('Removed shelf life data');
	});
	test('throws not found error if commodity not found', async function() {
		try {
			await ShelfLife.remove('nope');
		} catch (e) {
			expect(e.status).toBe(404);
			expect(e instanceof NotFoundError).toBeTruthy();
		}
	});
});
