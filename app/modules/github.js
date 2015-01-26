'use strict';
define(['knockout', 'durandal/system', 'plugins/http', './node'], function(ko, system, http, Node) {

    var base_url = 'https://api.github.com/';
    var base_headers = {
      'Accept' : 'application/vnd.github.v3+json'
      };
    
    function Github() {}

    Github.prototype.fetchRepository = function(owner, repo) {

        var url = base_url + "repos/" + owner + "/" + repo + "/git/trees/master?recursive=1";

        return http.get(url, null, base_headers).then(function(response) {
            if(response.truncated) { /* signal error condition */ }
            var root = Node.unflatten(response.tree);
            root.sha = response.sha;
            return root;
        });
    };

    return Github;
});
