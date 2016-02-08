const fs = require('mz/fs');
const path = require('path');

module.exports = function* (identifier) {
    
    const pathToHtml = path.join(process.cwd(), 'rendered', identifier + '.html');
    
    const html = yield fs.readFile(pathToHtml, 'utf8');

    return html;
};