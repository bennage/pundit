var everyauth = require('everyauth');
var config = require('./config');

module.exports.configure = function(app) {

    everyauth.debug = false;

    var github = everyauth.github.scope('repo').appId(config.github.appId).appSecret(config.github.appSecret);

    function findOrCreate(user, promise) {
        promise.fulfill(user);
        return promise;
    }

    github.findOrCreateUser(function(session, accessToken, extra, user) {
        user.__pundit_id__ = 'github::' + user.login;
        console.dir(user);
        return findOrCreate(user, this.Promise());
    }).redirectPath('/');

    // mixin view helpers for everyauth
    everyauth.helpExpress(app);

    return everyauth.middleware();
};
