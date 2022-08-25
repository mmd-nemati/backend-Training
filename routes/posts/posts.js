import express from 'express';
import lodash from 'lodash';
import { User } from '../../models/user/user.js';
import { Post } from '../../models/post/post.js';
import { setSortOptins, paginate } from '../helper.js';
import { authn } from '../../middlewares/authn.js';
import { postAuthz } from '../../middlewares/postAuthz.js';

import { getAllPosts, getOnePost } from '../../services/posts/posts.js';

const posts = express();
posts.use(express.json());

posts.get('/', async (req, res) => {
    try {
        const result = await getAllPosts(req);

        res.send(result.posts);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

posts.get('/:id', async (req, res) => {
    try {
        const result = await getOnePost(req.params.id);

        res.send(result.post);
    }
    catch (err) {
        if (err.message === 'Post not found') return res.status(404).send(`Post with ID ${req.params.id} not found.`);
        
        res.status(500).send(err.message);
    }
});

posts.post('/', authn, async (req, res) => {
    try {
        let post = new Post(lodash.pick(req.body, ['title', 'text']));
        post.user = req.user._id;
        post = await post.populate('user', 'name username -_id');
        if (!post.user) return res.status(401).send(`Invalid token.`);
        post = await post.save();

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                posts: post._id
            }
        });

        res.status(201).send(lodash.pick(post, ['text', 'title', 'user', 'created_at']));
    }
    catch (err) {
        if (err.name === "ValidationError")
            return res.status(400).send(err);
        res.status(500).send(err);
    }
});

posts.put('/:id', [authn, postAuthz], async (req, res) => {
    try {
        let post = req.post;
        post = await Post
            .findOneAndUpdate({ _id: req.params.id }, lodash.pick(req.body, ['text', 'title'])
                , {
                    new: true,
                    runValidators: true
                })
            .populate('user', 'name username -_id');

        res.send(lodash.pick(post, ['text', 'title', 'user', 'updated_at']));
    }
    catch (err) {
        if (err.name === "ValidationError")
            return res.status(400).send(err.message);

        res.status(500).send(err.message);
    }
});

posts.delete('/:id', [authn, postAuthz], async (req, res) => {
    try {
        await Post.findByIdAndRemove(req.params.id);
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                posts: req.params.id
            }
        });
        res.status(200).send(`Post deleted successfully.`);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

export { posts };