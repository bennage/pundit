import { GitHub } from './github';
import { Store } from './store';
import { Router } from 'aurelia-router';

export class Repository{

	static inject() { return [GitHub, Router, Store]; }

	constructor(github, router, store) {

		this.github = github;
		this.owner = '';
		this.repo = '';
		this.sha = '';
		this.tree = {};
		this.store = store;

		this.router = router;

		router.configure(config => {
			config.map([
				{ route: [''],  moduleId: 'document' },
				{ route: ':sha/*path',  moduleId: 'document', title:'Document' }
			]);
		});
	}

	activate(route){
		var self = this;

		this.owner = route.owner;
		this.repo = route.repo;

		return this.github
			.fetchTree(route.owner, route.repo)
			.then(response => {
				self.sha = response.sha;
				self.tree = response;
			})
			.then(() => {
				return self.store.getCommentCounts(route.owner, route.repo);
			})
			.then(response => {
				console.dir(response);
			});
	}

	associateCountsWithBlobs () {

	}
}
