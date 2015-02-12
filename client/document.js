import {GitHub} from './github';
import {Line} from './Line';
import user from './user';

export class Document{

    static inject() { return [GitHub, ()=> { return user; } ]; }

    constructor(github, user) {
        this.github = github;
        this.user = user;
        this.sha = '';
        this.path = '';
        this.lines = [];
        this.selectedLine = null;
    }

    activate(route) {

        var self = this;

        this.sha = route.sha;
        this.path = route.path;

        return this.github.
            fetchRawFile(route.$parent.owner, route.$parent.repo, route.sha, route.path).
            then(function(content){

                self.lines = content
                    .split('\n')
                    .map( (text, index) => { return new Line(text, index, self.user); });
            });
    }

    postComment() {

    }
}
