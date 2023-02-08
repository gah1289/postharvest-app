'use strict';

const request = require('supertest');

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

/************************************** POST /ref */

describe('POST /ref', function() {
	test('works for admin: create reference', async function() {
		const resp = await request(app)
			.post('/ref')
			.send({
				commodityId : 'id',

				data        : {
					source : 'website'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(201);
		expect(resp.body.reference.commodityId).toEqual('id');
		expect(resp.body.reference.source).toEqual('website');
	});
	test('does not work for user', async function() {
		const resp = await request(app)
			.post('/ref')
			.send({
				commodityId : 'id',

				data        : {
					source : 'website'
				}
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});
	test('does not work for anon', async function() {
		const resp = await request(app).post('/ref').send({
			commodityId : 'id',

			data        : {
				source : 'website'
			}
		});

		expect(resp.statusCode).toEqual(401);
	});

	test('bad request if no commodity id  is given', async function() {
		const resp = await request(app)
			.post('/ref')
			.send({
				data : {
					source : 'website'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});
});

test('bad request if non-existent commodity id is given', async function() {
	const resp = await request(app)
		.post('/ref')
		.send({
			commodityId : 'bad-id',

			data        : {
				source : 'website'
			}
		})
		.set('authorization', `Bearer ${adminToken}`);

	expect(resp.statusCode).toEqual(404);
});

// /************************************** GET /ref/commodity/:id */

describe('GET /ref/commodity/:id', function() {
	test('works for all', async function() {
		const resp = await request(app).get(`/ref/commodity/id`);
		expect(resp.body.reference.length).toEqual(1);
		expect(resp.body.reference[0].commodityId).toEqual('id');
	});
	test('returns error if id not found', async function() {
		try {
			await request(app).get(`/ref/commodity/no`);
		} catch (err) {
			expect(err.status).toBe(404);
		}
	});
});

// // /************************************** DELETE /ref/:id */

describe('DELETE /ref/:id', function() {
	test('works for admin', async function() {
		const resp = await request(app)
			.delete(`/ref/id`)
			.send({ source: 'some website' })
			.set('authorization', `Bearer ${adminToken}`);
		expect(typeof resp.body.deleted).toBe('string');
	});

	test('unauth if not admin', async function() {
		const resp = await request(app).delete(`/ref/id`).set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const resp = await request(app).delete(`/ref/id`);
		expect(resp.statusCode).toEqual(401);
	});

	test('not found if the commodity id is bad', async function() {
		const resp = await request(app).delete(`/ref/nope`).set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});
