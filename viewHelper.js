var jade = require('jade');

module.exports.initialize = function(app) {

    app.dynamicHelpers({
        request: function(req) {
            return req;
        },

        user: function(req) {
            return (req.context && req.context.user) ? req.context.user : null;
        },

        login: function(req) {
            return (req.context && req.context.user) ? req.context.user.login : null;
        },

        hasMessages: function(req) {
            if (!req.session) {
                return false;
            }
            return Object.keys(req.session.flash || {}).length > 0;
        },

        messages: function(req) {
            var flashes = req.flash();
            var agg = Object.keys(flashes).reduce(function(accum, type) {
                var flattened = flashes[type].map(function(item) {
                    return {
                        type: type,
                        content: item
                    };
                });
                return accum.concat(flattened);
            }, []);
            return agg;
        }
    });
};