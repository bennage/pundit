import logger from 'winston';
import Q from 'q';

export class Store {

    constructor (documentClient) {
        this.client = documentClient;
        this.database = null;
        this.collection = null;
    }

    initialize (databaseName) {

        var self = this;
        const collectionName = 'comments';

        logger.info(`initialize database ${databaseName}`);

        this.databaseExists(databaseName)
            .then(response => {
                logger.info('databaseExists', response);
                return response.exists
                    ? Q(response.database)
                    : self.createDatabase(databaseName).bind(self);
            })
            .then(database => {

                self.database = database;

                return self.collectionExists(collectionName)
                    .then(response => {
                        logger.info('collectionExists', response);
                        return response.exists
                            ? Q(response.collection)
                            : self.createCollection(collectionName).bind(self);
                    })
                    .then(collection => {
                        self.collection = collection;
                        return Q(collection);
                    });
            })
            .catch(error => {
                logger.error(error);
            });
    }

    databaseExists(id) {

        const query = `SELECT * FROM x WHERE x.id = '${id}'`;

        logger.info('databaseExists?', {
            id: id,
            query: query
        });

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
        logger.info('createDatabase', databaseName);
        return this.client
            .createDatabaseAsync({ id: databaseName })  ;
    }

    collectionExists(id) {
        const databaseLink = this.database._self;
        const query = `SELECT * FROM x WHERE x.id = '${id}'`;

        logger.info('collectionExists?', {
            databaseLink: databaseLink,
            query: query
        });

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

    createCollection(id) {

        const databaseLink = this.database._self;

        return this.client
            .createCollectionAsync(databaseLink, { id: id })  ;
    }

    persistComment (comment) {
        return this.client
            .createDocument(this.collection._self, comment) ;
    }
}
