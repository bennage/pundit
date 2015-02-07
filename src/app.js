import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

export class App {

	static inject() { return [Router, EventAggregator]; }

	constructor(router, events) {
		this.router = router;
		this.events = events;

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
}
