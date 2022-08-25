import express from 'express';
import lodash from 'lodash';
import { User } from '../../models/user/user.js';
import { Post } from '../../models/post/post.js';
import { Like } from '../../models/like/like.js';
import { setSortOptins, paginate } from '../helper.js';
import { authn } from '../../middlewares/authn.js'
import { likeAuthz } from '../../middlewares/likeAuthz.js';

import {
    getAllLikes, getOneLike, likePost,
    unlikePost
} from '../../services/likes/likes.js'

const likes = express();
likes.use(express.json());

likes.get('/', async (req, res) => {
    try {
        const result = await getAllLikes(req);

        res.send(result.likes);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

likes.get('/:id', async (req, res) => {
    try {
        const result = await getOneLike(req.params.id);

        res.send(result.like);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

likes.post('/', authn, async (req, res) => {
    try {
        const result = await likePost(req);

        res.status(201).send(lodash.pick(result.like, ['user.username', 'post', 'createdAt']));
    }
    catch (err) {
        if (err.message === 'Invalid token')
            return res.status(401).send(`Invalid token`);
        if (err.message === 'Post not found')
            return res.status(404).send('Post not found');
        if (err.code === 11000)
            return res.status(409).send(`Post already liked.`);

        res.status(500).send(err.message);
    }
});

// As of now, I don't see any reason for that the Like entity 
// should have a PUT route. So this is commented out until 
// I figure out what the heck to do with it.
/*
likes.put('/:id', (req, res) => {
    const like = findLikeById(req.params.id);
    if (!like) return res.status(404).send(`Like with ID ${req.params.id} not found.`);
    const { error } = validateLikeDepricated(req.body, "put");
    if (error) return res.status(400).send(error.message);

    ({ userId: like.userId = like.userId, postId: like.postId = like.postId } = req.body);
    res.send(like);
});
*/

likes.delete('/:id', [authn, likeAuthz], async (req, res) => {
    try {
        await unlikePost(req);
        
        res.status(200).send(`Post unliked successfully.`);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

export { likes };