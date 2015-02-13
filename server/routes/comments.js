import express from 'express';
import path from 'path';
import store from '../configuredStore';
import logger from 'winston';

var router = express.Router();

router.post('/new', (req, res) => {

    logger.info(req.url, req.body);

    store
        .persistComment(req.body)
        .then(x => {
            logger.info(req.url, x);
            res.status(200);
        })
        .catch(logger.error);
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
