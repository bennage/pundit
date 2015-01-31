define(['plugins/http', 'durandal/app', 'knockout', '../modules/github', '../../lib/marked'], function (http, app, ko, Github, marked) {

    var github = Github.instance;
    var sha1 = ko.observable();
    var path = ko.observable();

    return {
        sha1: sha1,
        path: path,
        content: ko.observableArray(),
        activate: function(routeOwner, routeRepo, routeSha1, routePath) {
            var self = this;

            sha1(routeSha1);
            path(routePath);

            github.fetchRawFile(routeOwner, routeRepo, routeSha1, routePath).then(function(content){
                var markup = marked(content);
                var wrapper = document.createElement('span');
                wrapper.innerHTML = markup;
                var elements = [];
                var i;
                for(i = 0; i < wrapper.childNodes.length; i++) {
                    elements.push({ lineNumber: wrapper.childNodes[i].dataset ? parseInt(wrapper.childNodes[i].dataset.lineNumber, 10) : 0,
                                    comments: ko.observableArray(),
                                    markup: wrapper.childNodes[i].outerHTML });
                }
                self.content(elements);
            });
        },
        contentClick: function(data, event) {
            data.comments.push('foo');
        }
    };
});
