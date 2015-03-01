import {GitHub} from './github';
import {Store} from './store';
import {Line} from './line';
import context from './context';
import moment from 'moment';

export class Document{

    static inject() { return [GitHub, Store, ()=> { return context; } ]; }

    constructor(github, store, context) {
        this.github = github;
        this.store = store;
        this.context = context;
        this.sha = '';
        this.repo = '';
        this.path = '';
        this.lines = [];
    }

    activate(route) {

        if(!route.sha) return;

        var self = this;

        this.sha = route.sha;
        this.path = route.path;
        this.repo = `${route.$parent.owner}/${route.$parent.repo}`;

        return this.github
            .fetchRawFile(route.$parent.owner, route.$parent.repo, route.sha, route.path)
            .then(this.transformRawFileIntoViewModel.bind(this))
            .then( () => {
                // TODO: this could execute in parallel
                // what is the es6 equivalent of WhenAll?
                return self.store
                    .getComments(route.$parent.owner, route.$parent.repo, route.sha);
            })
            .then(this.associateCommentsWithLines.bind(this));
    }

    transformRawFileIntoViewModel(rawFile) {
        this.lines = rawFile
            .split('\n')
            .map( (text, index) => { return new Line(text, index); });
    }

    associateCommentsWithLines(comments){

        var self = this;
        comments.forEach(comment => {
            var line = self.lines[comment.lineNumber];
            // HACK: this should be done in the view.
            // I'm guessing that it would use a `global-behavior` maybe?
            // Once this is moved to the view, we can remove `moment`
            // from this file.
            comment.timestamp = moment(comment.timestamp).fromNow();
            line.comments.push(comment);
        });
    }

    markCommentHandled(comment) {
        comment.handled = true;
        this.store.markHandled(comment);
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
            timestamp: 'just now'
        };

        line.comments.push(comment);

        line.newCommentBody = '';

        return this.store.postComment(comment);
    }
}
