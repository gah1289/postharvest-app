const { getCommodityId } = require('./commodityId');

describe('getCommodityId', function() {
	test('works: variety >3 characters', function() {
		const result = getCommodityId('lettuce', 'romaine');
		expect(result).toEqual({
			id : 'LET-ROM'
		});
	});

	test('works: commodity name with no variety', function() {
		const result = getCommodityId('dragonfruit');
		expect(result).toEqual({
			id : 'DRAGON'
		});
	});
	test('works:  commodity name or variety < 3 letters', function() {
		const result = getCommodityId('c', 'v');
		expect(result).toEqual({
			id : 'C-V'
		});
	});
	test('works: removes spaces', function() {
		const result = getCommodityId('c ommodity name', 'v ariety');
		expect(result).toEqual({
			id : 'COM-VAR'
		});
	});
});
