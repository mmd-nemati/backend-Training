import { findUserById } from '../users/index.js';
import { findPostById } from '../posts/index.js';
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
    if(!like) return res.status(404).send(`Like with ID ${req.params.id} not found.`);

    res.send(like);
});

likes.post('/likes', (req, res) => {
    const { error } = validateLike(req.body);
    if(error) return res.status(400).send(error.message);
    const user = findUserById(req.body.userId);
    if(!user) return res.status(404).send(`User with ID ${req.body.userId} not found.`)
    const post = findPostById(req.body.postId);
    if(!post) return res.status(404).send(`Post with ID ${req.body.postId} not found.`);

    let newLike = req.body;
    // Check if same user has liked same post.
    // If does, don't create new like. just return the old like.
    let dupLike = findDuplicatedLike(newLike);
    if(dupLike) return res.status(200).send(dupLike);

    newLike.id = likesDBid;
    likesData.push(newLike);

    res.status(201).send(newLike);
});

likes.delete('/likes/:id', (req, res) => {
    const like = findLikeById(req.params.id);
    if(!like) return res.status(404).send(`Like with id ${req.params.id} not found`);

    let index = likesData.indexOf(like);
    likesData.splice(index, 1);

    res.send(like);
});

function validateLike(like) {
    const schema = Joi.object({
        userId: Joi.number().integer().required(),
        postId: Joi.number().integer().required()
    });

    return schema.validate(like);
}

function findLikeById(id) {
    return likesData.find(l => l.id === parseInt(id));
}

function findDuplicatedLike(like) {
    return likesData.find(l => l.postId === like.postId && l.userId === like.userId);
}

export { likes };