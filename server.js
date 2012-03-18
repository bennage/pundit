var app = require('./lib/app');

var port = process.env.PORT || 3000;
app.listen(port);

console.log("Express server listening on port %d in %s mode", port, app.settings.env);