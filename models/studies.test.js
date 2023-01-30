'use strict';

const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const db = require('../db.js');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testModelsCommon');
const WindhamStudies = require('./studies');
const Commodity = require('./commodity');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('create', function() {
	test('works', async function() {
		await WindhamStudies.create({
			title     : 'Study',
			date      : '1/29/2023',
			source    : 'link to study',
			objective : 'to test it'
		});
		const found = await db.query(`SELECT * FROM windham_studies WHERE title = 'Study' `);
		expect(found.rows.length).toEqual(1);
	});
	test('throw error with bad data', async function() {
		try {
			await WindhamStudies.create({
				date      : '1/29/2023',
				source    : 'link to study',
				objective : 'to test it'
			});
		} catch (e) {
			expect(e).toBeTruthy();
			expect(e.status).toBe(404);
			expect(e.message).toBe('Study needs a title');
		}
	});
});

// /************************************** get study info by id */

describe('getById', function() {
	test('works', async function() {
		const data = await WindhamStudies.create({
			title     : 'Study',
			date      : '1/29/2023',
			source    : 'link to study',
			objective : 'to test it'
		});

		const res = await WindhamStudies.getById(data.id);

		expect(res.date).toEqual('1/29/2023');
	});
	test('throws error if commodity id doesnt exist', async function() {
		try {
			await WindhamStudies.get('nope');
		} catch (e) {
			expect(e).toBeTruthy();
		}
	});
});

// /************************************** update windham study info */

describe('update', function() {
	test('works', async function() {
		const data = await WindhamStudies.create({
			title     : 'Study',
			date      : '1/29/2023',
			source    : 'link to study',
			objective : 'to test it'
		});

		const res = await WindhamStudies.getById(data.id);

		const updateRes = await WindhamStudies.update(res.id, {
			title : 'STUDY!'
		});

		expect(updateRes.title).toEqual('STUDY!');
	});
	test('throws not found error if id not found', async function() {
		try {
			await WindhamStudies.update('nope', {
				title : 'STUDY!'
			});
		} catch (e) {
			expect(e).toBeTruthy();
		}
	});
});

// /************************************** remove study info */

describe('remove', function() {
	test('works', async function() {
		const data = await WindhamStudies.create({
			title     : 'Study',
			date      : '1/29/2023',
			source    : 'link to study',
			objective : 'to test it'
		});

		const res = await WindhamStudies.getById(data.id);
		const removeRes = await WindhamStudies.remove(res.id);

		expect(removeRes).toEqual(`Removed Windham Packaging study: ${res.id}`);
	});
	test('throws not found error if id not found', async function() {
		try {
			await WindhamStudies.remove('nope');
		} catch (e) {
			expect(e.status).toBe(404);
			expect(e instanceof NotFoundError).toBeTruthy();
		}
	});
});
