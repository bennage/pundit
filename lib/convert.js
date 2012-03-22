module.exports = function(fs, marked, path) {

	fs = fs || require('fs');
	marked = marked || require('marked');
	path = path || require('path');

	marked.setOptions({
		gfm: true
	});

	function ensureDirectory(folder, callback) {
		fs.stat(folder, function(err, stats) {
			if (err) {
				fs.mkdir(folder, '0777', callback);
			} else {
				callback(null);
			}
		});
	}

	return function(source, target, rootUrl, callback) {

		function toHTML(file, callback) {
			fs.readFile(source + '/' + file, 'utf8', function(err, input) {
				var file_path = path.join(target, file.replace('.markdown', '.html'));
				var i = convertImageRefs(input);
				var output = marked(i);
				console.log('=> ' + file);
				fs.writeFile(file_path, output, callback);
			});
		}

		function convertImageRefs(content) {
			var re = /(\[\w+\]:\s+)(http)?(.+)/g;
			var revised = content.replace(re, function($0, $1, $2, $3) {
				return $2 ? $0 : $1 + rootUrl + $3;
			});
			return revised;
		}

		var counter = 0;

		ensureDirectory(target, function() {
			console.log('attempting to read ' + source);
			fs.readdir(source, function(err, files) {
				if(err || !files){
					console.dir(err || 'no files in ' + source);
					callback();
					return;
				}
				files.forEach(function(file) {
					counter++;
					toHTML(file, function() {
						counter--;
						if (counter === 0) {
							callback();
						}
					});
				});
			});
		});
	};
};
