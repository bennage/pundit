var assert = require('assert'),
	initialize = require('../init.js');

module.exports = {

	'init looks in provided path': function() {

		var fs = {
			readdirSync: function(path) {

				assert.equal('some/path', path);

				return {
					forEach: function() {}
				};
			}
		};

		initialize(fs, {}, 'some/path');
	},

	'init ignores files that are not markdown': function() {

		var fs = {
			readdirSync: function(path) {
				return ['some.random.file'];
			}
		};

		var markdown = {
			toHTML: function() {
				throw new Error('should not be processing file');
			}
		};

		initialize(fs, markdown, 'some/path');
	},

	'init processes files that are markdown': function() {

		var fs = {
			readdirSync: function(path) {
				return ['some.markdown'];
			},
			readFileSync: function() {
				return 'some content';
			},
			writeFileSync: function() {}
		};

		var markdown = {
			toHTML: function(input) {
				assert.equal('some content', input);
			}
		};

		initialize(fs, markdown, 'some/path');
	},

	'init reads the file from the correct path': function() {

		var fs = {
			readdirSync: function(path) {
				return ['some.markdown'];
			},
			readFileSync: function(path) {
				assert.equal(path, 'some/path/some.markdown');
				return 'some content';
			},
			writeFileSync: function() {}
		};

		var markdown = {
			toHTML: function(input) {}
		};

		initialize(fs, markdown, 'some/path');
	},

	'init writes the file to the correct path': function() {

		var wrote = false;

		var fs = {
			readdirSync: function(path) {
				return ['some.markdown'];
			},
			readFileSync: function(path) {
				return 'some content';
			},
			writeFileSync: function(path, content) {
				assert.equal(path, 'some/path/some.html');
				wrote = true;
			}
		};

		var markdown = {
			toHTML: function(input) {}
		};

		initialize(fs, markdown, 'some/path');

		assert(wrote, 'did not write html file');
	}
};
