const { BadRequestError } = require('../expressError');

function getCommodityId(commodityName, variety) {
	// generate and return a commodity id using the commodity name and variety
	// commodity name: lettuce, variety: romaine, return LET-ROM
	if (!commodityName) throw new BadRequestError('No commodity name');
	// Generate random 4 digit number to avoid duplicate id's
	const randomInt = Math.floor(1000 + Math.random() * 9000);
	// remove spaces from commodity name, generate first half of ID with first 3 letters of commodity name.
	// If commodity name <3 letters, first half = commodity name
	// If there is no variety, id= first 6 letters of commodity name.
	commodityName = commodityName.replace(' ', '');

	let cName;
	let cVar;

	if (commodityName.length < 3) {
		cName = commodityName.toUpperCase();
	}
	else {
		cName = commodityName.substring(0, 3).toUpperCase();
	}

	if (!variety) {
		return `${commodityName.substring(0, 6).toUpperCase()}-${randomInt}`;
	}
	// remove spaces from variety, generate second half of ID with first 3 letters of variety
	// if variety is < 3 letters, first half=variety
	variety = variety.replace(' ', '');
	if (variety.length < 3) {
		cVar = variety.toUpperCase();
	}
	else {
		cVar = variety.substring(0, 3).toUpperCase();
	}

	return `${cName}-${cVar}-${randomInt}`;
}

module.exports = { getCommodityId };
