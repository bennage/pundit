'use strict';
define(['knockout', 'durandal/system', 'plugins/http', './node'], function(ko, system, http, Node) {

    var base_url = 'https://api.github.com/';
    // todo: the problem with the `base_headers` is that it is shared mutable
    // we need a better approach
    var base_headers = {
      'Accept' : 'application/vnd.github.v3+json'
      };

    function Github() {}

    Github.prototype.fetchRepository = function(owner, repo) {

      // todo: the desired sha should be provided by
      // the owner requesting the feedback

        var sha1 = 'master';
        var url = base_url + 'repos/' + owner + '/' + repo + '/git/trees/' + sha1 + '?recursive=1';

        return http.get(url, null, base_headers).then(function(response, status, xhr) {
            if (response.truncated) { /* signal error condition */ }
            var root = Node.unflatten(response.tree);
            root.sha = response.sha;
            return root;
        });
    };

    Github.prototype.fetchRawFile = function(owner, repo, sha1) {

      var url = base_url + 'repos/' + owner + '/' + repo + '/git/blobs/' + sha1;

      var headers = {
        'Accept' : 'application/vnd.github.v3+json'
      };

      return http.get(url, null, base_headers).then(function(response, status, xhr) {
        var decoded = atob(response.content);
        return decoded;
      });
    };

    return Github;
});
