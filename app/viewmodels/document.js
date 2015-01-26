define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {

    var sha1 = ko.observable();
    var path = ko.observable();
    return {
        sha1: sha1,
        path: path,
        activate: function(routeOwner, routeRepo, routeSha1, routePath) {
            sha1(routeSha1);
            path(routePath);
        }
    };
});
