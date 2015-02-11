import { expect } from 'chai';
import { Store } from '../server/Store';

// we use Q instead of `Promise` because that's what the
// DocumentDB client uses.
var Q = require('q');

class DocumentClientStub {

    constructor() {
        this.query = '';
        this.databases = [];
        this.collections = [];
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

    queryCollections(dbLink, query) {
        var feed = this.collections;
        this.query = query;

        return {
            executeNextAsync: () => {
                return Q( { feed: feed });
            }
        }
    }
}

describe('A repository', () => {

    describe('when checking the existence of a database', ()=> {

        const database_id = 'owner1/repo1';

        it('constructs the expected query', done => {
            var client = new DocumentClientStub();
            var repo = new Store(client);

            const expected = `SELECT * FROM x WHERE x.id = '${database_id}'`;

            repo.databaseExists(database_id)
                .then(response => {
                    expect(client.query).to.equal(expected);
                    done();
                })
                .catch(err =>{
                    done(err);
                });
        });

        describe('if the database does not exist', () => {

            var client = new DocumentClientStub();

            it('sets `exists` to false', done => {
                var repo = new Store(client);

                repo.databaseExists(database_id)
                    .then(response => {
                        expect(response.exists).to.be.false();
                        done();
                    })
                    .catch(err =>{
                        done(err);
                    });
            });

            it('sets `database` to undefined', done => {
                var repo = new Store(client);

                repo.databaseExists(database_id)
                    .then(response => {
                        expect(response.database).to.be.undefined();
                        done();
                    })
                    .catch(err =>{
                        done(err);
                    });
            });

        });

        describe('if the database does exist', () => {

            var client = new DocumentClientStub();
            client.databases.push(
                { /* a database */ }
            );

            it('sets `exists` to true', done => {
                var repo = new Store(client);

                repo.databaseExists(database_id)
                    .then(response => {
                        expect(response.exists).to.be.true();
                        done();
                    })
                    .catch(err =>{
                        done(err);
                    });
            });

            it('sets `database` to defined', done => {
                var repo = new Store(client);

                repo.databaseExists(database_id)
                    .then(response => {
                        expect(response.database).to.not.be.undefined();
                        done();
                    })
                    .catch(err =>{
                        done(err);
                    });
            });

        });
    });

    describe('when checking the existence of a collection', ()=> {

        const collection_id = 'blob_sha';

        it('constructs the expected query', done => {
            var client = new DocumentClientStub();
            var repo = new Store(client);

            const expected = `SELECT * FROM x WHERE x.id = '${collection_id}'`;

            repo.collectionExists(null, collection_id)
                .then(response => {
                    expect(client.query).to.equal(expected);
                    done();
                })
                .catch(err =>{
                    done(err);
                });
        });

        describe('if the collection does not exist', () => {

            var client = new DocumentClientStub();

            it('sets `exists` to false', done => {
                var repo = new Store(client);

                repo.databaseExists(collection_id)
                    .then(response => {
                        expect(response.exists).to.be.false();
                        done();
                    })
                    .catch(err =>{
                        done(err);
                    });
            });

            it('sets `collection` to undefined', done => {
                var repo = new Store(client);

                repo.databaseExists(collection_id)
                    .then(response => {
                        expect(response.collection).to.be.undefined();
                        done();
                    })
                    .catch(err =>{
                        done(err);
                    });
            });

        });

        describe('if the collection does exist', () => {

            var client = new DocumentClientStub();
            client.collections.push(
                { /* a collection */ }
            );

            it('sets `exists` to true', done => {
                var repo = new Store(client);

                repo.collectionExists(collection_id)
                    .then(response => {
                        expect(response.exists).to.be.true();
                        done();
                    })
                    .catch(err =>{
                        done(err);
                    });
            });

            it('sets `collection` to defined', done => {
                var repo = new Store(client);

                repo.collectionExists(collection_id)
                    .then(response => {
                        expect(response.collection).to.not.be.undefined();
                        done();
                    })
                    .catch(err =>{
                        done(err);
                    });
            });

        });
    });

    describe('when persisting a comment', done => {

        const blobSha = 'something';
        const comment = {};

        it('acknowledges success', done => {

            var client = new DocumentClientStub();
            var repo = new Store(client);

            repo
                .persistComment(blobSha, comment)
                .then(response => {
                    expect(response).to.be.true();
                    done();
                });

        });
    });
});
