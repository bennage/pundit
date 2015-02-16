var path = require('path');

module.exports = {
    'stylus-source' : './stylus/styles.styl',
    'stylus-target' : './server/public/styles',
    'client-source-js' : './client/**/*.js',
    'client-source-html' : './client/**/*.html',
    'client-target' : './server/public/client',
    'client-sourceMap' : '/sourcemap'
};
