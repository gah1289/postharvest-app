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

/************************************** POST /ethylene */

describe('POST /ethylene', function() {
	test('works for admin: create shelf life', async function() {
		const resp = await request(app)
			.post('/ethylene')
			.send({
				commodityId : 'id',
				data        : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(201);
		expect(resp.body.ethylene.commodityId).toEqual('id');
		expect(resp.body.ethylene.c2h4Production).toEqual('5');
	});
	test('does not work for user', async function() {
		const resp = await request(app)
			.post('/ethylene')
			.send({
				commodityId : 'id',
				data        : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});
	test('does not work for anon', async function() {
		const resp = await request(app).post('/ethylene').send({
			commodityId : 'id',
			data        : {
				temperature    : '10',
				c2h4Production : '5',
				c2h4Class      : 'low'
			}
		});

		expect(resp.statusCode).toEqual(401);
	});

	test('bad request if no commodity id  is given', async function() {
		const resp = await request(app)
			.post('/ethylene')
			.send({
				data : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});

	test('bad request if non-existent commodity id is given', async function() {
		const resp = await request(app)
			.post('/ethylene')
			.send({
				commodityId : 'bad-id',
				data        : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		expect(resp.statusCode).toEqual(404);
	});
});

/************************************** GET /ethylene */

describe('GET /ethylene/:id', function() {
	test('works', async function() {
		const respEth = await request(app)
			.post('/ethylene')
			.send({
				commodityId : 'id',
				data        : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		const ethyleneId = respEth.body.ethylene.id;
		const resp = await request(app).get(`/ethylene/${ethyleneId}`);
		expect(resp.body.ethylene.commodityId).toEqual('id');
		expect(resp.body.ethylene.temperature).toEqual('10');
	});
	test('throws error with bad id', async function() {
		const resp = await request(app).get(`/ethylene/000`);
		expect(resp.status).toBe(404);
		expect(resp.body.error.message).toBe('Could not find ethylene data with id: 000');
	});
});

// /************************************** GET /ethylene/commodity/:id */

describe('GET /ethylene/commodity/:id', function() {
	test('works for all', async function() {
		const resp = await request(app).get(`/ethylene/commodity/id`);
		expect(resp.body.ethylene.length).toEqual(1);
		expect(resp.body.ethylene[0].commodityId).toEqual('id');
	});
	test('returns error if id not found', async function() {
		try {
			await request(app).get(`/ethylene/commodity/no`);
		} catch (err) {
			expect(err.status).toBe(404);
		}
	});
});

// // /************************************** PATCH /ethylene/:id */

describe('PATCH /ethylene/:id', () => {
	test('works for admins', async function() {
		const respEth = await request(app)
			.post('/ethylene')
			.send({
				commodityId : 'id',
				data        : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		expect(respEth.body.ethylene.c2h4Production).toEqual('5');
		const ethyleneId = respEth.body.ethylene.id;
		const resp = await request(app)
			.patch(`/ethylene/${ethyleneId}`)
			.send({
				c2h4Production : '6'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.body.ethylene.commodityId).toBe('id');
		expect(resp.body.ethylene.c2h4Production).toBe('6');
	});

	test('unauth if not admin', async function() {
		const respEth = await request(app)
			.post('/ethylene')
			.send({
				commodityId : 'id',
				data        : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		expect(respEth.body.ethylene.c2h4Production).toEqual('5');
		const ethyleneId = respEth.body.ethylene.id;
		const resp = await request(app)
			.patch(`/ethylene/${ethyleneId}`)
			.send({
				c2h4Production : '6'
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const respEth = await request(app)
			.post('/ethylene')
			.send({
				commodityId : 'id',
				data        : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		expect(respEth.body.ethylene.c2h4Production).toEqual('5');
		const ethyleneId = respEth.body.ethylene.id;
		const resp = await request(app).patch(`/ethylene/${ethyleneId}`).send({
			c2h4Production : '6'
		});

		expect(resp.statusCode).toEqual(401);
	});

	test('not found if no such commodity', async function() {
		const ethyleneId = 'wut';
		const resp = await request(app)
			.patch(`/ethylene/${ethyleneId}`)
			.send({
				c2h4Production : '6'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});

// // /************************************** DELETE /ethylene/:id */

describe('DELETE /ethylene/:id', function() {
	test('works for admin', async function() {
		const respStudy = await request(app)
			.post('/ethylene')
			.send({
				commodityId : 'id',
				data        : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		const ethId = respStudy.body.ethylene.id;
		const resp = await request(app).delete(`/ethylene/${ethId}`).set('authorization', `Bearer ${adminToken}`);
		expect(typeof resp.body.deleted).toBe('string');
	});

	test('unauth if not admin', async function() {
		const respStudy = await request(app)
			.post('/ethylene')
			.send({
				commodityId : 'id',
				data        : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		const ethId = respStudy.body.ethylene.id;
		const resp = await request(app).delete(`/ethylene/${ethId}`).set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const respStudy = await request(app)
			.post('/ethylene')
			.send({
				commodityId : 'id',
				data        : {
					temperature    : '10',
					c2h4Production : '5',
					c2h4Class      : 'low'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		const ethId = respStudy.body.ethylene.id;
		const resp = await request(app).delete(`/ethylene/${ethId}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('not found if ethylene data missing', async function() {
		const resp = await request(app).delete(`/ethylene/nope`).set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});
