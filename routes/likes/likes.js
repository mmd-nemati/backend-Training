import { findUserById } from '../users/users.js';
import { findPostById } from '../posts/posts.js';
import express from 'express';
import Joi from 'joi';

const likes = express();
likes.use(express.json());

let likesData = [];
let likesDBid = 1;

likes.get('/likes', (req, res) => {
    res.send(likesData);
});

likes.get('/likes/:id', (req, res) => {
    const like = findLikeById(req.params.id);
    if (!like) return res.status(404).send(`Like with ID ${req.params.id} not found.`);

    res.send(like);
});

likes.post('/likes', (req, res) => {
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

likes.put('/likes/:id', (req, res) => {
    const like = findLikeById(req.params.id);
    if (!like) return res.status(404).send(`Like with ID ${req.params.id} not found.`);
    const { error } = validateLike(req.body, "put");
    if (error) return res.status(400).send(error.message);

    ({ userId: like.userId = like.userId, postId: like.postId = like.postId } = req.body);
    res.send(like);
});

likes.delete('/likes/:id', (req, res) => {
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