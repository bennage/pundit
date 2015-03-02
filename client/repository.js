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
		this.treeFiltered = {};
		this.isFiltered = false;
		this.store = store;
		this.filesWithComments = [];

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
		this.filesWithComments = [];
		
		return this.github
			.fetchTree(route.owner, route.repo)
			.then(response => {
				self.sha = response.sha;
				self.tree = response;

				self.toggleFilter();
			})
			.then(() => {
				return self.store.getCommentCounts(route.owner, route.repo);
			})
			.then(this.associateCountsWithBlobs.bind(this));
	}

	toggleFilter() {

		if(this.isFiltered){
			this.treeFiltered = this.tree;
		} else {
			this.treeFiltered = this.tree.clone(x => { return x.containsMarkdown; });
		}

		this.isFiltered = !this.isFiltered;
	}

	associateCountsWithBlobs (comments) {
		var self = this;

		for(var sha in comments) {
			var file = this.tree.lookupFileBySha(sha);

			if(file) {
				file.count = comments[sha];
				this.filesWithComments.push(file);
			}
		}

	}
}
