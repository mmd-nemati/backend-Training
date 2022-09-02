import express from 'express';
import lodash from 'lodash';
import { authn } from '../../middlewares/authn.js';
import { postAuthz } from '../../middlewares/postAuthz.js';

import {
    getAllPosts, getOnePost, createPost,
    editPost, deletePost
} from '../../services/posts/posts.js';

const posts = express();
posts.use(express.json());

posts.get('/', async (req, res) => {
    /*
        #swagger.tags = ['Post']
        #swagger.description = 'Endpoint to get all posts.'
        #swagger.parameters[page] = {
            $ref: "#myParameters/listQuery/page"
        }
        #swagger.parameters[limit] = {
            $ref: "#myParameters/listQuery/limit"
        }
        #swagger.responses[200] = {
            schema: { $ref: "#/definitions/Post" },
            description: 'Returns a paginated list of posts.'
        }
    */
    try {
        const result = await getAllPosts(req);

        res.send(result.posts);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

posts.get('/:id', async (req, res) => {
    /*  
        #swagger.tags = ['Post']
        #swagger.description = 'Endpoint to get one specific post.' 
        #swagger.responses[200] = { 
            schema: { $ref: "#/definitions/Post" },
            description: "Returns the requested post." 
        } 
    */
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
    /*  
        #swagger.tags = ['Post']
        #swagger.description = 'Endpoint to create a new post.' 
        #swagger.responses[201] = { 
            description: "Returns the created post.",
            schema: { $ref: '#/definitions/Post' },
        }
        #swagger.parameters[jwtToken] = {
            $ref: "#myParameters/jwtToken"
        }
        #swagger.requestBody[newPost] = {
            required: true,
            schema: { $ref: '#/definitions/ModifyPost' }
        }
    */
    try {
        const result = await createPost(req);

        res.status(201).send(lodash.pick(result.post, ['text', 'title', 'user', 'createdAt', 'updatedAt']));
    }
    catch (err) {
        if (err.message === 'Invalid token')
            return res.status(401).send(`Invalid token.`);
        if (err.name === "ValidationError")
            return res.status(400).send(err.message);

        res.status(500).send(err.message);
    }
});

posts.put('/:id', [authn, postAuthz], async (req, res) => {
    /*  
        #swagger.tags = ['Post']
        #swagger.description = 'Endpoint to edit a post.' 
        #swagger.responses[201] = { 
            description: "Returns the edited post.",
            schema: { $ref: '#/definitions/Post' },
        }
        #swagger.parameters[jwtToken] = {
            $ref: "#myParameters/jwtToken"
        }
        #swagger.requestBody[ModifyPost] = {
            description: "Non of the parameters are required.",
            required: true,
            schema: { $ref: '#/definitions/ModifyPost' }
        }
    */
    try {
        const result = await editPost(req);

        res.send(lodash.pick(result.post, ['text', 'title', 'user', 'createdAt', 'updatedAt']));
    }
    catch (err) {
        if (err.name === "ValidationError")
            return res.status(400).send(err.message);

        res.status(500).send(err.message);
    }
});

posts.delete('/:id', [authn, postAuthz], async (req, res) => {
    /*  
        #swagger.tags = ['Post']
        #swagger.description = 'Endpoint to delete a post.' 
        #swagger.responses[200] = { 
            description: "Returns some message."
        }
        #swagger.parameters[jwtToken] = {
            $ref: "#myParameters/jwtToken"
        }
    */
    try {
        await deletePost(req);

        res.status(200).send(`Post deleted successfully.`);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

export { posts };