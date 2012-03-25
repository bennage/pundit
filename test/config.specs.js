var assert = require('assert');

var config = require('../lib/config');

// specifications indicating what the application
// expects to find in the configuration file
module.exports = {

	'AZURE_STORAGE_ACCOUNT': function() {
		// the name of the Azure storage account
		assert.equal(typeof config.AZURE_STORAGE_ACCOUNT, 'string');
	},

	'AZURE_STORAGE_ACCESS_KEY': function() {
		// the primary access key of the Azure storage account
		assert.equal(typeof config.AZURE_STORAGE_ACCESS_KEY, 'string');
	},

	'administrators': function() {
		// an array containing the ids of the administrators
		// there should be at least one administrator
		// ids are in the form [provider]__[username]
		// e.g., github__bennage
		assert.ok(config.administrators.length > 0);
	},

	'source.repo': function() {
		// the name of the github repository 
		// in the form of [username]/[reponame]
		// or similarly [organization]/[reponame]
		assert.ok(config.source);
		assert.equal(typeof config.source.repo, 'string');
	},

	'source.ignore': function() {
		// an array of files to be ignore in the repo
		// e.g., ['.gitignore','readme.md']
		// if no files are ignored, provide empty array []
		assert.ok(config.source);
		assert.ok(config.source.ignore);
		assert.ok(config.source.ignore.length);
	},

	'github auth': function() {
		// required for github authenticaton
		assert.equal(typeof config.github.appId, 'string');
		assert.equal(typeof config.github.appSecret, 'string');
	},

	'facebook auth': function() {
		// required for facebook authenticaton
		assert.equal(typeof config.facebook.appId, 'string');
		assert.equal(typeof config.facebook.appSecret, 'string');
	},

	'twitter auth': function() {
		// required for twitter authenticaton
		assert.equal(typeof config.twitter.consumerKey, 'string');
		assert.equal(typeof config.twitter.consumerSecret, 'string');
	}
};
