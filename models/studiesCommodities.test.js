'use strict';

const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const db = require('../db.js');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testModelsCommon');
const WindhamStudies = require('./studies');
const Commodity = require('./commodity');
const WindhamStudiesCommodities = require('./studiesCommodities');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('create', function() {
	test('works', async function() {
		const study = await WindhamStudies.create({
			title     : 'Study',
			date      : '1/29/2023',
			source    : 'link to study',
			objective : 'to test it'
		});
		const commodityId = 'id';
		const data = { studyId: study.id, commodityId: commodityId };

		const res = await WindhamStudiesCommodities.create(data);
		expect(res.commodityId).toEqual('id');
		const found = await db.query(`SELECT * FROM windham_studies_commodities WHERE commodity_id = 'id' `);

		expect(found.rows.length).toEqual(2);
	});
	test('throw error with bad data', async function() {
		try {
			const study = await WindhamStudies.create({
				title     : 'Study',
				date      : '1/29/2023',
				source    : 'link to study',
				objective : 'to test it'
			});
			await WindhamStudiesCommodities.create(study.id);
		} catch (e) {
			expect(e).toBeTruthy();
			expect(e.status).toBe(404);
			expect(e.message).toBe('Please pick a study');
		}
	});
});

describe('getByStudyId', function() {
	test('it works', async function() {
		const study = await WindhamStudies.create({
			title     : 'Study1',
			date      : '1/29/2023',
			source    : 'link to study',
			objective : 'to test it'
		});
		const commodity1 = await Commodity.create({
			commodityName  : 'Test Commodity',
			variety        : 'Test',
			scientificName : 'Test',
			coolingMethod  : 'Test',
			climacteric    : true
		});
		const commodity2 = await Commodity.create({
			commodityName  : 'Test Commodity2',
			variety        : 'Test2',
			scientificName : 'Test2',
			coolingMethod  : 'Test2',
			climacteric    : true
		});
		const data1 = { studyId: study.id, commodityId: commodity1.id };
		const data2 = { studyId: study.id, commodityId: commodity2.id };
		await WindhamStudiesCommodities.create(data1);
		await WindhamStudiesCommodities.create(data2);

		const res = await WindhamStudiesCommodities.getByStudyId(study.id);

		expect(res.length).toEqual(2);

		expect(res[0].commodityId).toEqual(commodity1.id);
		expect(res[1].commodityId).toEqual(commodity2.id);
	});
	test('it fails with bad study id', async function() {
		try {
			// 'id' is from commodity created in _testModelsCommon.js
			await WindhamStudiesCommodities.getByStudyId({ studyId: 'bad id', commodutyId: 'id' });
		} catch (e) {
			expect(e.status).toBe(400);
			expect(e instanceof BadRequestError).toBeTruthy();
		}
	});
});

describe('getByCommodityId', function() {
	test('it works', async function() {
		const study1 = await WindhamStudies.create({
			title     : 'Study1',
			date      : '1/29/2023',
			source    : 'link to study',
			objective : 'to test it'
		});
		const study2 = await WindhamStudies.create({
			title     : 'Study2',
			date      : '1/29/2023',
			source    : 'link to study',
			objective : 'to test it'
		});
		const commodity = await Commodity.create({
			commodityName  : 'Test Commodity',
			variety        : 'Test',
			scientificName : 'Test',
			coolingMethod  : 'Test',
			climacteric    : true
		});

		const data1 = { studyId: study1.id, commodityId: commodity.id };
		const data2 = { studyId: study2.id, commodityId: commodity.id };
		await WindhamStudiesCommodities.create(data1);
		await WindhamStudiesCommodities.create(data2);

		const res = await WindhamStudiesCommodities.getByCommodityId(commodity.id);

		expect(res.length).toEqual(2);

		expect(res[0].studyId).toEqual(study1.id);
		expect(res[1].studyId).toEqual(study2.id);
	});
	test('it fails with bad commodity id', async function() {
		try {
			const study1 = await WindhamStudies.create({
				title     : 'Study1',
				date      : '1/29/2023',
				source    : 'link to study',
				objective : 'to test it'
			});
			await WindhamStudiesCommodities.getByCommodityId({ studyId: study1.id, commodityId: 'badCommodityId' });
		} catch (e) {
			expect(e).toBeTruthy();
		}
	});
});
