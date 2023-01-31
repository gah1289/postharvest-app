'use strict';

const db = require('../db.js');
const User = require('../models/user');
const Commodity = require('../models/commodity');
const Ethylene = require('../models/ethylene');
const Respiration = require('../models/respiration');
const ShelfLife = require('../models/shelfLife');
const Temperature = require('../models/temperature');
const References = require('../models/references');
const WindhamStudies = require('../models/studies');
const WindhamStudiesCommodities = require('../models/studiesCommodities');
const { createToken } = require('../helpers/tokens');

async function commonBeforeAll() {
	// noinspection SqlWithoutWhere
	await db.query('DELETE FROM users');
	await db.query('DELETE FROM commodities');
	await db.query('DELETE FROM ethylene_sensitivity');
	await db.query('DELETE FROM shelf_life');
	await db.query('DELETE FROM respiration_rates');
	await db.query('DELETE FROM temperature_recommendations');
	await db.query('DELETE FROM refs');
	await db.query('DELETE FROM windham_studies');
	await db.query('DELETE FROM windham_studies_commodities');
	// noinspection SqlWithoutWhere

	await Commodity.create({
		id             : 'id',
		commodityName  : 'Test Commodity',
		variety        : 'Test',
		scientificName : 'Test',
		coolingMethod  : 'Test',
		climacteric    : true
	});
	await Commodity.create({
		commodityName  : 'Test Commodity2',
		variety        : 'Test2',
		scientificName : 'Test2',
		coolingMethod  : 'Test2',
		climacteric    : true
	});
	await References.create('id', {
		source : 'website'
	});

	await Ethylene.create('id', {
		temperature    : '20',
		c2h4Production : '10',
		c2h4Class      : 'low'
	});
	await Respiration.create('id', {
		temperature : '10',
		rrRate      : '20-40',
		rrClass     : 'high'
	});
	await ShelfLife.create('id', {
		temperature : '0',
		shelfLife   : '1 day',
		description : 'test',
		packaging   : 'test'
	});
	await Temperature.create('id', {
		minTemp     : '5',
		optimumTemp : '10',
		description : 'test',
		rh          : '90'
	});
	const study1 = await WindhamStudies.create({
		title     : 'Test Study',
		date      : '1/29/2023',
		source    : 'link to study',
		objective : 'to test it'
	});
	await WindhamStudies.create({
		title     : 'Test Study 2',
		date      : '1/29/2023',
		source    : 'another link to study',
		objective : 'to test it'
	});

	await WindhamStudiesCommodities.create({ studyId: study1.id, commodityId: 'id' });
	// await Company.create({
	// 	handle       : 'c1',
	// 	name         : 'C1',
	// 	numEmployees : 1,
	// 	description  : 'Desc1',
	// 	logoUrl      : 'http://c1.img'
	// });
	// await Company.create({
	// 	handle       : 'c2',
	// 	name         : 'C2',
	// 	numEmployees : 2,
	// 	description  : 'Desc2',
	// 	logoUrl      : 'http://c2.img'
	// });
	// await Company.create({
	// 	handle       : 'c3',
	// 	name         : 'C3',
	// 	numEmployees : 3,
	// 	description  : 'Desc3',
	// 	logoUrl      : 'http://c3.img'
	// });

	// testJobIds[0] = (await Job.create({ title: 'J1', salary: 1, equity: '0.1', companyHandle: 'c1' })).id;
	// testJobIds[1] = (await Job.create({ title: 'J2', salary: 2, equity: '0.2', companyHandle: 'c1' })).id;
	// testJobIds[2] = (await Job.create({ title: 'J3', salary: 3, /* equity null */ companyHandle: 'c1' })).id;

	await User.register({
		username  : 'u1',
		firstName : 'U1F',
		lastName  : 'U1L',
		jobTitle  : 'test',
		email     : 'user1@user.com',
		password  : 'password1',
		isAdmin   : false
	});
	await User.register({
		username  : 'u2',
		firstName : 'U2F',
		lastName  : 'U2L',
		jobTitle  : 'test',
		email     : 'user2@user.com',
		password  : 'password2',
		isAdmin   : false
	});
	await User.register({
		username  : 'u3',
		firstName : 'U3F',
		lastName  : 'U3L',
		jobTitle  : 'test',
		email     : 'user3@user.com',
		password  : 'password3',
		isAdmin   : false
	});

	// await User.applyToJob('u1', testJobIds[0]);
}

async function commonBeforeEach() {
	await db.query('BEGIN');
}

async function commonAfterEach() {
	await db.query('ROLLBACK');
}

async function commonAfterAll() {
	await db.end();
}

const u1Token = createToken({ username: 'u1', isAdmin: false });
const u2Token = createToken({ username: 'u2', isAdmin: false });
const adminToken = createToken({ username: 'admin', isAdmin: true });

module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	u1Token,
	u2Token,
	adminToken
};
