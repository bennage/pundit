var store = require('./table');

module.exports = {

	index: function(req, res) {
		res.render('index', {
			files: store.fileNames()
		});
	},

	saveComment: function(req, res) {
		var documentId = req.params.file,
			comment = req.body;

		var name = req.context.user.name;

		comment.id = name + ':' + comment.path;
		comment.timestamp = Date.now();

		comment.author_login = req.context.user.login;
		comment.author_name = name;
		comment.author_gravatar_id = req.context.user.gravatar_id;

		store.saveCommentFor(documentId, comment);

		res.send(200);
	},

	getComments: function(req, res) {
		var file = req.params.file;
		store.getCommentsFor(file, function(err, data) {
			res.send(data);
		});
	},

	getDocuments: function(req, res) {
		res.send(store.fileNames());
	},

	getDocument: function(req, res) {
		var file = req.params.file;
		res.json({
			content: store.contentFor(file)
		});
	},

	'export': function(req, res) {
		// fs.readFile('./data/data', 'utf8', function(err, content) {
		// 	res.json(JSON.parse(content));
		// });
	}
};
