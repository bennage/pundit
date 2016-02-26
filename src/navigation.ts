'use strict';

import * as fs from 'fs';
import * as path from 'path';

const outputPath = path.join(process.cwd(), 'rendered');
const files = fs.readdirSync(outputPath);

const options = files
    .filter(x=> x.endsWith('.html'))
    .map(x=> x.substring(0, x.length - 5));

export function* navigation() {
    this.body = yield this.render('nav', { options: options });
};