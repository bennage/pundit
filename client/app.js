import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-http-client';

export class App {

	static inject() { return [Router, EventAggregator, HttpClient]; }

	constructor(router, events, http) {
		this.router = router;
		this.events = events;
		this.http = http;
		this.user = {};

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
				title: 'Store'
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
				var user = response.content;
				self.user = user;
				console.dir(user);
			});
	}
}
