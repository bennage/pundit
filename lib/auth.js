var everyauth = require('everyauth');
var config = require('./config');

module.exports.configure = function(app) {

    everyauth.debug = false;

    var github = everyauth.github.scope('repo').appId(config.github.appId).appSecret(config.github.appSecret);
    var twitter = everyauth.twitter.consumerKey(config.twitter.consumerKey).consumerSecret(config.twitter.consumerSecret);
    var facebook = everyauth.facebook.appId(config.facebook.appId).appSecret(config.facebook.appSecret);

    function findOrCreate(user, promise) {
        promise.fulfill(user);
        return promise;
    }

    github.findOrCreateUser(function(session, accessToken, extra, user) {
        user.__pundit_id__ = 'github__' + user.login;
        user.__pundit_role__ = (config.administrators.indexOf(user.__pundit_id__) > -1) ? 'admin' : 'user';
        user.__pundit_avatar_url__ = 'https://secure.gravatar.com/avatar/' + user.gravatar_id + '?s=140';
        user.username = user.login;
        console.dir(user);
        return findOrCreate(user, this.Promise());
    }).redirectPath('/');

    twitter.findOrCreateUser(function(session, accessToken, accessSecret, user) {
        user.__pundit_id__ = 'twitter__' + user.screen_name;
        user.__pundit_role__ = (config.administrators.indexOf(user.__pundit_id__) > -1) ? 'admin' : 'user';
        user.__pundit_avatar_url__ = user.profile_image_url;
        user.username = user.screen_name;
        console.dir(user);
        return findOrCreate(user, this.Promise());
    }).redirectPath('/');

    facebook.findOrCreateUser(function(session, accessToken, accessTokenExtra, user) {
        user.__pundit_id__ = 'facebook__' + user.username;
        user.__pundit_role__ = (config.administrators.indexOf(user.__pundit_id__) > -1) ? 'admin' : 'user';
        user.__pundit_avatar_url__ = 'https://graph.facebook.com/' + user.username + '/picture';
        user.username = user.username;

        console.dir(user);
        return findOrCreate(user, this.Promise());
    }).redirectPath('/');

    // mixin view helpers for everyauth
    everyauth.helpExpress(app);

    return everyauth.middleware();
};
