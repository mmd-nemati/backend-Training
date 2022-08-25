import express from 'express';
import lodash from 'lodash';
import { User } from '../../models/user/user.js';
import { Post } from '../../models/post/post.js';
import { Like } from '../../models/like/like.js';
import { setSortOptins, paginate } from '../helper.js';
import { authn } from '../../middlewares/authn.js'
import { likeAuthz } from '../../middlewares/likeAuthz.js';

const likes = express();
likes.use(express.json());

likes.get('/', async (req, res) => {
    try {
        let sortParam = setSortOptins(req.query);
        const pageOptions = paginate(req.query);

        const likes = await Like
            .find()
            .populate('user', 'username  -_id')
            .populate('post', 'title _id')
            .select('user post createdAt -_id')
            .sort(sortParam)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .limit(pageOptions.limit);

        res.send(likes);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

likes.get('/:id', async (req, res) => {
    try {
        const like = await Like
            .findById(req.params.id)
            .populate('user', 'username  -_id')
            .populate('post', 'title _id')
            .select('user post createdAt -_id')
        if (!like) return res.status(404).send(`Like with ID ${req.params.id} not found.`);

        res.send(like);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

likes.post('/', authn, async (req, res) => {
    try {
        let like = new Like(lodash.pick(req.body, ['post']));
        like.user = req.user._id;
        like = await like.populate('user', 'username -_id')
        like = await like.populate('post', 'title createdAt _id');

        if (!like.user) return res.status(401).send(`Invalid token.`);
        if (!like.post) return res.status(404).send(`Post with ID ${req.body.post} not found.`);

        like = await like.save();
        await Post.findByIdAndUpdate(like.post._id, {
            $push: {
                likes: like._id
            }
        });
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                likes: like._id
            }
        });
        res.status(201).send(lodash.pick(like, ['user.username', 'post', 'createdAt']));
    }
    catch (err) {
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
        await Like.findByIdAndRemove(req.params.id);
        await Post.findByIdAndUpdate(req.like.post.id, {
            $pull: {
                likes: req.params.id
            }
        });
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                likes: req.params.id
            }
        });
        res.status(200).send(`Post unliked successfully.`);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

export { likes };