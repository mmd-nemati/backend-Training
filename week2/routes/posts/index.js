import { usersData } from '../users/index.js';
import express from 'express';

const posts = express();
posts.use(express.json());

let postsData = [];

posts.get('/posts', (req, res) => {
    res.send(postsData);
});

posts.get('/posts/:id', (req, res) => {
    const post = postsData.find(p => p.id === req.params.id);
    if(!post) return res.status(404).send(`Post with ID ${req.params.id} not found.`);

    res.send(post);
})

export { posts, postsData };