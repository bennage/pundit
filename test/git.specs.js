var assert = require('assert');
var https = require('https');
var fs = require('fs');

module.exports = {

	'git': function(done) {

		function downloadBlob(blob) {

			var path = '/mspnp/cqrs-journey-doc/' + blob.branch + '/' + blob.path;
			var root = 'raw.github.com';

			console.log(root + path);

			https.get({
				host: root,
				path: path
			}, function(res) {

				if (res.statusCode !== 200) {
					console.log("statusCode: ", res.statusCode);
					console.log("headers: ", res.headers);
				}

				var buffer = '';
				res.on('data', function(d) {
					buffer += d;
					console.log('+');
				});

				res.on('end', function() {
					console.log('writing ' + blob.path);
					fs.writeFile('./source/' + blob.path, buffer);
					done();
				});

			}).on('error', function(e) {
				console.log(":-(");
				console.error(e);
				done();
			});
			// https.get({
			// 	host: 'api.github.com',
			// 	path: '/repos/mspnp/cqrs-journey-doc/git/blobs/' + blob.sha
			// }, function(res) {
			// 	if (res.statusCode !== 200) {
			// 		console.log("statusCode: ", res.statusCode);
			// 		console.log("headers: ", res.headers);
			// 	}
			// 	var buffer = '';
			// 	res.on('data', function(d) {
			// 		buffer += d;
			// 	});
			// 	res.on('end', function() {
			// 		var o = JSON.parse(buffer);
			// 		console.dir(o);
			// 		// fs.writeFileSync('./source/' + blob.path, o.content, 'utf16');
			// 	});
			// }).on('error', function(e) {
			// 	console.error(e);
			// });
		}

		function getTree(sha, branch) {
			https.get({
				host: 'api.github.com',
				path: '/repos/mspnp/cqrs-journey-doc/git/trees/' + sha
			}, function(res) {

				if (res.statusCode !== 200) {
					console.log("statusCode: ", res.statusCode);
					console.log("headers: ", res.headers);
				}

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

			}).on('error', function(e) {
				console.error(e);
			});
		}

		function getCommit(commit) {
			https.get({
				host: 'api.github.com',
				path: '/repos/mspnp/cqrs-journey-doc/git/commits/' + commit
			}, function(res) {

				if (res.statusCode !== 200) {
					console.log("statusCode: ", res.statusCode);
					console.log("headers: ", res.headers);
				}

				var buffer = '';
				res.on('data', function(d) {
					buffer += d;
				});

				res.on('end', function() {
					var o = JSON.parse(buffer);
					getTree(o.tree.sha, commit);
				});

			}).on('error', function(e) {
				console.error(e);
			});
		}

		https.get({
			host: 'api.github.com',
			path: '/repos/mspnp/cqrs-journey-doc/git/refs/heads/master'
		}, function(res) {

			if (res.statusCode !== 200) {
				console.log("statusCode: ", res.statusCode);
				console.log("headers: ", res.headers);
			}

			var buffer = '';
			res.on('data', function(d) {
				buffer += d;
			});

			res.on('end', function() {
				var o = JSON.parse(buffer);
				getCommit(o.object.sha);
			});

		}).on('error', function(e) {
			console.error(e);
		});
	}
};
