import {GitHub} from './github';

export class Document{

    static inject() { return [GitHub]; }

    constructor(github) {
        this.github = github;
        this.sha = '';
        this.path = '';
        this.content = '';
    }

    activate(route){

        var self = this;

        this.sha = route.sha;
        this.path = route.path;

        return this.github.
            fetchRawFile(route.$parent.owner, route.$parent.repo, route.sha, route.path).
            then(function(content){
                self.content = content;
            });
    }
}
