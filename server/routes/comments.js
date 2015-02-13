import express from 'express';
import path from 'path';

var router = express.Router();

router.post('/new', (req, res) => {
    console.log(req.body);
    res.json(req.body);

    res.status(200);
});

router.get('/:owner/:repo/:blobSha', (req, res) => {

    var makeFake = (lineNumber) => {
        return {
            author: {
                login: 'bennage',
                name: 'Christopher Bennage',
                avatar_url: 'https://avatars.githubusercontent.com/u/118161?v=3',
                email: 'christopher@bennage.com'
            },
            repo: 'mspnp/data-pipeline',
            blobSha: req.params.blobSha,
            body: 'hello world',
            lineNumber: lineNumber,
            timestamp: new Date()
        }
    }

    //TODO: query the docdb store
    var comments = [
        makeFake(1),
        makeFake(5),
        makeFake(5)
    ];

    res.json(comments);
});

export default router;
