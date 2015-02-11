export class Store {

    constructor (documentClient) {
        this.client = documentClient;
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
