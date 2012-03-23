module.exports = function(fs, marked, path) {

	fs = fs || require('fs');
	marked = marked || require('marked');
	path = path || require('path');

	marked.setOptions({
		gfm: true
	});

	var ref_pattern = /(\[\w+\]:\s+)(http)?(.+)/g;


	function ensureDirectory(folder, callback) {

		//todo: switch to use the path.exists api
		fs.stat(folder, function(err, stats) {
			if (err) {
				fs.mkdir(folder, '0777', callback);
			} else {
				callback(null);
			}
		});
	}

	return function(source, target, rootUrl, callback) {

		var counter = 0,
			output = [];

		function toHTML(file, callback) {
			fs.readFile(source + '/' + file, 'utf8', function(err, input) {

				var file_path = path.join(target, file.replace('.markdown', '.html'));
				var output = marked(convertImageRefs(input));

				console.log('=> ' + file);

				fs.writeFile(file_path, output, function(err) {
					callback(err, {
						name: file.replace('.markdown', '.doc'),
						content: output
					});
				});
			});
		}

		function convertImageRefs(content) {
			return content.replace(ref_pattern, function($0, $1, $2, $3) {
				return $2 ? $0 : $1 + rootUrl + $3;
			});
		}

		function convert(file) {
			counter++;
			toHTML(file, function(err, fileInfo) {

				output.push(fileInfo);

				counter--;
				if (counter === 0) {
					callback(null, output);
				}
			});
		}

		ensureDirectory(target, function() {
			fs.readdir(source, function(err, files) {
				if (err || !files) {
					console.dir(err || 'no files in ' + source);
					callback();
					return;
				}
				files.forEach(convert);
			});
		});
	};
};
