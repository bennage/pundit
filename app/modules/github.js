'use strict';
define(['knockout', 'durandal/system', 'plugins/http', './node'], function(ko, system, http, Node) {
    var Github = (function() {
        function Github() {}

        Github.prototype.fetchRepository = function(owner, repo) {
            var url ='https://api.github.com/';
            url += "repos/" + owner + "/" + repo + "/git/trees/master?recursive=1";

            return http.get(url, null, { 'Accept' : 'application/vnd.github.v3+json' }).then(function(response) {
                if(response.truncated) { /* signal error condition */ }
                var root = Node.unflatten(response.tree);
                root.sha = response.sha;
                return root;
            });
        };

        return Github;
    })();
    return Github;
});
