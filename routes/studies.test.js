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

/************************************** POST /studies */

describe('POST /studies', function() {
	test('works for admin: create windham study', async function() {
		const resp = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(201);
		expect(resp.body.study.title).toEqual('Another Study');
	});
	test('does not work for user', async function() {
		const resp = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});
	test('does not work for anon', async function() {
		const resp = await request(app).post('/studies').send({
			title     : 'Another Study',
			date      : '1/31/2023',
			source    : 'link to study',
			objective : 'to test it'
		});

		expect(resp.statusCode).toEqual(401);
	});
});

/************************************** GET /temperature */

describe('GET /studies/:id', function() {
	test('works for admin', async function() {
		const resp = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(201);
		const studyId = resp.body.study.id;

		const studyRes = await request(app).get(`/studies/${studyId}`).set('authorization', `Bearer ${adminToken}`);

		expect(studyRes.body.study.title).toEqual('Another Study');
	});
	test('throws error with bad id', async function() {
		const resp = await request(app).get(`/studies/000`).set('authorization', `Bearer ${adminToken}`);
		expect(resp.status).toBe(404);
		expect(resp.body.error.message).toBe('Could not find study data with id: 000');
	});
	test('unauth for user', async function() {
		const resp = await request(app).get(`/studies/id`).set('authorization', `Bearer ${u1Token}`);
		expect(resp.status).toBe(401);
	});
});

/************************************** PATCH /studies/:id */

describe('PATCH /studies/:id', () => {
	test('works for admins', async function() {
		const studyResp = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);

		const studyId = studyResp.body.study.id;
		const resp = await request(app)
			.patch(`/studies/${studyId}`)
			.send({
				date : '2/1/2023'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.body.study.date).toBe('2/1/2023');
	});

	test('unauth if not admin', async function() {
		const studyResp = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);

		const studyId = studyResp.body.study.id;
		const resp = await request(app)
			.patch(`/studies/${studyId}`)
			.send({
				date : '2/1/2023'
			})
			.set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const studyResp = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);

		const studyId = studyResp.body.study.id;
		const resp = await request(app).patch(`/studies/${studyId}`).send({
			date : '2/1/2023'
		});

		expect(resp.statusCode).toEqual(401);
	});

	test('not found if study id is bad', async function() {
		const tempId = 'wut';
		const resp = await request(app)
			.patch(`/studies/badId`)
			.send({
				date : '2/1/2023'
			})
			.set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});

/************************************** DELETE /temperature/:id */

describe('DELETE /studies/:id', function() {
	test('works for admin', async function() {
		const studyResp = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);

		const studyId = studyResp.body.study.id;
		const resp = await request(app).delete(`/studies/${studyId}`).set('authorization', `Bearer ${adminToken}`);
		expect(typeof resp.body.deleted).toBe('string');
	});

	test('unauth if not admin', async function() {
		const studyResp = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);

		const studyId = studyResp.body.study.id;
		const resp = await request(app).delete(`/studies/${studyId}`).set('authorization', `Bearer ${u1Token}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('unauth for anon', async function() {
		const studyResp = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);

		const studyId = studyResp.body.study.id;
		const resp = await request(app).delete(`/studies/${studyId}`);
		expect(resp.statusCode).toEqual(401);
	});

	test('not found if the study id is bad', async function() {
		const resp = await request(app).delete(`/studies/nope`).set('authorization', `Bearer ${adminToken}`);
		expect(resp.statusCode).toEqual(404);
	});
});

/************************************** POST /studies/:commodityId */

describe('POST /studies/:commodityId', function() {
	test('works for admin: create windham study', async function() {
		const study = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);
		const studyId = study.body.study.id;

		const studyCommodity = await request(app)
			.post(`/studies/id`)
			.send({ studyId })
			.set('authorization', `Bearer ${adminToken}`);

		expect(studyCommodity.status).toBe(201);
		expect(studyCommodity.body.studyCommodity.studyId).toBe(studyId);
		expect(studyCommodity.body.studyCommodity.commodityId).toBe('id');
	});
	test('does not work for user', async function() {
		const study = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);
		const studyId = study.body.study.id;

		const studyCommodity = await request(app)
			.post(`/studies/id`)
			.send({ studyId })
			.set('authorization', `Bearer ${u1Token}`);
		expect(studyCommodity.statusCode).toEqual(401);
	});
	test('does not work for anon', async function() {
		const study = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);
		const studyId = study.body.study.id;

		const studyCommodity = await request(app).post(`/studies/id`).send({ studyId });

		expect(studyCommodity.statusCode).toEqual(401);
	});
});

/************************************** GET /studies/commodity/:id */

describe('GET /studies/commodity/:id', function() {
	test('works for admin: get windham studies associated with commodity', async function() {
		const studies = await request(app).get(`/studies/commodity/id`).set('authorization', `Bearer ${adminToken}`);

		expect(studies.status).toBe(200);
		expect(studies.body.studies.length).toBe(1);
	});
	test('does not work for user', async function() {
		const studies = await request(app).get(`/studies/commodity/id`).set('authorization', `Bearer ${u1Token}`);
		expect(studies.statusCode).toEqual(401);
	});
	test('does not work for anon', async function() {
		const studies = await request(app).get(`/studies/commodity/id`);

		expect(studies.statusCode).toEqual(401);
	});
});

/************************************** GET /studies/study/:id */

describe('GET /studies/study/:id', function() {
	test('works for admin: get commodities associated with  windham study', async function() {
		const study = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);
		const studyId = study.body.study.id;

		await request(app).post(`/studies/id`).send({ studyId }).set('authorization', `Bearer ${adminToken}`);

		const studies = await request(app)
			.get(`/studies/study/${studyId}`)
			.set('authorization', `Bearer ${adminToken}`);

		expect(studies.status).toBe(200);
		expect(studies.body.commodities.length).toBe(1);
	});
	test('does not work for user', async function() {
		const study = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);
		const studyId = study.body.study.id;

		await request(app).post(`/studies/id`).send({ studyId }).set('authorization', `Bearer ${adminToken}`);

		const studies = await request(app).get(`/studies/study/${studyId}`).set('authorization', `Bearer ${u1Token}`);
		expect(studies.statusCode).toEqual(401);
	});
	test('does not work for anon', async function() {
		const study = await request(app)
			.post('/studies')
			.send({
				title     : 'Another Study',
				date      : '1/31/2023',
				source    : 'link to study',
				objective : 'to test it'
			})
			.set('authorization', `Bearer ${adminToken}`);
		const studyId = study.body.study.id;

		await request(app).post(`/studies/id`).send({ studyId }).set('authorization', `Bearer ${adminToken}`);

		const studies = await request(app).get(`/studies/study/${studyId}`);

		expect(studies.statusCode).toEqual(401);
	});
});
