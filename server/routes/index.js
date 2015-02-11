var express = require('express');
var path = require('path');
var router = express.Router();

router.get('/', function(req, res, next) {
    if(!req.user) {
        res.redirect('/auth/github');
    } else {
        //TODO: how to avoid the ../ in the path?
        res.sendFile(path.join(__dirname, '../public/root.html'));
    }
});

module.exports = router;
