module.exports = function(fs, markdown) {

	fs = fs || require('fs');
	markdown = markdown || require('markdown').markdown;

	function ensureDirectory(folder, callback) {
		fs.stat(folder, function(err, stats) {
			if (err) {
				fs.mkdir(folder, '0777', callback);
			} else {
				callback(null);
			}
		});
	}

	return function(source, target) {

		function toHTML(file) {
			fs.readFile(source + '/' + file, 'utf8', function(err, input) {
				var output = markdown.toHTML(input);
				fs.writeFile(target + '/' + file.replace('.markdown', '.html'), output);
			});
		}

		ensureDirectory(target, function() {
			fs.readdir(source, function(err, files) {
				files.forEach(toHTML);
			});
		});
	};
};
