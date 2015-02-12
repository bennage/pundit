import { EventAggregator } from 'aurelia-event-aggregator';
import { Headers } from 'aurelia-http-client';
import { HttpClient } from 'aurelia-http-client';
import { Node } from './Node';
import user from './user';

function configuredHttpClient() {
	var base_url = 'https://api.github.com/';
	var headers = new Headers();
	headers.add('Accept', 'application/vnd.github.v3+json');
	headers.add('Authorization', `token ${user.accessToken}`);

	return new HttpClient(base_url, headers);
}

export class GitHub {

	static inject() { return [configuredHttpClient, EventAggregator]; }

	constructor(http, events){
		this.http = http;
		this.events = events;
		this.repositories = {};
	}

	captureRateLimit(response) {
		var headers = response.headers.headers;

		this.events.publish('rate-limit', {
			limit: headers['X-RateLimit-Limit'],
			remaining: headers['X-RateLimit-Remaining'],
			reset: new Date(headers['X-RateLimit-Reset'] * 1000)
		});
	}

	fetchStore (owner, repo, sha1) {
		// todo: the desired sha should be provided by
		// the owner requesting the feedback

		var self = this;

		if (!!sha1 && self.repositories[sha1]) {
			return new Promise((resolve) => {
				resolve(self.repositories[sha1]);
			})
		}

		sha1 = sha1 || 'master';

		var url = `repos/${owner}/${repo}/git/trees/${sha1}?recursive=1`;

		return this.http.get(url).then(response => {

			self.captureRateLimit(response);

			var body = response.content;

			if (body.truncated) { throw 'The tree was truncated!'; }

			// HACK: I'm passing `owner` and `repo` but I feel like I should be
			// able to capture those value from the route
			var root = Node.unflatten(body.tree, owner, repo);
			root.sha = body.sha;
			root.shortSha = body.sha.substring(0,7);
			self.repositories[root.sha] = root;

			return root;
		});
	};

	fetchRawFile (owner, repo, sha, filePath) {

		var self = this;
		var url = `repos/${owner}/${repo}/git/blobs/${sha}`;

		return this.http.get(url).then(response => {
			self.captureRateLimit(response);

			var body = response.content;
			var decoded = atob(body.content);
			return decoded;
		});
	};
}
