module.exports = function context(req, res, next) {

    var session, auth;
    var providers = ['github', 'twitter', 'facebook'];

    // if we already have the context, next
    if (req.context && req.context.user) {
        return next();
    }

    session = req.session;
    req.context = {};

    // if there's not session or auth, then set an empty context
    if (!session || !(session.auth && session.auth.loggedIn)) {
        return next();
    }

    // if (session.auth.github) {
    //     req.context.user = session.auth.github.user;
    //     req.context.accessToken = session.auth.github.accessToken;
    // }
    providers.some(function(provider) {
        var p = session.auth[provider];
        if (p) {
            req.context.user = p.user;
            return true;
        }
        return false;
    });


    next();
};
