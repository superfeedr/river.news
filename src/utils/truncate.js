module.exports = function truncate(string, length, ellips) {
	if(typeof(ellips) != 'string')
		ellips = '...';

	if(typeof(length) != 'number')
		length = 100;

	var trimmed = string.substr(0, length);
	trimmed = trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(' ')));

	if(trimmed.length != string.length && trimmed.length > 0)
		return trimmed + ellips;

	return trimmed;
}