import { Like } from '../models/like/like.js'

async function likeAuthz(req, res, next) {
    try {
        req.like = await Like
            .findById(req.params.id)
            .select('user post _id')
            .populate('user', 'id')
            .populate('post', 'id');

        if (!req.like)
            return res.status(404).send(`Like with ID ${req.params.id} not found.`);

        if (req.like.user.id !== req.user._id)
            return res.status(403).send('Access denied.');

        next();
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

export { likeAuthz };