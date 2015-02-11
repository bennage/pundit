import { expect } from 'chai';
import { Store } from '../server/Store';
import { DocumentClient } from './mocks/DocumentClient';

describe('The document store', () => {

    describe('when checking the existence of a database', ()=> {

        const database_id = 'owner1/store1';

        it('constructs the expected query', done => {
            var client = new DocumentClient();
            var store = new Store(client);

            const expected = `SELECT * FROM x WHERE x.id = '${database_id}'`;

            store.databaseExists(database_id)
                .then(response => {
                    expect(client.query).to.equal(expected);
                    done();
                })
                .catch(err =>{
                    done(err);
                });
        });

        describe('if the database does not exist', () => {

            var client = new DocumentClient();

            it('sets `exists` to false', done => {
                var store = new Store(client);

                store.databaseExists(database_id)
                    .then(response => {
                        expect(response.exists).to.be.false();
                        done();
                    })
                    .catch(err =>{
                        done(err);
                    });
            });

            it('sets `database` to undefined', done => {
                var store = new Store(client);

                store.databaseExists(database_id)
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

            var client = new DocumentClient();
            client.databases.push(
                { /* a database */ }
            );

            it('sets `exists` to true', done => {
                var store = new Store(client);

                store.databaseExists(database_id)
                    .then(response => {
                        expect(response.exists).to.be.true();
                        done();
                    })
                    .catch(err =>{
                        done(err);
                    });
            });

            it('sets `database` to defined', done => {
                var store = new Store(client);

                store.databaseExists(database_id)
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

        const databaseLink = '/dbs0123';
        const collection_id = 'blob_sha';

        it('constructs the expected query', done => {
            var client = new DocumentClient();
            var store = new Store(client);

            const expected = `SELECT * FROM x WHERE x.id = '${collection_id}'`;

            store.collectionExists(databaseLink, collection_id)
                .then(response => {
                    expect(client.query).to.equal(expected);
                    expect(client.databaseLink).to.equal(databaseLink);
                    done();
                })
                .catch(err =>{
                    done(err);
                });
        });

        describe('if the collection does not exist', () => {

            var client = new DocumentClient();

            it('sets `exists` to false', done => {
                var store = new Store(client);

                store.databaseExists(collection_id)
                    .then(response => {
                        expect(response.exists).to.be.false();
                        done();
                    })
                    .catch(err =>{
                        done(err);
                    });
            });

            it('sets `collection` to undefined', done => {
                var store = new Store(client);

                store.databaseExists(collection_id)
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

            var client = new DocumentClient();
            client.collections.push(
                { /* a collection */ }
            );

            it('sets `exists` to true', done => {
                var store = new Store(client);

                store.collectionExists(collection_id)
                    .then(response => {
                        expect(response.exists).to.be.true();
                        done();
                    })
                    .catch(err =>{
                        done(err);
                    });
            });

            it('sets `collection` to defined', done => {
                var store = new Store(client);

                store.collectionExists(collection_id)
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

    describe('when creating a collection', () => {

        const databaseLink = '/dbs0123';

        it('the client receives the expected request', done => {
            var client = new DocumentClient();
            var store = new Store(client);

            store.createCollection(databaseLink, 'blob_sha')
                .then(response => {
                    expect(client.collectionId).to.equal('blob_sha');
                    expect(client.databaseLink).to.equal(databaseLink);
                    done();
                })
                .catch(err => {
                    done(err);
                });
        });
    });

    describe('when persisting a comment', done => {

        const blobSha = 'something';
        const comment = {};

        it('acknowledges success', done => {

            var client = new DocumentClient();
            var store = new Store(client);

            store
                .persistComment(blobSha, comment)
                .then(response => {
                    expect(response).to.be.true();
                    done();
                });

        });
    });
});
