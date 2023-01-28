'use strict';

const request = require('supertest');

const db = require('../db.js');
const app = require('../app');

const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u1Token,

	adminToken
} = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /commodities */

describe('POST /commodities', function() {
	test('works for admins: create commodity', async function() {
		const resp = await request(app)
			.post('/commodities')
			.send({
				commodityName  : 'Test Commodity3',
				variety        : 'Test3',
				scientificName : 'Test3',
				coolingMethod  : 'Test3',
				climacteric    : true
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(201);
		expect(resp.body.commodity.commodityName).toEqual('Test Commodity3');
	});

	test('unauth for non-admin commodities', async function() {
		const resp = await request(app)
			.post('/commodities')
			.send({
				commodityName  : 'Test Commodity3',
				variety        : 'Test3',
				scientificName : 'Test3',
				coolingMethod  : 'Test3',
				climacteric    : true
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const resp = await request(app).post('/commodities').send({
			commodityName  : 'Test Commodity3',
			variety        : 'Test3',
			scientificName : 'Test3',
			coolingMethod  : 'Test3',
			climacteric    : true
		});
		expect(resp.statusCode).toEqual(401);
	});

	test('bad request if no commodity name is given', async function() {
		const resp = await request(app)
			.post('/commodities')
			.send({
				variety        : 'Test3',
				scientificName : 'Test3',
				coolingMethod  : 'Test3',
				climacteric    : true
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});

	test('bad request if invalid data', async function() {
		const resp = await request(app)
			.post('/commodities')
			.send({
				commodityName  : 'Test Commodity3',
				variety        : 'Test3',
				scientificName : 'Test3',
				coolingMethod  : 'Test3',
				climacteric    : 'true'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});
});

/************************************** GET /commodities */

describe('GET /commodities', function() {
	test('works for all', async function() {
		const resp = await request(app).get('/commodities');
		expect(resp.body.commodities.length).toEqual(2);
		expect(resp.body.commodities[0]).toEqual({
			id             : 'id',
			commodityName  : 'Test Commodity',
			variety        : 'Test',
			scientificName : 'Test',
			coolingMethod  : 'Test',
			climacteric    : true
		});
	});
});

// /************************************** GET /commodities/:id */

describe('GET /commodities/:id', function() {
	test('works for all', async function() {
		const resp = await request(app).get(`/commodities/id`);
		expect(resp.body).toEqual({
			commodity : {
				id             : 'id',
				commodityName  : 'Test Commodity',
				variety        : 'Test',
				scientificName : 'Test',
				coolingMethod  : 'Test',
				climacteric    : true
			}
		});
	});
	test('returns error if id not found', async function() {
		try {
			await request(app).get(`/commodities/nope`);
		} catch (e) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});

// // /************************************** PATCH /commodities/:id */

describe('PATCH /commodities/:id', () => {
	test('works for admins', async function() {
		const resp = await request(app)
			.patch(`/commodities/id`)
			.send({
				scientificName : 'science'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.body).toEqual({
			commodity : {
				id             : 'id',
				commodityName  : 'Test Commodity',
				variety        : 'Test',
				scientificName : 'science',
				coolingMethod  : 'Test',
				climacteric    : true
			}
		});
	});

	test('unauth if not admin', async function() {
		const resp = await request(app)
			.patch(`/commodities/id`)
			.send({
				scientificName : 'science'
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const resp = await request(app).patch(`/commodities/id`).send({
			scientificName : 'science'
		});
		expect(resp.statusCode).toEqual(401);
	});

	test('not found if no such commodity', async function() {
		const resp = await request(app)
			.patch(`/commodities/nope`)
			.send({
				scientificName : 'science'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});

	test('bad request if invalid data', async function() {
		const resp = await request(app)
			.patch(`/commodities/id`)
			.send({
				climacteric : 'true'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});
});

// // /************************************** DELETE /commodities/:id */

describe('DELETE /commodities/:id', function() {
	test('works for admin', async function() {
		const resp = await request(app).delete(`/commodities/id`).set('authorization', `Bearer ${adminToken}`);
		expect(resp.body).toEqual({ deleted: 'id' });
	});

	test('unauth if not admin', async function() {
		const resp = await request(app).delete(`/commodities/id`).set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const resp = await request(app).delete(`/commodities/id`);
		expect(resp.statusCode).toEqual(401);
	});

	test('not found if commodity missing', async function() {
		const resp = await request(app).delete(`/commodities/nope`).set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});
