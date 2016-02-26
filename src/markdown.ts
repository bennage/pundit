'use strict';

import * as fs from 'fs';
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

export function render(inputPath, callback) {

    fs.readdir(inputPath, (err, files) => {
        if (err) callback(err);

        files.forEach((file: String) => {
            if (!file.endsWith('.md')) return;

            const pathToFile = path.join(inputPath, file);
            const pathForHtml = path.join(outputPath, file.replace('.md', '.html'));
            fs.readFile(pathToFile, 'utf8', (err, raw) => {
                if (err) throw err;
                console.log(pathToFile);

                const html = marked(raw);
                fs.writeFile(pathForHtml, html, (err) => {

                });
            });
        });
    });

};