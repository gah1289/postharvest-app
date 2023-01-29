'use strict';

const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const db = require('../db.js');
const Commodity = require('./commodity.js');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testModelsCommon');
const { create } = require('./ethylene');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** register */

describe('create', function() {
	const newCommodity = {
		commodityName  : 'New Commodity',
		variety        : 'New',
		scientificName : 'New',
		coolingMethod  : 'New',
		climacteric    : false
	};

	test('works', async function() {
		await Commodity.create({
			...newCommodity
		});

		const found = await db.query(`SELECT * FROM commodities WHERE commodity_name = 'New Commodity'`);
		expect(found.rows.length).toEqual(1);
		expect(found.rows[0].climacteric).toEqual(false);
		expect(found.rows[0].variety.startsWith('New'));
		expect(found.rows[0].id.startsWith('NEW'));
	});

	test('bad request with dup data', async function() {
		try {
			await Commodity.create({
				id             : 'id',
				commodityName  : 'Test Commodity',
				variety        : 'Test',
				scientificName : 'Test',
				coolingMethod  : 'Test',
				climacteric    : true
			});

			fail();
		} catch (err) {
			expect(err).toBeTruthy();
		}
	});
});

// /************************************** findAll */

describe('findAll', function() {
	test('works', async function() {
		const commodities = await Commodity.findAll();
		expect(commodities[0].climacteric).toEqual(true);
		expect(commodities[1].variety).toEqual('Test2');
	});
});

// // /************************************** get */

describe('get', function() {
	test('works', async function() {
		let commodity = await Commodity.get('id');
		expect(commodity.id).toEqual('id');
		expect(commodity.commodityName).toEqual('Test Commodity');
		expect(commodity.ethyleneSensitivity.length).toEqual(1);
		expect(commodity.ethyleneSensitivity[0].temperature).toBe('20');
		expect(commodity.respirationRate.length).toEqual(1);
		expect(commodity.respirationRate[0].rrClass).toBe('high');
		expect(commodity.shelfLife.length).toEqual(1);
		expect(commodity.shelfLife[0].shelfLife).toBe('1 day');
	});

	test('returns empty array if ethylene, respiration, or shelf life data does not exist', async function() {
		const newCommodity = {
			commodityName  : 'New Commodity',
			variety        : 'New',
			scientificName : 'New',
			coolingMethod  : 'New',
			climacteric    : false
		};
		const commodity = await Commodity.create({ ...newCommodity });

		const res = await Commodity.get(commodity.id);
		expect(res.ethyleneSensitivity.length).toBe(0);
		expect(res.respirationRate.length).toBe(0);
		expect(res.shelfLife.length).toBe(0);
	});

	test('not found if commodity does not exist', async function() {
		try {
			await Commodity.get('nope');
			fail();
		} catch (err) {
			expect(err).toBeTruthy();
		}
	});
});

// // /************************************** update */

describe('update', function() {
	const updateData = {
		commodityName  : 'Test Commodity',
		variety        : 'TEST',
		scientificName : 'Test',
		coolingMethod  : 'New Methods',
		climacteric    : true
	};

	test('works', async function() {
		let commodity = await Commodity.update('id', updateData);
		expect(commodity).toEqual({
			id : 'id',
			...updateData
		});
	});

	test('not found if no commodity is found', async function() {
		try {
			await Commodity.update('nope', {
				commodityName : 'test'
			});
			fail();
		} catch (err) {
			expect(err).toBeTruthy();
		}
	});

	test('bad request if no data', async function() {
		expect.assertions(1);
		try {
			await Commodity.update('id', {});
			fail();
		} catch (err) {
			expect(err).toBeTruthy();
		}
	});
});

// // /************************************** remove */

describe('remove', function() {
	test('works', async function() {
		await Commodity.remove('id');
		const res = await db.query("SELECT * FROM commodities WHERE id='id'");
		expect(res.rows.length).toEqual(0);
	});

	test('not found if no such commodity', async function() {
		try {
			await Commodity.remove('nope');
			fail();
		} catch (err) {
			expect(err).toBeTruthy();
		}
	});
});
