var viewhelpers = require('../lib/viewhelpers'),
	assert = require('assert');

// this function represents a standard pattern
// for testing all of the view helpers

function testHelper(assertion) {
	var helpers;

	var app = {
		dynamicHelpers: function($helpers) {
			helpers = $helpers;
		}
	};

	viewhelpers.initialize(app);

	assertion(helpers);
}

module.exports = {

	'helper exposes request': function() {
		testHelper(function(helper) {

			var request = {};
			var output = helper.request(request);

			assert.strictEqual(request, output);
		});
	},

	'helper exposes user when present': function() {
		testHelper(function(helper) {
			var user = {};
			var request = {
				context: {
					user: user
				}
			};

			var output = helper.user(request);
			assert.strictEqual(user, output);
		});
	},

	'helper exposing users returns null when user is missing': function() {
		testHelper(function(helper) {
			var request = {
				context: {}
			};

			var output = helper.user(request);
			assert.strictEqual(null, output);
		});
	},

	'helper exposing users returns null when context is missing': function() {
		testHelper(function(helper) {
			var request = {};

			var output = helper.user(request);
			assert.strictEqual(null, output);
		});
	},

	'helper exposes the pundit-specific login when user is present': function() {
		testHelper(function(helper) {

			var request = {
				context: {
					user: {
						__pundit_id__: 'some_user'
					}
				}
			};

			var output = helper.login(request);
			assert.strictEqual('some_user', output);
		});
	}
};
