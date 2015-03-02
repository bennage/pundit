require('6to5-core/register');

var store = require('../server/configuredStore');
store.initialize('pundit');
