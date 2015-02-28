export class Node {

    constructor(name){
        this.name = name;
        this.nodes = {};
        this.source = null;
        this.expanded = false;

        this.isFolder = false;
        this.fullPath = '';
        this.blobSha = false;
        this.url = '';

        this.containsMarkdown = !!name.match(/\.md$/);
    }

    //HACK: I don't like passing `owner` and `repo` here
    static unflatten (flat_tree, owner, repo) {
        // `flat_tree` should be a 1 dimensional array
        // each item in the array has a `path` describing
        // its location in the expanded tree.
        // `path` is delimited by /

        // `nodes` is an {} instead of an array
        // this simplifies the unflattening process
        // but complicates binding
        // we'll convert it [] after the fact,
        // but maybe there's a better way?
        var root = new Node('_root_');

        flat_tree.forEach((item) => {
            var segments = item.path.split('/');
            var current = root;

            segments.forEach(function(segment){
                current.nodes[segment] = current.nodes[segment] || new Node(segment);
                current = current.nodes[segment];
            });

            current.source = item;
            current.isFolder = item.type === 'tree';
            current.fullPath = item.path;

            current.blobSha = current.isFolder ? false : item.sha;

            current.url = `${owner}/${repo}/${item.sha}/${item.path}`
        });

        Node.markMarkdownFiles(root);

        return root;
    }

    static markMarkdownFiles(parent) {

        if(parent.containsMarkdown) return;

        parent.nodesToArray().forEach(child =>{

            Node.markMarkdownFiles(child);

            if(child.containsMarkdown) {
                parent.containsMarkdown = true;
                return;
            }
        });
    }

    toggle () {
        this.expanded = !this.expanded;
    }

    // TODO: @EisenbergEffect recommend that we use a pre-computed property here
    // The reason is performance (dirty checcking), however we can't compute this
    // until we've processed the entire tree. Let's do that at the end of `unflatten`.
    nodesToArray () {
        var folders = [];
        var files = [];
        var property, current;

        for(property in this.nodes){
            current = this.nodes[property];
            var set = current.isFolder ? folders : files;
            set.push(current);
        }

        // folders should appear before files
        return folders.concat(files);
    };

    // might make more sense to keep the original response in memory,
    // rather than recurse back through the tree we built.
    lookupFileByPath (path) {
        if (!path || path.length === 0) { return null; }
        var i;
        var segments = path.split('/', 1);
        var restOfPath = path.substring(segments[0].length + 1);
        var childNode = this.nodes[segments[0]];
        if (!childNode) {
            return null;
        } else if (childNode.isFolder) {
            return childNode.lookupFileByPath(restOfPath);
        } else {
            return childNode;
        }
    };

    lookupFileBySha (sha) {

        if(this.blobSha === sha) return this;

        for(var item in this.nodes){
            var node = this.nodes[item];
            var found = node.lookupFileBySha(sha);
            if(found) return found;
        }

        return false;
    }
}
