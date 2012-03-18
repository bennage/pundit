// repo = mspnp/cqrs-journey-doc

function initialize(https, repo) {

	https.get({
		host: 'api.github.com',
		path: '/repos/' + repo + '/git/commits/' + commit
	}, function(res) {

		if (res.statusCode !== 200) {
			console.log("statusCode: ", res.statusCode);
			console.log("headers: ", res.headers);
		}

		var buffer = '';
		res.on('data', function(d) {
			buffer += d;
			console.log('.');
		});

		res.on('end', function() {
			console.log('DONE!');
			var o = JSON.parse(buffer);
			getTree(o.tree.sha);
		});

	}).on('error', function(e) {
		console.error(e);
	});

}

module.exports = initialize;