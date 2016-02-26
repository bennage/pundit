'use strict';

import * as fs from 'fs';
import { exec } from 'child_process';

interface CollapsedCallback {
    (error: Error, result?: { stdout: Buffer, stderr: Buffer }): void;
}

function wrapExecCallback(callback: CollapsedCallback) {

    return (error: Error, stdout: Buffer, stderr: Buffer) => {

        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        if (error !== null) {
            console.log(`exec error: ${error}`);
            callback(error);
        } else {
            callback(null, {
                stdout: stdout,
                stderr: stderr
            });
        }
    };
}

export function update(repoUrl: string, localPath: string, callback) {

    function clone(callback: CollapsedCallback) {
        const cmd = `git clone ${repoUrl} ${localPath}`;
        const child = exec(cmd, wrapExecCallback(callback));
    }

    function pull(callback: CollapsedCallback) {
        const cmd = `git pull`;
        const child = exec(cmd, { 'cwd': localPath }, wrapExecCallback(callback));
    }

    function lastCommit(callback: CollapsedCallback) {
        const cmd = `git log -1`;
        const pattern = /^commit ([a-z0-9]{32})/;

        function extractCommitId(error, output) {

            if (error) return callback(error);
            
            // TODO
            // handle some errors!
            const sha = pattern.exec(output.stdout)[1];
            console.log(`sha is ${sha}`);

            callback(output);
        }

        const child = exec(cmd, { 'cwd': localPath }, wrapExecCallback(extractCommitId));
    }

    fs.exists(localPath, (exists) => {
        if (exists) {
            pull((error, output) => { lastCommit(callback); });
        } else {
            clone((error, output) => { lastCommit(callback); });
        }
    });
};