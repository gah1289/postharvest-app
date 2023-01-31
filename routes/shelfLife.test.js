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

describe('POST /shelf-life', function() {
	test('works for admin: create shelf life', async function() {
		const resp = await request(app)
			.post('/shelf-life')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '0',
					shelfLife   : '1 day',
					description : 'test',
					packaging   : 'test'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(201);
		expect(resp.body.shelfLife.commodityId).toEqual('id');
		expect(resp.body.shelfLife.shelfLife).toEqual('1 day');
	});
	test('does not work for user', async function() {
		const resp = await request(app)
			.post('/shelf-life')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '0',
					shelfLife   : '1 day',
					description : 'test',
					packaging   : 'test'
				}
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});
	test('does not work for anon', async function() {
		const resp = await request(app).post('/shelf-life').send({
			commodityId : 'id',
			data        : {
				temperature : '0',
				shelfLife   : '1 day',
				description : 'test',
				packaging   : 'test'
			}
		});

		expect(resp.statusCode).toEqual(401);
	});

	test('bad request if no commodity id  is given', async function() {
		const resp = await request(app)
			.post('/shelf-life')
			.send({
				data : {
					temperature : '0',
					shelfLife   : '1 day',
					description : 'test',
					packaging   : 'test'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});

	test('bad request if non-existent commodity id is given', async function() {
		const resp = await request(app)
			.post('/shelf-life')
			.send({
				commodityId : 'bad id',
				data        : {
					temperature : '0',
					shelfLife   : '1 day',
					description : 'test',
					packaging   : 'test'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});

/************************************** GET /commodities */

describe('GET /shelf-life/:id', function() {
	test('works', async function() {
		const respStudy = await request(app)
			.post('/shelf-life')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '0',
					shelfLife   : '1 day',
					description : 'test',
					packaging   : 'test'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		const studyId = respStudy.body.shelfLife.id;
		const resp = await request(app).get(`/shelf-life/${studyId}`);
		expect(resp.body.shelfLife.shelfLife).toEqual('1 day');
	});
	test('throws error with bad id', async function() {
		const resp = await request(app).get(`/shelf-life/000`);
		expect(resp.status).toBe(404);
		expect(resp.body.error.message).toBe('Could not find study with id: 000');
	});
});

// /************************************** GET /commodities/:id */

describe('GET /commodity/:id', function() {
	test('works for all', async function() {
		const resp = await request(app).get(`/shelf-life/commodity/id`);
		expect(resp.body.shelfLife.length).toEqual(1);
		expect(resp.body.shelfLife[0].commodityId).toEqual('id');
	});
	test('returns error if id not found', async function() {
		try {
			await request(app).get(`/shelf-life/commodity/no`);
		} catch (err) {
			expect(err.status).toBe(404);
		}
	});
});

// // /************************************** PATCH /commodities/:id */

describe('PATCH /commodities/:id', () => {
	test('works for admins', async function() {
		const respStudy = await request(app)
			.post('/shelf-life')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '0',
					shelfLife   : '1 day',
					description : 'test',
					packaging   : 'test'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(respStudy.body.shelfLife.commodityId).toBe('id');
		expect(respStudy.body.shelfLife.shelfLife).toBe('1 day');
		const studyId = respStudy.body.shelfLife.id;
		const resp = await request(app)
			.patch(`/shelf-life/${studyId}`)
			.send({
				shelfLife : '3 days'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(respStudy.body.shelfLife.commodityId).toBe('id');
		expect(resp.body.shelfLife.shelfLife).toBe('3 days');
	});

	test('unauth if not admin', async function() {
		const respStudy = await request(app)
			.post('/shelf-life')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '0',
					shelfLife   : '1 day',
					description : 'test',
					packaging   : 'test'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(respStudy.body.shelfLife.commodityId).toBe('id');
		expect(respStudy.body.shelfLife.shelfLife).toBe('1 day');
		const studyId = respStudy.body.shelfLife.id;
		const resp = await request(app)
			.patch(`/shelf-life/${studyId}`)
			.send({
				shelfLife : '3 days'
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const respStudy = await request(app)
			.post('/shelf-life')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '0',
					shelfLife   : '1 day',
					description : 'test',
					packaging   : 'test'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(respStudy.body.shelfLife.commodityId).toBe('id');
		expect(respStudy.body.shelfLife.shelfLife).toBe('1 day');
		const studyId = respStudy.body.shelfLife.id;
		const resp = await request(app).patch(`/shelf-life/${studyId}`).send({
			shelfLife : '3 days'
		});

		expect(resp.statusCode).toEqual(401);
	});

	test('not found if no such commodity', async function() {
		const resp = await request(app)
			.patch(`/shelf-life/nope`)
			.send({
				shelfLife : '3 days'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});

	test('bad request if invalid data', async function() {
		const resp = await request(app)
			.patch(`/shelf-life/nope`)
			.send({
				shelfLife : 1
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});
});

// // /************************************** DELETE /commodities/:id */

describe('DELETE /commodities/:id', function() {
	test('works for admin', async function() {
		const respStudy = await request(app)
			.post('/shelf-life')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '0',
					shelfLife   : '1 day',
					description : 'test',
					packaging   : 'test'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		const studyId = respStudy.body.shelfLife.id;
		const resp = await request(app).delete(`/shelf-life/${studyId}`).set('authorization', `Bearer ${adminToken}`);
		expect(typeof resp.body.deleted).toBe('string');
	});

	test('unauth if not admin', async function() {
		const respStudy = await request(app)
			.post('/shelf-life')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '0',
					shelfLife   : '1 day',
					description : 'test',
					packaging   : 'test'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		const studyId = respStudy.body.shelfLife.id;
		const resp = await request(app).delete(`/shelf-life/${studyId}`).set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const respStudy = await request(app)
			.post('/shelf-life')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '0',
					shelfLife   : '1 day',
					description : 'test',
					packaging   : 'test'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		const studyId = respStudy.body.shelfLife.id;
		const resp = await request(app).delete(`/shelf-life/${studyId}`).set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('not found if shelfLife data missing', async function() {
		const resp = await request(app).delete(`/shelf-life/nope`).set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});
