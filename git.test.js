var assert = require('assert');
var https = require('https');
var fs = require('fs');

var repo = '/mspnp/cqrs-journey-doc/';

function get(options, success) {
	return https.get(options, function(res) {
		if (res.statusCode !== 200) {
			console.log("statusCode: ", res.statusCode);
			console.log("headers: ", res.headers);
		} else {
			success(res);
		}
	}).on('error', function(e) {
		console.error(e);
	});
}

function downloadBlob(blob) {

	var path = repo + blob.branch + '/' + blob.path;
	var root = 'raw.github.com';

	console.log(root + path);

	get({
		host: root,
		path: path
	}, function(res) {

		var buffer = '';

		res.on('data', function(d) {
			buffer += d;
			console.log('+');
		});

		res.on('end', function() {
			console.log('writing ' + blob.path);
			fs.writeFile('./source/' + blob.path, buffer);
		});
	});
}

function getTree(sha, branch) {
	get({
		host: 'api.github.com',
		path: '/repos' + repo + 'git/trees/' + sha
	}, function(res) {

		var buffer = '';
		res.on('data', function(d) {
			buffer += d;
		});

		res.on('end', function() {
			var o = JSON.parse(buffer);

			o.tree.filter(function(x) {
				return x.path.indexOf('.markdown') !== -1;
			}).map(function(x) {
				return {
					sha: x.sha,
					path: x.path,
					branch: branch
				};
			}).forEach(downloadBlob);

		});
	});
}

function getCommit(commit) {

	get({
		host: 'api.github.com',
		path: '/repos' + repo + 'git/commits/' + commit
	}, function(res) {

		var buffer = '';
		res.on('data', function(d) {
			buffer += d;
		});

		res.on('end', function() {
			var o = JSON.parse(buffer);
			getTree(o.tree.sha, commit);
		});

	});
}

get({
	host: 'api.github.com',
	path: '/repos' + repo + 'git/refs/heads/master'
}, function(res) {

	var buffer = '';
	res.on('data', function(d) {
		buffer += d;
	});

	res.on('end', function() {
		var o = JSON.parse(buffer);
		getCommit(o.object.sha);
	});

});
