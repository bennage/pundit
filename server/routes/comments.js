import express from 'express';
import path from 'path';
import store from '../configuredStore';
import logger from 'winston';

var router = express.Router();

router.post('/new', (req, res) => {

    logger.info(req.url);

    var comment = req.body;
    comment.timestamp = new Date();

    store
        .persistComment(comment)
        .then(x => {
            logger.info(req.url, x);
            res.status(200);
        })
        .catch(logger.error);
});

router.get('/counts/:owner/:repo', (req, res) => {

    logger.info(req.url);

    var p = req.params;

    store
        .getCommentCounts(p.owner, p.repo)
        .then(comments => {
            res.json(comments);
        })
        .catch(logger.error);

});

router.get('/:owner/:repo/:blobSha', (req, res) => {

    logger.info(req.url);

    var p = req.params;

    store
        .getComments(p.owner, p.repo, p.blobSha)
        .then(comments => {
            res.json(comments);
        })
        .catch(logger.error);
});

export default router;
