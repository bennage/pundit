'use strict';

import * as fs from 'mz/fs'; 
import * as path from 'path'; 

export function* review (identifier) {
    
    const pathToHtml = path.join(process.cwd(), 'rendered', identifier + '.html');
    
    const html = yield fs.readFile(pathToHtml, 'utf8');

    return html;
};