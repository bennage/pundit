'use strict';
define(['knockout', 'durandal/system', 'plugins/http'], function(ko, system, http) {

    function Node(name){
        this.nodes = {};
        this.source = null;
        this.name = name;
        this.expanded = ko.observable(false);
    }

    Node.unflatten = function(flat_tree){
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
                current.nodes[segment] = current.nodes[segment] || new Node(segment);
                current = current.nodes[segment];
            });

            current.source = item;
        });

        return root;
    };

    Node.prototype.isFolder = function(){
        return this.source.type === 'tree';
    };

    Node.prototype.toggle = function(){
      this.expanded( !this.expanded() );
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
        return this.source.path;
    };

    // might make more sense to keep the original response in memory,
    // rather than recurse back through the tree we built.
    Node.prototype.lookupFileByPath = function(path) {
        if (!path || path.length === 0) { return null; }
        var i;
        var segments = path.split('/', 1);
        var restOfPath = path.substring(segments[0].length + 1);
        var childNode = this.nodes[segments[0]];
        if (!childNode) {
            return null;
        } else if (childNode.isFolder()) {
            return childNode.lookupFileByPath(restOfPath);
        } else {
            return childNode;
        }
    };

    Node.prototype.blobSha = function() {
        if (this.isFolder()) {
            throw "Called blobSha on a folder";
        }
        return this.source.sha;
    };

    return Node;
});
