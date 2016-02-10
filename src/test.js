const co = require('co');
const fs = require('fs');
const path = require('path');
const repository = require('./repository');
const markdown = require('./markdown');

// const secrets = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'secrets.json'), 'utf8'));
// const repoUrl = `https://${secrets.username}:${secrets.password}@github.com/mspnp/azure-content-pr.git`;
const localPath = '/Users/bennage/dev/_testrepo';

// console.log(repoUrl);

// repository(repoUrl, localPath, (error, output) => {
//     console.log('DONE!');
// });

const markdownPath = path.join(localPath, 'articles/guidance');
markdown(markdownPath);