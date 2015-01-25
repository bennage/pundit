'use strict';
define(['plugins/http', 'durandal/app', 'knockout', '../modules/github'], function (http, app, ko, Github) {
    var github = new Github();
    var owner;
    var repo;

    return {
        sha: ko.observable('loading'),
        tree: ko.observable({}),

        activate: function (o, r) {
          var self = this;
          repo = r;
          owner = o;

          return github.fetchRepository(owner, repo).then(function(rootNode) {
              self.sha(rootNode.sha);
              self.tree(rootNode);
          });
        },

        linkFromPath: function(path) {
            return '#document/' + owner + '/' + repo + '/' + this.sha() + path;
        }
    };
});
