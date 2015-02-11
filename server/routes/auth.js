var express = require('express');
var router = express.Router();

var passport = require('passport');
var GitHubStrategy = require('passport-github2');

var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// TODO throw an error if either of these are not present
console.log('GITHUB_CLIENT_ID ' + GITHUB_CLIENT_ID);
console.log('GITHUB_CLIENT_SECRET ' + GITHUB_CLIENT_SECRET);

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, done) {
      console.log('auth!!');
      console.dir(accessToken);
      console.dir(refreshToken);
      console.dir(profile);

      return done(profile);
  }
));

router.get(
    '/github',
    passport.authenticate('github'));

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

module.exports = router;
