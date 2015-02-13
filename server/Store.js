import Q from 'q';

export class Store {

    constructor (documentClient, databaseName) {
        this.client = documentClient;
        this.databaseName = databaseName;
        this.database = null;
    }

    initialize () {

        var self = this;
        var databaseName = this.databaseName;

        this.databaseExists(databaseName)
            .then(response => {
                return response.exists
                    ? Q(response.database)
                    : self.createDatabase(databaseName);
            })
            .then(response => {
                console.log('@@@@@@@@@@');
                console.dir(response.resource);
                self.database = response.resource;
                return Q(response.resource);
            })
            .then(database => {
                console.dir(database);
                return collectionExists(database._self, 'comments')
                    .then(response => {
                        console.dir(response);
                    });
            });
    }

    databaseExists(id) {

        const query = `SELECT * FROM x WHERE x.id = '${id}'`;

        return this.client
            .queryDatabases(query)
            .executeNextAsync()
            .then(response => {
                const found = response.feed.length === 1;
                return {
                    exists: found,
                    database: found ? response.feed[0] : undefined
                };
            });
    }

    createDatabase(databaseName) {
        return this.client
            .createDatabaseAsync({ id: databaseName })  ;
    }

    collectionExists(databaseLink, id) {

        const query = `SELECT * FROM x WHERE x.id = '${id}'`;

        return this.client
            .queryCollections(databaseLink, query)
            .executeNextAsync()
            .then(response => {
                const found = response.feed.length === 1;
                return {
                    exists: found,
                    collection: found ? response.feed[0] : undefined
                };
            });
    }

    createCollection(databaseLink, id) {
        return this.client
            .createCollectionAsync(databaseLink, { id: id })  ;
    }

    persistComment (blobSha, comment) {

        return new Promise(resolve => { resolve(true); });
    }
}
