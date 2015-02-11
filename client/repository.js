import { GitHub } from './github';
import { Router } from 'aurelia-router';

export class Repository{

	static inject() { return [GitHub, Router]; }

	constructor(github, router) {

		this.github = github;
		this.owner = '';
		this.repo = '';
		this.sha = '';
		this.tree = {};

		this.router = router;

		router.configure(config => {
			config.map([
				{ route: ['','welcome'],  moduleId: 'welcome' },
				{ route: ':sha/*path',  moduleId: 'document', title:'Document' }
			]);
		});
	}

	activate(route){
		var self = this;

		this.owner = route.owner;
		this.repo = route.repo;

		return this.github.
			fetchStore(route.owner, route.repo).
			then(response => {
				self.sha = response.sha;
				self.tree = response;
			});
	}
}
