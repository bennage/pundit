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

		var userId = req.context.user.__pundit_id__;

		comment.id = userId + ':' + comment.path;
		comment.when = Date.now();

		comment.author_login = userId;
		comment.author_name = req.context.user.username;
		comment.author_avatar_url = req.context.user.__pundit_avatar_url__;
		comment.handled = false;

		store.saveCommentFor(documentId, comment);

		res.send(200);
	},

	handleComment: function(req, res) {
		var documentId = req.params.file,
			hash = req.params.commentId;

		// only an admin can set this flag
		if (req.context.user.__pundit_role__ !== 'admin') {
			res.send(403);
		}

		store.handleComment(documentId, req.context.user.__pundit_id__ + hash);

		res.send(200);
	},

	deleteComment: function(req, res) {
		var documentId = req.params.file,
			hash = req.params.commentId;

		// only an admin can set this flag
		if (req.context.user.__pundit_role__ !== 'admin') {
			res.send(403);
		}

		store.deleteComment(documentId, req.context.user.__pundit_id__ + hash);

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
