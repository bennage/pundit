var github = require('./lib/github')(),
	config = require('./lib/config');

github(config.source.repo, './source/', config.source.ignore, function(err, sha) {
	console.log(sha);
});
