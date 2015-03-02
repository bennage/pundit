import logger from 'winston';
import Q from 'q';

var storedProcedures = [
    {
        id: 'getUnhandledComments',
        body: function (owner, repo) {
            var context = getContext();
            var response = context.getResponse();
            var collection = context.getCollection();

            var qualified_repo = owner + '/' + repo;
            var query = 'SELECT * FROM x WHERE x.repo = "' + qualified_repo + '" AND NOT (x.handled AND false)';

            var accept = collection.queryDocuments(collection.getSelfLink(), query, {},

                function (err, documents, responseOptions) {

                    if (err) throw err;

                    var results = {};
                    documents.forEach(x => {

                        if(!results[x.blobSha]) {
                            results[x.blobSha] = 0;
                        }

                        results[x.blobSha] += 1;

                    });

                });

            if (!accept) throw 'Unable to query for unhandled comment counts';
        }
    }
];

export class Store {

    constructor (documentClient) {
        this.client = documentClient;
        this.database = null;
        this.collection = null;
        this.storedProcedures = {};
    }

    initialize (databaseName) {

        var self = this;
        const collectionName = 'comments';

        logger.info(`initialize database ${databaseName}`);

        this.databaseExists(databaseName)
            .then(response => {
                return response.exists
                    ? Q(response.database)
                    : self.createDatabase(databaseName);
            })
            .then(database => {
                self.database = database;
                return self.collectionExists(collectionName);
            })
            .then(response => {
                return response.exists
                    ? Q(response.collection)
                    : self.createCollection(collectionName);
            })
            .then(collection => {
                self.collection = collection;
                return self.createAllStoredProcedures();
            })
            .catch(logger.error);
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
            .createDatabaseAsync({ id: databaseName })
            .then(response => {
                return Q(response.resource);
            });
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
            .createCollectionAsync(databaseLink, { id: id })
            .then(response => {
                return Q(response.resource);
            });
    }

    storedProcedureExists(id) {

        const collectionLink = this.collection._self;
        const query = `SELECT * FROM x WHERE x.id = '${id}'`;

        return this.client
            .queryStoredProcedures(collectionLink, query)
            .executeNextAsync()
            .then(response => {
                const found = response.feed.length === 1;
                return {
                    exists: found,
                    storedProcedure: found ? response.feed[0] : undefined
                };
            });
    }

    createAllStoredProcedures() {

        var self = this;

        var create = this.client
            .createStoredProcedureAsync
            .bind(this.client, this.collection._self);

        var wrapResource = x => { return Q(x.resource); };

        var promises = storedProcedures.map(definition => {
            logger.info(`creating stored procedure: ${definition.id}`);

            return self
                .storedProcedureExists(definition.id)
                .then(response => {
                    return response.exists
                        ? Q(response.storedProcedure)
                        : create(definition).then(wrapResource);
                })
                .then(sproc => {
                    self.storedProcedures[sproc.id] = sproc._self;
                    return Q(sproc);
                });
        });

        return Q.all(promises);
    }

    persistComment (comment) {
        logger.info('persistComment', comment);

        const collectionLink = this.collection._self;
        const opts = { disableAutomaticIdGeneration:false };

        return this.client
            .createDocumentAsync(collectionLink, comment, opts);
    }

    markHandled (comment) {
        logger.info('markHandled', comment);

        comment.handled = true;
        comment.handledOn = Date.UtcNow;

        return this.client
            .replaceDocumentAsync(comment._self, comment);
    }

    getComments (owner, repo, blobSha) {
        const qualified_repo = `${owner}/${repo}`;
        const query = `SELECT * FROM x WHERE x.repo = '${qualified_repo}' AND x.blobSha = '${blobSha}'`;

        logger.info('getComments', query);

        return this.client
            .queryDocuments(this.collection._self, query)
            .executeNextAsync()
            .then(response => {
                logger.info('getComments', response);
                return response.feed;
            });
    }

    // TODO: this should be moved into a stored procudure
    getCommentCounts (owner, repo) {
        const qualified_repo = `${owner}/${repo}`;
        const query = `SELECT * FROM x WHERE x.repo = '${qualified_repo}'`;

        logger.info('getCommentCounts', query);

        return this.client
            .queryDocuments(this.collection._self, query)
            .executeNextAsync()
            .then(response => {
                logger.info('getCommentCounts', response);
                var comments = response.feed;
                var results = {};
                comments.forEach(x => {

                    if(!results[x.blobSha]) {
                        results[x.blobSha] = 0;
                    }

                    results[x.blobSha] += 1;

                });
                return results;
            });
    }

    // TODO: this should be moved into a stored procudure
    getUnhandledCommentCounts (owner, repo) {
        const qualified_repo = `${owner}/${repo}`;
        const query = `SELECT * FROM x WHERE x.repo = '${qualified_repo}' AND NOT (x.handled AND false)`;

        logger.info('getUnhandledCommentCounts', query);

        return this.client
            .queryDocuments(this.collection._self, query)
            .executeNextAsync()
            .then(response => {
                logger.info('getUnhandledCommentCounts', response);
                var comments = response.feed;
                var results = {};
                comments.forEach(x => {

                    if(!results[x.blobSha]) {
                        results[x.blobSha] = 0;
                    }

                    results[x.blobSha] += 1;

                });
                return results;
            });
    }
}
