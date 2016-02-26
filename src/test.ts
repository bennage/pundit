import * as fs from 'fs';
import * as path from 'path';
import { update } from './repository';
import { render } from './markdown';

var co = require('co');

// const secrets = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'secrets.json'), 'utf8'));
// const repoUrl = `https://${secrets.username}:${secrets.password}@github.com/mspnp/azure-content-pr.git`;
const localPath = '/Users/bennage/dev/_testrepo';

// console.log(repoUrl);

// repository(repoUrl, localPath, (error, output) => {
//     console.log('DONE!');
// });

const markdownPath = path.join(localPath, 'articles/guidance');
render(markdownPath, () => {
    console.log('done');
});