module.exports = function(fs, marked) {

	fs = fs || require('fs');
	marked = marked || require('marked');
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

	return function(source, target, rootUrl) {

		function toHTML(file) {
			fs.readFile(source + '/' + file, 'utf8', function(err, input) {
				var i = convertImageRefs(input);
				var output = marked(i);
				console.log('=> ' + file);
				fs.writeFile(target + '/' + file.replace('.markdown', '.html'), output);
			});
		}

		function convertImageRefs(content) {
			var re = /(\[\w+\]:\s+)(http)?(.+)/g;
			var revised = content.replace(re, function($0, $1, $2, $3) {
				return $2 ? $0 : $1 + rootUrl + $3;
			});
			return revised;
		}

		ensureDirectory(target, function() {
			fs.readdir(source, function(err, files) {
				files.forEach(toHTML);
			});
		});
	};
};
