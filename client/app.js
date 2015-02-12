import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-http-client';
import user from './user';

export class App {

	static inject() { return [Router, EventAggregator, HttpClient, ()=> { return user; }]; }

	constructor(router, events, http, user) {
		this.router = router;
		this.events = events;
		this.http = http;
		this.user = user;

		this.router.configure(config => {

			config.title = 'Pundit';

			config.map([{
				route: ['', 'welcome'],
				moduleId: 'welcome',
				nav: true,
				title: 'Welcome'
			}, {
				route: ':owner/:repo',
				moduleId: 'repository',
				title: 'Repository'
			}]);
		});

		this.events.subscribe('rate-limit', message =>{
			//TODO: I was hoping to bind this into the navbar...
			console.dir(message);
			if(message.limit == 0){
				alert('You are out of APIs!');
			}
		});
	}

	activate () {
		var self = this;
		this.http
			.get('/user')
			.then(response => {
				Object.assign(self.user, response.content);
			});
	}
}
