import express from 'express';
import Joi from 'joi';
import { Post } from '../../models/post/post.js';
import { findUserById } from '../users/users.js';
import { setSortOptins } from '../helper.js';

const posts = express();
posts.use(express.json());

let postsData = [];
let postsDBid = 1;

posts.get('/', async (req, res) => {
    try {
        let sortParam = setSortOptins(req.query);
        let pageNumber = req.params.pageNumber ? parseInt(req.params.pageNumber) : 1;
        let pageSize = req.params.pageSize ? parseInt(req.params.pageSize) : 10;

        const posts = await Post
            .find()
            .populate('user', 'name username  -_id')
            // .populate('likes', '')
            .select('title text user likes created_at -_id')
            .sort(sortParam)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        res.send(posts);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

posts.get('/:id', async (req, res) => {
    try {
        const post = await Post
            .findById(req.params.id)
            .populate('user', 'name username  -_id')
            // .populate('likes', '')
            .select('title text user likes created_at -_id')
        if (!post) return res.status(404).send(`Post with ID ${req.params.id} not found.`);

        res.send(post);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

posts.post('/', (req, res) => {
    const { error } = validatePost(req.body, "post");
    if (error) return res.status(400).send(error.message);
    const user = findUserById(req.body.userId);
    if (!user) return res.status(404).send(`User with ID ${req.body.userId} Not Found.`);

    let newPost = req.body;
    newPost.id = postsDBid++;
    postsData.push(newPost);

    res.status(201).send(newPost);
});

posts.put('/:id', (req, res) => {
    const post = findPostById(req.params.id);
    if (!post) return res.status(404).send(`Post with ID ${req.params.id} not found.`);
    const { error } = validatePost(req.body, "put");
    if (error) return res.status(400).send(error.message);
    const user = findUserById(req.body.userId || post.userId);
    if (!user) return res.status(404).send(`User with ID ${req.body.userId} Not Found.`);
    if (req.body.userId && post.userId !== parseInt(req.body.userId)) return res.status(400).send(`userId cannot be changed.`);

    ({ title: post.title = post.title, text: post.text = post.text } = req.body);
    res.send(post);
});

posts.delete('/:id', (req, res) => {
    const post = findPostById(req.params.id);
    if (!post) return res.status(404).send(`Post with ID ${req.params.id} not found.`);

    let index = postsData.indexOf(post);
    postsData.splice(index, 1);

    res.send(post);
});

function validatePost(post, reqType) {
    let schema;
    if (reqType === "post") {
        schema = Joi.object({
            title: Joi.string().min(5).required(),
            text: Joi.string().min(5).required(),
            userId: Joi.number().integer().required()
        });
    } else if (reqType === "put") {
        schema = Joi.object({
            title: Joi.string().min(5),
            text: Joi.string().min(5),
            userId: Joi.number().integer()
        });
    } else return true;

    return schema.validate(post);
}

function findPostById(id) {
    return postsData.find(p => p.id === parseInt(id));
}

export { posts, postsData, findPostById };