module.exports = function(fs, https) {

	fs = fs || require('fs');
	https = https || require('https');

	var raw_root = 'raw.github.com',
		api_root = 'api.github.com';

	// var repo = '/mspnp/cqrs-journey-doc/';
	// var output_path = './source/';
	// var ignore = ['.gitignore', 'Copyright.markdown', 'LICENSE.txt', 'README.markdown'];
	return function(repo, output_path, ignore, callback) {

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
				if (callback) callback(e);
			});
		}

		function git(options, next) {
			https_get(options, function(res) {
				var buffer = '';

				res.on('data', function(chunk) {
					buffer += chunk;
				});

				res.on('end', function() {
					next(null, buffer);
				});
			});
		}

		function downloadBlob(blob) {

			var path = repo + blob.branch + '/' + blob.path;

			git({
				host: raw_root,
				path: path
			}, function(err, buffer) {
				fs.writeFile(output_path + blob.path, buffer, 'binary');
			});
		}

		function getTree(sha, branch) {

			var recurse = false;

			git({
				host: api_root,
				path: '/repos' + repo + 'git/trees/' + sha + (recurse ? '?recursive=1' : '')
			}, function(err, buffer) {

				var o = JSON.parse(buffer);

				o.tree.filter(function(x) {
					return x.type === 'blob' && x.path.indexOf('.markdown' !== -1) && !ignore.some(function(i) {
						return x.path.indexOf(i) > -1;
					});
				}).map(function(x) {
					return {
						sha: x.sha,
						path: x.path,
						size: x.size,
						branch: branch
					};
				}).forEach(downloadBlob);
			});
		}

		function getCommit(commit) {

			git({
				host: api_root,
				path: '/repos' + repo + 'git/commits/' + commit
			}, function(err, buffer) {
				var o = JSON.parse(buffer);
				getTree(o.tree.sha, commit);
			});
		}

		git({
			host: api_root,
			path: '/repos' + repo + 'git/refs/heads/master'
		}, function(err, buffer) {
			
			var o = JSON.parse(buffer),
				sha = o.object.sha;

			getCommit(sha);

			if (callback) callback(null, sha);
		});
	};
};
