import { Headers } from 'aurelia-http-client';


export class HttpClient {

    static get TREE_SHA() { return 'dd15628c3ae3e14733019683733feb92c8fedf11'; }

    constructor() {

        var headers = new Headers();

        this.response = {
            headers: headers,
            content: {
                sha: HttpClient.TREE_SHA,
                tree: [
                    { path: 'file1', type: 'blob' },
                    { path: 'folder1', type: 'tree'},
                    { path: 'folder1/fileA', type: 'blob'},
                    { path: 'folder1/fileB', type: 'blob' }
                ],
                truncated: false
            }
        };

        this.invoked = 0;
    }

    get(url) {
        this.url = url;
        this.invoked += 1;
        return new Promise((resolve) => {
            resolve(this.response);
        });
    }
}
