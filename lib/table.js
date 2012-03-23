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
  });

  client.updateEntity(tableName, settings, function(err) {
    if (callback) callback();
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
  }
};
