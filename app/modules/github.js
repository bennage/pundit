'use strict';
define(['knockout', 'durandal/system', 'plugins/http', './node'], function(ko, system, http, Node) {

    var base_url = 'https://api.github.com/';
    // todo: the problem with the `base_headers` is that it is shared mutable
    // we need a better approach
    var base_headers = {
      'Accept' : 'application/vnd.github.v3+json'
      };

    function Github() {
        this.repositories = {};
    }

    Github.prototype.fetchRepository = function(owner, repo, sha1) {
      var self = this;
      // todo: the desired sha should be provided by
      // the owner requesting the feedback

      // todo: check self.repositories to see if the requested sha1
      // has already been loaded. If so, wrap in a promise and go.

        sha1 = sha1 || 'master';
        var url = base_url + 'repos/' + owner + '/' + repo + '/git/trees/' + sha1 + '?recursive=1';

        return http.get(url, null, base_headers).then(function(response, status, xhr) {
            if (response.truncated) { /* signal error condition */ }
            var root = Node.unflatten(response.tree);
            root.sha = response.sha;
            root.shortSha = response.sha.substring(0,7);
            self.repositories[root.sha] = root;
            self.repositories[root.shortSha] = root;
            return root;
        });
    };

    Github.prototype.fetchRawFile = function(owner, repo, commitSha1, filePath) {
        return this.fetchRepository(owner, repo, commitSha1).then(function(repository) {
            var file = repository.lookupFileByPath(filePath);
            var url = base_url + 'repos/' + owner + '/' + repo + '/git/blobs/' + file.blobSha();

            return http.get(url, null, base_headers).then(function(response, status, xhr) {
                var decoded = atob(response.content);
                return decoded;
            });
        });
    };

    Github.instance = new Github();

    return Github;
});
