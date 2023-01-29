'use strict';

const db = require('../db.js');
const User = require('../models/user');
const Commodity = require('../models/commodity');
const Ethylene = require('../models/ethylene');
const Respiration = require('../models/respiration');
const ShelfLife = require('../models/shelfLife');
const Temperature = require('../models/temperature');
const { createToken } = require('../helpers/tokens');

async function commonBeforeAll() {
	// noinspection SqlWithoutWhere
	await db.query('DELETE FROM users');
	await db.query('DELETE FROM commodities');
	await db.query('DELETE FROM ethylene_sensitivity');
	await db.query('DELETE FROM shelf_life');
	await db.query('DELETE FROM respiration_rates');
	await db.query('DELETE FROM temperature_recommendations');

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
