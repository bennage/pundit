'use strict';

import * as fs from 'mz/fs';
import * as path from 'path';
import * as marked  from 'marked';

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true
    //   breaks: false,
    //   pedantic: false,
    //   sanitize: true,
    //   smartLists: true,
    //   smartypants: false
});

const outputPath = path.join(process.cwd(), 'rendered');

export function render(inputPath) {

    return fs
        .readdir(inputPath)
        .then(files => {

            var rendering = files
                .filter(file => file.endsWith('.md'))
                .map(file => {
                    const pathToFile = path.join(inputPath, file);
                    const pathForHtml = path.join(outputPath, file.replace('.md', '.html'));

                    return fs
                        .readFile(pathToFile, 'utf8')
                        .then(raw => {
                            console.log(pathToFile);

                            const html = marked(raw);
                            return fs.writeFile(pathForHtml, html);
                        });
                });

            return Promise.all(rendering);
        });
};