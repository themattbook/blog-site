const { DateTime } = require('luxon');

module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy('./src/style-light.css');
	eleventyConfig.addPassthroughCopy('./src/assets');
	eleventyConfig.addPassthroughCopy('./src/starfield.js');

	eleventyConfig.addFilter('postDate', (dateObj) => {
		return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
	});

	eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

	return {
		dir: {
			input: 'src',
			output: 'public',
		},
	};
};
