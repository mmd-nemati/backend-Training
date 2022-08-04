import { findUserById } from '../users/index.js';
import { findPostById } from '../posts/index.js';
import express from 'express';
import Joi from 'joi';

const likes = express();
likes.use(express.json());

let likesData = [];

likes.get('/likes', (req, res) => {
    res.send(likesData);
});

likes.get('/likes/:id', (req, res) => {
    const like = findLikeById(req.params.id);
    if(!like) return res.status(404).send(`Like with ID ${req.params.id} not found.`);

    res.send(like);
});

function findLikeById(id) {
    return likesData.find(l => l.id === parseInt(id));
}

export { likes };