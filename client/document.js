import {GitHub} from './github';
import {Line} from './Line';
import context from './context';

export class Document{

    static inject() { return [GitHub, ()=> { return context; } ]; }

    constructor(github, context) {
        this.github = github;
        this.context = context;
        this.sha = '';
        this.repo = '';
        this.path = '';
        this.lines = [];
        this.selectedLine = null;
    }

    activate(route) {

        var self = this;

        this.sha = route.sha;
        this.path = route.path;
        this.repo = `${route.$parent.owner}/${route.$parent.repo}`;

        return this.github.
            fetchRawFile(route.$parent.owner, route.$parent.repo, route.sha, route.path).
            then(function(content){

                var createCommentWithContext = self.createCommentWithContext.bind(self);

                self.lines = content
                    .split('\n')
                    .map( (text, index) => { return new Line(text, index, createCommentWithContext); });
            });
    }

    createCommentWithContext() {
        return {
            author: this.context.user.name,
            repo: this.repo,
            blobSha: this.sha
        };
    }


    postComment() {

    }
}
