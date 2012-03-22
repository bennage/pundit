module.exports = function(fs, https, path) {

	fs = fs || require('fs');
	https = https || require('https');
	path = path || require('path');

	var raw_root = 'raw.github.com',
		api_root = 'api.github.com';

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

		function downloadBlob(blob, callback) {
			
			var file_path = path.join(output_path, blob.path);

			git({
				host: raw_root,
				path: repo + blob.branch + '/' + blob.path
			}, function(err, buffer) {
				fs.writeFile(file_path, buffer, 'binary', callback);
			});
		}

		function getTree(sha, branch, callback) {

			var recurse = false;

			git({
				host: api_root,
				path: '/repos' + repo + 'git/trees/' + sha + (recurse ? '?recursive=1' : '')
			}, function(err, buffer) {

				var o = JSON.parse(buffer);
				var counter = 0;

				o.tree.filter(function(x) {
					return x.type === 'blob' && x.path.indexOf('.markdown' !== -1) && !ignore.some(function(i) {
						return x.path.indexOf(i) > -1;
					});
				}).map(function(x) {
					counter++;
					return {
						sha: x.sha,
						path: x.path,
						size: x.size,
						branch: branch
					};
				}).forEach(function(x) {
					downloadBlob(x, function(err) {
						counter--;
						if (counter === 0) {
							callback();
						}
					});
				});
			});
		}

		function getCommit(commit, callback) {

			git({
				host: api_root,
				path: '/repos' + repo + 'git/commits/' + commit
			}, function(err, buffer) {
				var o = JSON.parse(buffer);
				getTree(o.tree.sha, commit, callback);
			});
		}

		git({
			host: api_root,
			path: '/repos' + repo + 'git/refs/heads/master'
		}, function(err, buffer) {

			var o = JSON.parse(buffer),
				sha = o.object.sha;

			getCommit(sha, function() {
				if (callback) callback(null, sha);
			});
		});
	};
};
