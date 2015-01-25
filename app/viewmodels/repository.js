define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {

  function unflatten(flat_tree){
    // `flat_tree` should be a 1 dimensional array
    // each item in the array has a `path` describing
    // its location in the expanded tree.
    // `path` is delimited by /

    // `nodes` is an {} instead of an array
    // this simplifies the unflattening process
    // but complicates binding
    // we'll convert it [] after the fact,
    // but maybe there's a better way?
    var root = new Node();

    flat_tree.forEach(function(item) {
      var segments = item.path.split('/');
      var current = root;

      segments.forEach(function(segment){
        current.nodes[segment] = current.nodes[segment] || new Node(segment, current);
        current = current.nodes[segment];
      });

      current.source = item;
    });

    return root;
  }

  function Node(name, parent){
    this.nodes = {};
    this.source = null;
    this.name = name;
    this.parent = parent;
  }

  Node.prototype.isFolder = function(){
    return this.source.type === 'tree';
  };

  Node.prototype.nodesToArray = function(){
    var folders = [];
    var files = [];
    var property, current;

    for(property in this.nodes){
      current = this.nodes[property];
      var set = current.isFolder() ? folders : files;
      set.push(current);
    }

    // folders should appear before files
    return folders.concat(files);
  };

    Node.prototype.fullPath = function() {
        if (!this.parent) {
            return '';
        }
        return this.parent.fullPath() + '/' + this.name;
    };

    return {
        displayName: 'Comment',
        sha: ko.observable('loading'),
        tree: ko.observable({}),

        activate: function (owner, repo) {
          var self = this;

          var url ='https://api.github.com/';
          url += "repos/" + owner + "/" + repo + "/git/trees/master?recursive=1";

          return http.get(url, null, { 'Accept' : 'application/vnd.github.v3+json' }).then(function(response) {

            if(response.truncated) { /* tell the user */ }

            self.sha(response.sha);

            var unflattened_tree = unflatten(response.tree);

            self.tree(unflattened_tree);
          });
        },

        linkFromPath: function(path) {
            return '#document/' + this.sha() + path;
        }
    };
});
