var convert = require('./lib/convert')(),
	config = require('./lib/config');

var imageRoot = 'https://raw.github.com/mspnp/cqrs-journey-doc/master/';

convert('./source', './markdown', imageRoot);
