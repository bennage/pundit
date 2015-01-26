define(['plugins/http', 'durandal/app', 'knockout', '../modules/github'], function (http, app, ko, Github) {

    var github = new Github();
    var sha1 = ko.observable();
    var path = ko.observable();

    return {
        sha1: sha1,
        path: path,
        content: ko.observable('loading...'),
        activate: function(routeOwner, routeRepo, routeSha1, routePath) {
            var self = this;
            
            sha1(routeSha1);
            path(routePath);

            github.fetchRawFile(routeOwner, routeRepo, routeSha1).then(function(content){
              self.content(content);
            });
        }
    };
});
