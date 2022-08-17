import { findUserById } from '../users/users.js';
import { findPostById } from '../posts/posts.js';
import { User } from '../../models/user/user.js';
import { Post } from '../../models/post/post.js';
import { Like } from '../../models/like/like.js';
import { setSortOptins, paginate } from '../helper.js';
import express from 'express';
import Joi from 'joi';

const likes = express();
likes.use(express.json());

let likesData = [];
let likesDBid = 1;

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

likes.post('/', (req, res) => {
    const { error } = validateLike(req.body, "post");
    if (error) return res.status(400).send(error.message);
    const user = findUserById(req.body.userId);
    if (!user) return res.status(404).send(`User with ID ${req.body.userId} not found.`)
    const post = findPostById(req.body.postId);
    if (!post) return res.status(404).send(`Post with ID ${req.body.postId} not found.`);

    let newLike = req.body;
    // Check if same user has liked same post.
    // If does, don't create new like. just return the old like.
    let dupLike = findDuplicatedLike(newLike);
    if (dupLike) return res.status(200).send(dupLike);

    newLike.id = likesDBid++;
    likesData.push(newLike);

    res.status(201).send(newLike);
});

likes.put('/:id', (req, res) => {
    const like = findLikeById(req.params.id);
    if (!like) return res.status(404).send(`Like with ID ${req.params.id} not found.`);
    const { error } = validateLike(req.body, "put");
    if (error) return res.status(400).send(error.message);

    ({ userId: like.userId = like.userId, postId: like.postId = like.postId } = req.body);
    res.send(like);
});

likes.delete('/:id', (req, res) => {
    const like = findLikeById(req.params.id);
    if (!like) return res.status(404).send(`Like with id ${req.params.id} not found`);

    let index = likesData.indexOf(like);
    likesData.splice(index, 1);

    res.send(like);
});

function validateLike(like, reqType) {
    let schema;
    if (reqType === "post") {
        schema = Joi.object({
            userId: Joi.number().integer().required(),
            postId: Joi.number().integer().required()
        });
    } else if (reqType === "put") {
        schema = Joi.object({
            userId: Joi.number().integer(),
            postId: Joi.number().integer()
        });
    } else return true;

    return schema.validate(like);
}

function findLikeById(id) {
    return likesData.find(l => l.id === parseInt(id));
}

function findDuplicatedLike(like) {
    return likesData.find(l => l.postId === like.postId && l.userId === like.userId);
}

export { likes };