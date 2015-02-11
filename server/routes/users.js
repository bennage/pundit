import express  from 'express';

var router = express.Router();

router.get('/', (req, res, next) => {
    if(!req.user) {
        res.status(401);
    } else {
        res.json(req.user);
    }
});

export default router;
