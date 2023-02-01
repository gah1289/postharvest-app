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

/************************************** POST /temperature */

describe('POST /temperature', function() {
	test('works for admin: create shelf life', async function() {
		const resp = await request(app)
			.post('/temperature')
			.send({
				commodityId : 'id',
				data        : {
					minTemp     : '5',
					optimumTemp : '10',
					description : 'chill sensitive',
					rh          : '95%'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(201);
		expect(resp.body.temperature.commodityId).toEqual('id');
		expect(resp.body.temperature.rh).toEqual('95%');
	});
	test('does not work for user', async function() {
		const resp = await request(app)
			.post('/temperature')
			.send({
				commodityId : 'id',
				data        : {
					minTemp     : '5',
					optimumTemp : '10',
					description : 'chill sensitive',
					rh          : '95%'
				}
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});
	test('does not work for anon', async function() {
		const resp = await request(app).post('/temperature').send({
			commodityId : 'id',
			data        : {
				minTemp     : '5',
				optimumTemp : '10',
				description : 'chill sensitive',
				rh          : '95%'
			}
		});

		expect(resp.statusCode).toEqual(401);
	});

	test('bad request if no commodity id  is given', async function() {
		const resp = await request(app)
			.post('/temperature')
			.send({
				data : {
					minTemp     : '5',
					optimumTemp : '10',
					description : 'chill sensitive',
					rh          : '95%'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(400);
	});
});

test('bad request if non-existent commodity id is given', async function() {
	const resp = await request(app)
		.post('/temperature')
		.send({
			commodityId : 'bad-id',
			data        : {
				minTemp     : '5',
				optimumTemp : '10',
				description : 'chill sensitive',
				rh          : '95%'
			}
		})
		.set('authorization', `Bearer ${adminToken}`);

	expect(resp.statusCode).toEqual(404);
});

/************************************** GET /temperature */

describe('GET /temperature/:id', function() {
	test('works', async function() {
		const resp = await request(app)
			.post('/temperature')
			.send({
				commodityId : 'id',
				data        : {
					minTemp     : '5',
					optimumTemp : '10',
					description : 'chill sensitive',
					rh          : '95%'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(201);
		const tempId = resp.body.temperature.id;
		const tempRes = await request(app).get(`/temperature/${tempId}`);
		expect(tempRes.body.temperature.commodityId).toEqual('id');
		expect(tempRes.body.temperature.optimumTemp).toEqual('10');
	});
	test('throws error with bad id', async function() {
		const resp = await request(app).get(`/temperature/000`);
		expect(resp.status).toBe(404);
		expect(resp.body.error.message).toBe('Could not find temperature recommendation data with id: 000');
	});
});

// /************************************** GET /temperature/commodity/:id */

describe('GET /temperature/commodity/:id', function() {
	test('works for all', async function() {
		const resp = await request(app).get(`/temperature/commodity/id`);
		expect(resp.body.temperature.length).toEqual(1);
		expect(resp.body.temperature[0].commodityId).toEqual('id');
	});
	test('returns error if id not found', async function() {
		try {
			await request(app).get(`/temperature/commodity/no`);
		} catch (err) {
			expect(err.status).toBe(404);
		}
	});
});

// // /************************************** PATCH /temperature/:id */

describe('PATCH /temperature/:id', () => {
	test('works for admins', async function() {
		const respTemperature = await request(app)
			.post('/temperature')
			.send({
				commodityId : 'id',
				data        : {
					minTemp     : '5',
					optimumTemp : '10',
					description : 'chill sensitive',
					rh          : '95%'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		expect(respTemperature.body.temperature.optimumTemp).toEqual('10');
		const temperature = respTemperature.body.temperature.id;
		const resp = await request(app)
			.patch(`/temperature/${temperature}`)
			.send({
				optimumTemp : '20'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.body.temperature.commodityId).toBe('id');
		expect(resp.body.temperature.optimumTemp).toBe('20');
	});

	test('unauth if not admin', async function() {
		const respTemperature = await request(app)
			.post('/temperature')
			.send({
				commodityId : 'id',
				data        : {
					minTemp     : '5',
					optimumTemp : '10',
					description : 'chill sensitive',
					rh          : '95%'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		expect(respTemperature.body.temperature.optimumTemp).toEqual('10');
		const temperature = respTemperature.body.temperature.id;
		const resp = await request(app)
			.patch(`/temperature/${temperature}`)
			.send({
				optimumTemp : '20'
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const respTemperature = await request(app)
			.post('/temperature')
			.send({
				commodityId : 'id',
				data        : {
					minTemp     : '5',
					optimumTemp : '10',
					description : 'chill sensitive',
					rh          : '95%'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);

		expect(respTemperature.body.temperature.optimumTemp).toEqual('10');
		const temperature = respTemperature.body.temperature.id;
		const resp = await request(app).patch(`/temperature/${temperature}`).send({
			optimumTemp : '20'
		});

		expect(resp.statusCode).toEqual(401);
	});

	test('not found if no such commodity', async function() {
		const tempId = 'wut';
		const resp = await request(app)
			.patch(`/temperature/${tempId}`)
			.send({
				optimumTemp : '20'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});

// // /************************************** DELETE /temperature/:id */

describe('DELETE /temperature/:id', function() {
	test('works for admin', async function() {
		const respTemperature = await request(app)
			.post('/temperature')
			.send({
				commodityId : 'id',
				data        : {
					minTemp     : '5',
					optimumTemp : '10',
					description : 'chill sensitive',
					rh          : '95%'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		const tempId = respTemperature.body.temperature.id;
		const resp = await request(app).delete(`/temperature/${tempId}`).set('authorization', `Bearer ${adminToken}`);
		expect(typeof resp.body.deleted).toBe('string');
	});

	test('unauth if not admin', async function() {
		const respTemperature = await request(app)
			.post('/temperature')
			.send({
				commodityId : 'id',
				data        : {
					minTemp     : '5',
					optimumTemp : '10',
					description : 'chill sensitive',
					rh          : '95%'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		const tempId = respTemperature.body.temperature.id;
		const resp = await request(app).delete(`/temperature/${tempId}`).set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const respTemperature = await request(app)
			.post('/temperature')
			.send({
				commodityId : 'id',
				data        : {
					minTemp     : '5',
					optimumTemp : '10',
					description : 'chill sensitive',
					rh          : '95%'
				}
			})
			.set('authorization', `Bearer ${adminToken}`);
		const tempId = respTemperature.body.temperature.id;
		const resp = await request(app).delete(`/temperature/${tempId}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('not found if the temperature id is bad', async function() {
		const resp = await request(app).delete(`/temperature/nope`).set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});
