'use strict';

const { NotFoundError } = require('../expressError');
const db = require('../db.js');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testModelsCommon');
const References = require('./references');
const Commodity = require('./commodity');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create reference info */

describe('create', function() {
	test('works', async function() {
		await Commodity.create({
			id             : 'ID',
			commodityName  : 'Test Commodity',
			variety        : 'Test',
			scientificName : 'Test',
			coolingMethod  : 'Test',
			climacteric    : true
		});
		await References.create('ID', {
			source : 'some website'
		});

		const found = await db.query(`SELECT * FROM refs WHERE commodity_id = 'ID'`);
		expect(found.rows.length).toEqual(1);
		expect(found.rows[0].source).toEqual('some website');
	});
});

/************************************** get reference info when given a commodity id */

describe('getByCommodity', function() {
	test('works', async function() {
		const res = await References.getByCommodity('id');
		expect(res.length).toEqual(1);
		expect(res[0].commodityId).toEqual('id');
		expect(res[0].source).toEqual('website');
	});
	test('throws error if commodity id doesnt exist', async function() {
		try {
			await References.get('nope');
		} catch (e) {
			expect(e).toBeTruthy();
		}
	});
});

/************************************** remove all reference info from commodity */

describe('remove', function() {
	test('works', async function() {
		await References.create('id', {
			source : 'some other website'
		});

		const get = await References.getByCommodity('id');

		expect(get.length).toEqual(2);

		const deleted = await References.remove('id', 'some other website');

		expect(deleted).toEqual('Removed reference data for commodity: id');
		const getAfterDelete = await References.getByCommodity('id');
		expect(getAfterDelete.length).toEqual(1);
	});
	test('throws not found error if commodity not found', async function() {
		try {
			await References.remove('nope');
		} catch (e) {
			expect(e.status).toBe(404);
			expect(e instanceof NotFoundError).toBeTruthy();
		}
	});
});
