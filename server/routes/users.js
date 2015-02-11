var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.dir(req.user);
    res.json(req.user);
});

router.get('/:id', function(req, res, next) {
    res.send('child ' + req.params.id);
});

module.exports = router;
