'use strict';
define(['knockout', 'durandal/system'], function(ko, system) {

    function Comment() {
        this.newComment = ko.observable(false);
        this.content = ko.observable();
    }

    Comment.prototype.save = function() {
        this.newComment(false);
    };

    return Comment;
});
