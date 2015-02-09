var DocumentClient = require('documentdb-q-promises').DocumentClientWrapper;
var Q = require('q');

var host = process.env.PUNDIT_DOCDB_ENDPOINT;
var masterKey = process.env.PUNDIT_DOCDB_KEY;

var client = new DocumentClient(host, { masterKey: masterKey });

var collectionDefinition = { id: '0a2ac7598e1cf74237c0aa80d8f965817d4bc1e5' };
var documentDefinition = {
    author: 'bennage',
    line: 42,
    content: 'a comment'
    };

function databaseExists(id) {

    var query = 'SELECT * FROM x WHERE x.id = "' + id + '"';

    return client.queryDatabases(query)
        .executeNextAsync()
        .then(function(response){

            found = response.feed.length === 1;

            return {
                exists: found,
                database: found ? response.feed[0] : undefined
            };
        });
}

function createDatabaseIfNotExists(id){
    return databaseExists(id)
        .then(function(response){
            return response.exists
                ? Q(response.database)
                : client
                    .createDatabaseAsync({ id: id })
                    .then(function(databaseResponse) {
                        return Q(databaseResponse.resource);
                    });
        });
}

function collectionExists(databaseLink, id) {

    var query = 'SELECT * FROM x WHERE x.id = "' + id + '"';

    return client.queryCollections(databaseLink, query)
        .executeNextAsync()
        .then(function(response){

            found = response.feed.length === 1;
            return {
                exists: found,
                collection: found ? response.feed[0] : undefined
            };
        });
}

// createDatabaseIfNotExists('owner/repoA')
//     .then(function(database){
//         return collectionExists(database._self, 'blob_sha');
//     })
//     .then(function(response){
//         console.log('response');
//         console.dir(response);
//     })
//     .fail(function(error){
//         console.log('error');
//         console.log(error);
//     });

deleteEverything(client).done(function(results){
    console.log('all deleted');
});

function deleteEverything(client) {

    var query = 'SELECT * FROM x';

    return client.queryDatabases(query)
        .executeNextAsync()
        .then(function(response){

            var promises = response.feed
                .map(function(db){
                    console.log('deleting ' + db.id);
                    return client.deleteDatabaseAsync(db._self);
                });

            return Q.allSettled(promises);
        });
}
