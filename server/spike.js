var DocumentClient = require('documentdb-q-promises').DocumentClientWrapper;
var Q = require('q');

require('6to5/register')

var Repository = require('./Repository').Repository;

var host = process.env.PUNDIT_DOCDB_ENDPOINT;
var masterKey = process.env.PUNDIT_DOCDB_KEY;

console.log('host ' + host);
console.log('masterKey ' + masterKey);

var client = new DocumentClient(host, { masterKey: masterKey });

var repo = new Repository(client);

var collectionDefinition = { id: '0a2ac7598e1cf74237c0aa80d8f965817d4bc1e5' };
var documentDefinition = {
    author: 'bennage',
    line: 42,
    content: 'a comment'
    };

repo.databaseExists('test')
    .then(function(response) {
        if(response.exists){
            return repo
                .collectionExists(response.database._self, 'blob_id')
                .then(function(response){
                    console.dir(response);
                });
        };
    })
    .catch(function(err){
        console.log('ERROR!')
        console.dir(err);
    });

// deleteEverything(client).done(function(results){
//     console.log('all deleted');
// });

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
