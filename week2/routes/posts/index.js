import { findUserById } from '../users/index.js';
import express from 'express';
import Joi from 'joi';

const posts = express();
posts.use(express.json());

let postsData = [];

posts.get('/posts', (req, res) => {
    res.send(postsData);
});

posts.get('/posts/:id', (req, res) => {
    const post = findPostById(req.params.id);
    if(!post) return res.status(404).send(`Post with ID ${req.params.id} not found.`);

    res.send(post);
});

posts.post('/posts', (req, res) => {
    const { error } = validatePost(req.body);
    if(error) return res.status(400).send(error.message);
    const user = findUserById(req.body.userId);
    if(!user) return res.status(404).send(`User with ID ${req.body.userId} Not Found.`);

    let newPost = req.body;
    newPost.id = postsData.length + 1;
    postsData.push(newPost);

   res.send(newPost); 
});

posts.put('/posts/:id', (req, res) => {
    const post = findPostById(req.params.id);
    if(!post) return res.status(404).send(`Post with ID ${req.params.id} not found.`);
    const { error } = validatePost(req.body);
    if(error) return res.status(400).send(error.message);
    const user = findUserById(req.body.userId);
    if(!user) return res.status(404).send(`User with ID ${req.body.userId} Not Found.`);
    if(post.userId !== req.body.userId) return res.status(400).send(`userId cannot be changed.`);

    ({title: post.title, text: post.text} = req.body);
    res.send(post);
});

posts.delete('/posts/:id', (req, res) => {
    const post = findPostById(req.params.id);
    if(!post) return res.status(404).send(`Post with ID ${req.params.id} not found.`);

    let index = postsData.indexOf(post);
    postsData.splice(index, 1);

    res.send(post);
});

function validatePost(post) {
    const schema = Joi.object({
        title: Joi.string().min(5).required(),
        text: Joi.string().min(5).required(),
        userId: Joi.number().integer().required()
    });

    return schema.validate(post);
}

function findPostById(id) {
    return postsData.find(p => p.id === parseInt(id));
}

export { posts, postsData, findPostById };