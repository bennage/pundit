var uuid = require('node-uuid'),
  azure = require('azure');

var settings = {},
  fileNames = [],
  fileContents = {};

var service = azure.ServiceClient,
  TableQuery = azure.TableQuery;

var partition = 'part1';
var tableName = 'config';
var rowKey = 'default';

var client = azure.createTableService(service.DEVSTORE_STORAGE_ACCOUNT, service.DEVSTORE_STORAGE_ACCESS_KEY, service.DEVSTORE_TABLE_HOST);

function load(callback) {

  var configQuery = TableQuery.select().from(tableName);

  client.queryEntity(tableName, partition, rowKey, function(err, data) {
    if (err) {
      console.log(err.message);
    } else {
      settings = data;
    }
    callback(err);
  });
}

function update(data, callback) {
  settings.sha = data.sha;

  data.files.forEach(function(item) {
    fileNames.push(item.name);
    fileContents[item.name] = item.content;
    createTableFor(item.name);
  });

  client.updateEntity(tableName, settings, function(err) {
    if (callback) callback();
  });
}

function getTableName(file) {
  return file.toLowerCase().replace(/[^a-z0-9]|\.doc/g, '') + settings.sha.substr(0, 8);
}

function createTableFor(file) {
  var table = getTableName(file);
  console.log('checking for ' + table);
  client.createTableIfNotExists(table, function(err, created) {
    console.dir(err);
    if (created) {
      console.log('created table ' + table);
    }
  });
}

function initialize(callback) {

  client.createTableIfNotExists(tableName, function(err, created) {
    if (created) {

      settings = {
        PartitionKey: partition,
        RowKey: rowKey,
        sha: null
      };

      client.beginBatch();

      client.insertEntity(tableName, settings);

      client.commitBatch(function() {
        console.log('created config table');
        callback(null);
      });
    } else {
      load(callback);
    }
  });
}

function saveCommentFor(file, comment) {

  var table = getTableName(file);

  comment.PartitionKey = partition;
  comment.RowKey = comment.hash;

  client.queryEntity(table, partition, comment.RowKey, function(err, result) {

    if (err && err.code === 'ResourceNotFound') {

      client.insertEntity(table, comment, function(err) {
        if (err) console.dir(err);
        console.log('comment saved');
      });

    } else {
      client.updateEntity(table, comment, function(err) {
        if (err) console.dir(err);
        console.log('comment updated');
      });
    }
  });
}

function handleComment(file, commentId) {
  var table = getTableName(file);

  client.queryEntity(table, partition, commentId, function(err, comment) {

    if (err && err.code === 'ResourceNotFound') {
      console.log('comment not found!');
    } else {
      comment.handled = true;
      client.updateEntity(table, comment, function(err) {
        if (err) console.dir(err);
        console.log('comment handled');
      });
    }
  });
}

function deleteComment(file, commentId) {
  var table = getTableName(file);

  client.queryEntity(table, partition, commentId, function(err, comment) {

    if (err && err.code === 'ResourceNotFound') {
      console.log('comment not found!');
    } else {
      comment.deleted = true;
      client.updateEntity(table, comment, function(err) {
        if (err) console.dir(err);
        console.log('comment marked as deleted');
      });
    }
  });
}

function getCommentsFor(file, callback) {
  var table = getTableName(file);
  var query = TableQuery.select().from(table);

  client.queryEntities(query, function(err, results) {
    if (err) return callback(err);

    callback(null, results.filter(function(x) {
      console.dir(x);
      return x.deleted !== true;
    }));
  });
}

module.exports = {
  initialize: initialize,
  update: update,
  data: function() {
    return settings;
  },
  fileNames: function() {
    return fileNames;
  },
  contentFor: function(file) {
    return fileContents[file];
  },
  saveCommentFor: saveCommentFor,
  getCommentsFor: getCommentsFor,
  handleComment: handleComment,
  deleteComment: deleteComment
};