var fs = require('fs'),
	path = require('path');

// yes, sync is evil!

var data_file = './data/data',
	hash_table = loadSync();

console.log('reading data from file');
console.dir(hash_table);

function getCommentsFor(documentId, callback) {

	if (!hash_table[documentId]) {
		hash_table[documentId] = {};
	}

	callback(null, hash_table[documentId]);
}

function saveCommentFor(documentId, comment) {
	if (!hash_table[documentId]) {
		hash_table[documentId] = {};
	}

	if (!comment.id) throw new Error('cannot save a comment without an id');

	hash_table[documentId][comment.id] = comment;

	persist();
}

function persist() {
	var data = JSON.stringify(hash_table);
	fs.writeFile(data_file, data, 'utf8');
}

function loadSync() {
	if (path.existsSync(data_file)) {
		var data = fs.readFileSync(data_file, 'utf8');
		return JSON.parse(data);
	} else {
		return {};
	}
}

module.exports = {
	saveCommentFor: saveCommentFor,
	getCommentsFor: getCommentsFor
};