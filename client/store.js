import { Headers } from 'aurelia-http-client';
import { HttpClient } from 'aurelia-http-client';

function configuredHttpClient() {
    var headers = new Headers();
    headers.add('Accept', 'application/json');
    headers.add('Content-Type', 'application/json');

    return new HttpClient('', headers);
}

// NOTE: I'm questioning the usefulness of this abstraction

export class Store {

    static inject() { return [configuredHttpClient]; }

    constructor(http){
        this.http = http;
    }

    postComment(comment) {

        this.http
            .post('/comments/new', comment)
            .catch(error => {
                console.dir(error);
            });
    }

    markHandled(comment) {
        this.http
            .post('/comments/handle/', comment)
            .catch(error => {
                console.dir(error);
            });
    }

    getComments(owner, repo, blobSha) {

        return this.http
            .get(`/comments/${owner}/${repo}/${blobSha}`)
            .then(response => {
                return response.content;
            });
    }

    getCommentCounts(owner, repo) {

        return this.http
            .get(`/comments/counts/${owner}/${repo}`)
            .then(response => {
                return response.content;
            });
    }

}
