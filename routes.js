var fs = require('fs');
var markdown = require("markdown").markdown;
var db = require('./data');

module.exports = {

	index: function(req, res) {
		var files = fs.readdirSync('./source');
		res.render('index', {
			files: files
		});
	},

	saveComment: function(req, res) {
		var documentId = req.params.file,
			comment = req.body;

		var name = req.context.user.name;

		comment.id = name + ':' + comment.path;
		comment.timestamp = Date.now();

		comment.author = {
			login: req.context.user.login,
			name: name,
			gravatar_id: req.context.user.gravatar_id
		};

		db.saveCommentFor(documentId, comment);

		res.send(200);
	},

	getComments: function(req, res) {
		var file = req.params.file;
		db.getCommentsFor(file, function(err, data) {
			res.send(data);
		});
	},

	getDocuments: function(req, res) {
		fs.readdir('./source/', function(err, files) {
			var html = files.filter(function(x) {
				return x.indexOf('.html') !== -1;
			});
			res.send(html);
		});
	},

	getDocument: function(req, res) {
		var file = req.params.file;
		var content = fs.readFileSync('./source/' + file, 'utf8');
		res.send({
			content: content
		});
	}
};