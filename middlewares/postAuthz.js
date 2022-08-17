import mongoose from 'mongoose';
import { Post } from '../models/post/post.js';

async function postAuthz(req, res, next) {
    try {
        req.post = await Post
            .findById(req.params.id)
            .select('title text user')
            .populate('user', 'id');

        if (!req.post)
            return res.status(404).send(`Post with ID ${req.params.id} not found.`)

        if (req.post.user.id !== req.user._id)
            return res.status(403).send('Access denied.');

        next();
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

export { postAuthz };