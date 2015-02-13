var DocumentClient = require('documentdb-q-promises').DocumentClientWrapper;

var host = process.env.PUNDIT_DOCDB_ENDPOINT;
var masterKey = process.env.PUNDIT_DOCDB_KEY;

console.log('host ' + host);
console.log('masterKey ' + masterKey);

var client = new DocumentClient(host, { masterKey: masterKey });

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
