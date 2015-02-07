import { Headers } from 'aurelia-http-client';
import { GitHub } from '../src/github';

const TREE_SHA = 'dd15628c3ae3e14733019683733feb92c8fedf11';
const OWNER = 'an-owner';
const REPO = 'a-repo';
const SHA = 'a-sha';

class HttpStub {

	constructor() {

		var headers = new Headers();

		this.response = {
			headers: headers,
			content: {
				sha: TREE_SHA,
				tree: [
					{ path: 'file1', type: 'blob' },
					{ path: 'folder1', type: 'tree'},
					{ path: 'folder1/fileA', type: 'blob'},
					{ path: 'folder1/fileB', type: 'blob' }
				],
				truncated: false
			}
		};

		this.invoked = 0;
	}

	get(url) {
		this.url = url;
		this.invoked += 1;
		return new Promise((resolve) => {
			resolve(this.response);
		});
	}
}

describe('the GitHub module', () => {

	describe('when fetching a repository', () => {

		it('constructs the url for fetching a tree recurvisely', (done) => {
			var http = new HttpStub();
			var github = new GitHub(http);

			github.fetchRepository(OWNER,REPO,SHA).then(response => {
				expect(http.url).toBe(`repos/${OWNER}/${REPO}/git/trees/${SHA}?recursive=1`);
				done();
			});
		});

		it('assumes `master` when the sha is not provided', (done) => {
			var http = new HttpStub();
			var github = new GitHub(http);

			github.fetchRepository(OWNER,REPO).then(response => {
				expect(http.url).toBe(`repos/${OWNER}/${REPO}/git/trees/master?recursive=1`);
				done();
			});
		});

		it('returns an unflatten tree', (done) => {
			var http = new HttpStub();
			var github = new GitHub(http);

			github.fetchRepository(OWNER,REPO,SHA).then(response => {
				expect(response.name).toBe('_root_');
				expect(response.nodes).toBeDefined();
				expect(response.nodes.file1).toBeDefined();
				done();
			});
		});

		it('attaches the sha to the tree', (done) => {
			var http = new HttpStub();
			var github = new GitHub(http);

			github.fetchRepository(OWNER,REPO,SHA).then(response => {
				expect(response.sha).toBe(TREE_SHA);
				done();
			});
		});

		it('attaches a shortened sha to the tree', (done) => {
			var http = new HttpStub();
			var github = new GitHub(http);

			github.fetchRepository(OWNER,REPO,SHA).then(response => {
				expect(response.shortSha).toBe('dd15628');
				expect(response.shortSha.length).toBe(7);
				done();
			});
		});

		it('um, throws or something when the response is truncated', (done) => {
			var http = new HttpStub();
			http.response.content.truncated = true;

			var github = new GitHub(http);

			//NOTE: I don't know what good idiomatic JavaScript error handling looks like!

			github.fetchRepository(OWNER,REPO,SHA).
			then(response => {
				throw new '`then` was invoked instead of `catch`';
			}).
			catch(err=>{
				expect(err).toBe('The tree was truncated!');
				done();
			});
		});

		it('returns a cached response on subsequent request for the same tree', (done) => {
			var http = new HttpStub();
			var github = new GitHub(http);

			github.fetchRepository(OWNER,REPO,TREE_SHA).
				then(response1 => {
					// after the 1st call completes, we make another
					// TODO: I suspect there's a better way to do this...

					expect(http.invoked).toBe(1);

					github.fetchRepository(OWNER,REPO,TREE_SHA).
						then(response2 => {
							expect(http.invoked).toBe(1);
							done();
						});
				});
		});

		it('does not return a cached response on subsequent request for different tree', (done) => {
			var http = new HttpStub();
			var github = new GitHub(http);

			var firstSHA = 'a1b23c';
			var secondSHA = '3c2b1a';

			github.fetchRepository(OWNER,REPO,firstSHA).
				then(response1 => {

					expect(http.invoked).toBe(1);

					github.fetchRepository(OWNER,REPO,secondSHA).
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
