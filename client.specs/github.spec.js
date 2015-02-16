import { GitHub } from '../client/github';
import { EventAggregator } from './mocks/EventAggregator';
import { HttpClient } from './mocks/HttpClient';

const OWNER = 'an-owner';
const REPO = 'a-repo';
const SHA = 'a-sha';

describe('the GitHub module', () => {

	var events =  new EventAggregator();

	describe('when fetching a repository', () => {

		it('constructs the url for fetching a tree recurvisely', done => {
			var http = new HttpClient();
			var github = new GitHub(http, events);

			github.fetchTree(OWNER,REPO,SHA).then(response => {
				expect(http.url).toBe(`repos/${OWNER}/${REPO}/git/trees/${SHA}?recursive=1`);
				done();
			});
		});

		it('assumes `master` when the sha is not provided', done => {
			var http = new HttpClient();
			var github = new GitHub(http, events);

			github.fetchTree(OWNER,REPO).then(response => {
				expect(http.url).toBe(`repos/${OWNER}/${REPO}/git/trees/master?recursive=1`);
				done();
			});
		});

		it('returns an unflatten tree', done => {
			var http = new HttpClient();
			var github = new GitHub(http, events);

			github.fetchTree(OWNER,REPO,SHA).then(response => {
				expect(response.name).toBe('_root_');
				expect(response.nodes).toBeDefined();
				expect(response.nodes.file1).toBeDefined();
				done();
			});
		});

		it('attaches the sha to the tree', done => {
			var http = new HttpClient();
			var github = new GitHub(http, events);

			github.fetchTree(OWNER, REPO, SHA)
				.then(response => {
					expect(response.sha).toBe(HttpClient.TREE_SHA);
					done();
				});
		});

		it('attaches a shortened sha to the tree', done => {
			var http = new HttpClient();
			var github = new GitHub(http, events);

			github.fetchTree(OWNER,REPO,SHA).then(response => {
				expect(response.shortSha).toBe('dd15628');
				expect(response.shortSha.length).toBe(7);
				done();
			});
		});

		it('um, throws or something when the response is truncated', done => {
			var http = new HttpClient();
			http.response.content.truncated = true;

			var github = new GitHub(http, events);

			//NOTE: I don't know what good idiomatic JavaScript error handling looks like!

			github.fetchTree(OWNER,REPO,SHA).
			then(response => {
				throw new '`then` was invoked instead of `catch`';
			}).
			catch(err=>{
				expect(err).toBe('The tree was truncated!');
				done();
			});
		});

		it('returns a cached response on subsequent request for the same tree', done => {
			var http = new HttpClient();
			var github = new GitHub(http, events);

			github.fetchTree(OWNER, REPO, HttpClient.TREE_SHA)
				.then(response1 => {
					// after the 1st call completes, we make another
					// TODO: I suspect there's a better way to do this...

					expect(http.invoked).toBe(1);

					github.fetchTree(OWNER, REPO, HttpClient.TREE_SHA)
						.then(response2 => {
							expect(http.invoked).toBe(1);
							done();
						})
						.catch(done);
				});
		});

		it('does not return a cached response on subsequent request for different tree', done => {
			var http = new HttpClient();
			var github = new GitHub(http, events);

			var firstSHA = 'a1b23c';
			var secondSHA = '3c2b1a';

			github.fetchTree(OWNER,REPO,firstSHA).
				then(response1 => {

					expect(http.invoked).toBe(1);

					github.fetchTree(OWNER,REPO,secondSHA).
						then(response2 => {
							expect(http.invoked).toBe(2);
							done();
						});
				});
		});

	});

	describe('when fetching a raw file', () => {

		it('how do we want to test this?');

	});
});
