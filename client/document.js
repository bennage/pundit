import {GitHub} from './github';
import {Line} from './Line';

export class Document{

    static inject() { return [GitHub]; }

    constructor(github) {
        this.github = github;
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
                    .map( (text, index) => { return new Line(text, index); });
            });
    }

    postComment() {

    }
}
