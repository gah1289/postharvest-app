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

/************************************** POST /respiration */

describe('POST /respiration', function() {
	test('works for admin: create shelf life', async function() {
		const resp = await request(app)
			.post('/respiration')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '10',
					rrRate      : '5-10',
					rrClass     : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(201);
		expect(resp.body.respiration.commodityId).toEqual('id');
		expect(resp.body.respiration.rrRate).toEqual('5-10');
	});
	test('does not work for user', async function() {
		const resp = await request(app)
			.post('/respiration')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '10',
					rrRate      : '5-10',
					rrClass     : 'low'
				}
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});
	test('does not work for anon', async function() {
		const resp = await request(app).post('/respiration').send({
			commodityId : 'id',
			data        : {
				temperature : '10',
				rrRate      : '5-10',
				rrClass     : 'low'
			}
		});

		expect(resp.statusCode).toEqual(401);
	});

	test('bad request if no commodity id  is given', async function() {
		const resp = await request(app)
			.post('/respiration')
			.send({
				data : {
					temperature : '10',
					rrRate      : '5-10',
					rrClass     : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});

	test('bad request if non-existent commodity id is given', async function() {
		const resp = await request(app)
			.post('/respiration')
			.send({
				commodityId : 'bad-id',
				data        : {
					temperature : '10',
					rrRate      : '5-10',
					rrClass     : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		expect(resp.statusCode).toEqual(404);
	});
});

/************************************** GET /respiration */

describe('GET /respiration/:id', function() {
	test('works', async function() {
		const resp = await request(app)
			.post('/respiration')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '10',
					rrRate      : '5-10',
					rrClass     : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(201);
		const respId = resp.body.respiration.id;
		const respirationRes = await request(app).get(`/respiration/${respId}`);
		expect(respirationRes.body.respiration.commodityId).toEqual('id');
		expect(respirationRes.body.respiration.temperature).toEqual('10');
	});
	test('throws error with bad id', async function() {
		const resp = await request(app).get(`/respiration/000`);
		expect(resp.status).toBe(404);
		expect(resp.body.error.message).toBe('Could not find respiration rate data with id: 000');
	});
});

// /************************************** GET /respiration/commodity/:id */

describe('GET /respiration/commodity/:id', function() {
	test('works for all', async function() {
		const resp = await request(app).get(`/respiration/commodity/id`);
		expect(resp.body.respiration.length).toEqual(1);
		expect(resp.body.respiration[0].commodityId).toEqual('id');
	});
	test('returns error if id not found', async function() {
		try {
			await request(app).get(`/respiration/commodity/no`);
		} catch (err) {
			expect(err.status).toBe(404);
		}
	});
});

// // /************************************** PATCH /respiration/:id */

describe('PATCH /respiration/:id', () => {
	test('works for admins', async function() {
		const respRespiration = await request(app)
			.post('/respiration')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '10',
					rrRate      : '5-10',
					rrClass     : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		expect(respRespiration.body.respiration.rrClass).toEqual('low');
		const respirationId = respRespiration.body.respiration.id;
		const resp = await request(app)
			.patch(`/respiration/${respirationId}`)
			.send({
				rrClass : 'high'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.body.respiration.commodityId).toBe('id');
		expect(resp.body.respiration.rrClass).toBe('high');
	});

	test('unauth if not admin', async function() {
		const respRespiration = await request(app)
			.post('/respiration')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '10',
					rrRate      : '5-10',
					rrClass     : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		expect(respRespiration.body.respiration.rrClass).toEqual('low');
		const respirationId = respRespiration.body.respiration.id;
		const resp = await request(app)
			.patch(`/respiration/${respirationId}`)
			.send({
				rrClass : 'high'
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const respRespiration = await request(app)
			.post('/respiration')
			.send({
				commodityId : 'id',
				data        : {
					temperature : '10',
					rrRate      : '5-10',
					rrClass     : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		expect(respRespiration.body.respiration.rrClass).toEqual('low');
		const respirationId = respRespiration.body.respiration.id;
		const resp = await request(app).patch(`/respiration/${respirationId}`).send({
			rrClass : 'high'
		});

		expect(resp.statusCode).toEqual(401);
	});

	test('not found if no such commodity', async function() {
		const respId = 'wut';
		const resp = await request(app)
			.patch(`/respiration/${respId}`)
			.send({
				rrClass : 'high'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});

// // /************************************** DELETE /respiration/:id */

describe('DELETE /respiration/:id', function() {
	test('works for admin', async function() {
		const respRespiration = await request(app)
			.post('/respiration')
			.send({
				commodityId : 'id',
				data        : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		const respirationId = respRespiration.body.respiration.id;
		const resp = await request(app)
			.delete(`/respiration/${respirationId}`)
			.set('authorization', `Bearer ${adminToken}`);
		expect(typeof resp.body.deleted).toBe('string');
	});

	test('unauth if not admin', async function() {
		const respRespiration = await request(app)
			.post('/respiration')
			.send({
				commodityId : 'id',
				data        : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		const respirationId = respRespiration.body.respiration.id;
		const resp = await request(app)
			.delete(`/respiration/${respirationId}`)
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const respRespiration = await request(app)
			.post('/respiration')
			.send({
				commodityId : 'id',
				data        : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		const respirationId = respRespiration.body.respiration.id;
		const resp = await request(app).delete(`/respiration/${respirationId}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('not found if the respiration id is bad', async function() {
		const resp = await request(app).delete(`/respiration/nope`).set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});
