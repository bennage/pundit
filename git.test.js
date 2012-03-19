var assert = require('assert');
var https = require('https');
var fs = require('fs');

var repo = '/mspnp/cqrs-journey-doc/';
var output_path = './source/';

function https_get(options, success) {
	return https.get(options, function(res) {
		if (res.statusCode !== 200) {
			console.log('statusCode: ', res.statusCode);
			console.log('headers: ', res.headers);
		} else {
			success(res);
		}
	}).on('error', function(e) {
		console.error(e);
	});
}

function git(options, next) {
	https_get(options, function(res) {
		var buffer = '';

		res.on('data', function(d) {
			buffer += d;
		});

		res.on('end', function() {
			next(null, buffer);
		});
	});
}

function downloadBlob(blob) {

	var path = repo + blob.branch + '/' + blob.path;
	var root = 'raw.github.com';

	console.log(root + path);

	git({
		host: root,
		path: path
	}, function(err, buffer) {
		console.log('writing ' + blob.path);
		fs.writeFile(output_path + blob.path, buffer);
	});
}

function getTree(sha, branch) {
	git({
		host: 'api.github.com',
		path: '/repos' + repo + 'git/trees/' + sha + '?recursive=1'
	}, function(err, buffer) {

		var o = JSON.parse(buffer);

		o.tree.filter(function(x) {
			console.dir(x);
			return x.type === 'blob';
		}).map(function(x) {
			return {
				sha: x.sha,
				path: x.path,
				branch: branch
			};
		}).forEach(downloadBlob);

		// o.tree.filter(function(x) {
		// 	return x.type === 'tree';
		// }).forEach(function(x) {
		// 	getTree(x.sha, branch);
		// });

	});
}

function getCommit(commit) {

	git({
		host: 'api.github.com',
		path: '/repos' + repo + 'git/commits/' + commit
	}, function(err, buffer) {
		var o = JSON.parse(buffer);
		getTree(o.tree.sha, commit);
	});
}

git({
	host: 'api.github.com',
	path: '/repos' + repo + 'git/refs/heads/master'
}, function(err, buffer) {
	var o = JSON.parse(buffer);
	getCommit(o.object.sha);
});
