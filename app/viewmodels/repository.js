'use strict';
define(['plugins/http', 'durandal/app', 'knockout', '../modules/github'], function (http, app, ko, Github) {
    var github = new Github();

    return {
        owner: ko.observable(''),
        repo: ko.observable(''),
        sha: ko.observable(''),
        tree: ko.observable({}),

        activate: function (owner, repo) {
          var self = this;

          self.owner(owner);
          self.repo(repo);

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
