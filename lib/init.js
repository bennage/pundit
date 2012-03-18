var ignore = ['Copyright.markdown', 'README.markdown'];

function initialize(fs, markdown, path) {
	// yes, sync is evil but this is a one-time startup
	var files = fs.readdirSync(path);

	files.forEach(function(file) {
		if (file.indexOf('.markdown') === -1) return;
		if (ignore.indexOf(file) !== -1) return;

		var input = fs.readFileSync(path + '/' + file, 'utf8');
		var output = markdown.toHTML(input);
		fs.writeFileSync(path + '/' + file.replace('.markdown', '.html'), output);
	});
}

module.exports = initialize;