import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-http-client';
import context from './context';

export class App {

	static inject() { return [Router, EventAggregator, HttpClient, ()=> { return context; }]; }

	constructor(router, events, http, context) {
		this.router = router;
		this.events = events;
		this.http = http;
		this.context = context;

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
				self.context.user = response.content;
			});
	}
}
