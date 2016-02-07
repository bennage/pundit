const fs = require('fs');
const exec = require('child_process').exec;

function wrapExecCallback(callback) {
    return (error, stdout, stderr) => {
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

module.exports = function (repoUrl, localPath, callback) {

    function clone(callback) {
        const cmd = `git clone ${repoUrl} ${localPath}`;
        const child = exec(cmd, wrapExecCallback(callback));
    }

    function pull(callback) {
        const cmd = `git pull`;
        const child = exec(cmd, { 'cwd': localPath }, wrapExecCallback(callback));
    }

    function lastCommit(callback) {
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