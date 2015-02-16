// we use Q instead of `Promise` because that's what the
// DocumentDB client uses.
var Q = require('q');

export class DocumentClient {

    constructor() {
        this.query = '';
        this.databases = [];
        this.collections = [];
        this.collectionId = '';
        this.databaseLink = '';
        this.collectionLink = '';
    }

    queryDatabases(query) {
        var feed = this.databases;
        this.query = query;

        return {
            executeNextAsync: () => {
                return Q( { feed: feed });
            }
        }
    }

    queryCollections(databaseLink, query) {
        var feed = this.collections;
        this.databaseLink = databaseLink;
        this.query = query;

        return {
            executeNextAsync: () => {
                return Q( { feed: feed });
            }
        }
    }

    createCollectionAsync(databaseLink, body, optionsopt) {
        this.databaseLink = databaseLink;
        this.collectionId = body.id;
        return Q({});
    }

    createDocumentAsync(collectionLink, comment, opts) {
        this.collectionLink = collectionLink;
        return Q({});
    }
}
