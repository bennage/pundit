import logger from './logger';
import everyauth from 'everyauth';

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if(!clientId) {
    throw 'process.env.GITHUB_CLIENT_ID is not defined';
}

if(!clientSecret) {
    throw 'process.env.GITHUB_CLIENT_SECRET is not defined';
}

logger.log(`GITHUB_CLIENT_ID : ${clientId}`);
logger.log(`GITHUB_CLIENT_SECRET : ${clientSecret}`);

everyauth.everymodule
    .findUserById( (req, userId, callback) => {
        var user = req.session['user'];
        var error = null;
        callback(error, user);
    });

everyauth.github
    .appId(clientId)
    .appSecret(clientSecret)
    .findOrCreateUser( (session, accessToken, accessTokenExtra, githubUserMetadata) => {
        session['user'] = githubUserMetadata;
        return githubUserMetadata;
    })
    .redirectPath('/');

export default everyauth.middleware;
