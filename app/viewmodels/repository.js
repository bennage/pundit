'use strict';
define(['plugins/http', 'durandal/app', 'knockout', '../modules/github'], function (http, app, ko, Github) {
    var github = Github.instance;

    // defining these in the function scope as linkToDocument is not
    // called in the right context, and this is cleaner than a bind in
    // the template
    var repositoryOwner =  ko.observable('');
    var repositoryName = ko.observable('');
    var commitSha = ko.observable('');

    return {
        owner: repositoryOwner,
        repo: repositoryName,
        sha: commitSha,
        tree: ko.observable({}),

        activate: function (owner, repo) {
          var self = this;

          self.owner(owner);
          self.repo(repo);

          return github.fetchRepository(owner, repo).then(function(rootNode) {
              self.sha(rootNode.shortSha);
              self.tree(rootNode);
          });
        },

        linkToDocument: function(document) {
            return '#document/' +
                repositoryOwner() + '/' +
                repositoryName() + '/' +
                commitSha() + '/' +
                document.fullPath();
        }
    };
});
