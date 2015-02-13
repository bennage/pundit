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
            then(content => {

                self.lines = content
                    .split('\n')
                    .map( (text, index) => { return new Line(text, index); });
            });
    }

    postComment(line) {
        line.adding = false;

        var user = this.context.user;

        var comment = {
            author: {
                login: user.login,
                name: user.name,
                avatar_url: user.avatar_url,
                email: user.email
            },
            repo: this.repo,
            blobSha: this.sha,
            body: line.newCommentBody,
            lineNumber: line.number,
            timestamp: new Date()
        };

        line.comments.push(comment);

        line.newCommentBody = '';
    }
}
