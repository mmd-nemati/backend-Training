import express from 'express';
import lodash from 'lodash';
import { authn } from '../../middlewares/authn.js'
import { likeAuthz } from '../../middlewares/likeAuthz.js';

import {
    getAllLikes, getOneLike, likePost,
    unlikePost
} from '../../services/likes/likes.js'

const likes = express();
likes.use(express.json());

likes.get('/', async (req, res) => {
    /*
        #swagger.tags = ['Like']
        #swagger.description = 'Endpoint to get all likes.'
        #swagger.parameters[page] = {
            $ref: "#myParameters/listQuery/page"
        }
        #swagger.parameters[limit] = {
            $ref: "#myParameters/listQuery/limit"
        }
        #swagger.responses[200] = {
            schema: { $ref: "#/definitions/Like" },
            description: 'Returns a paginated list of likes.'
        }
    */
    try {
        const result = await getAllLikes(req);

        res.send(result.likes);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

likes.get('/:id', async (req, res) => {
    /*  
        #swagger.tags = ['Like']
        #swagger.description = 'Endpoint to get one specific like.' 
        #swagger.responses[200] = { 
            schema: { $ref: "#/definitions/Like" },
            description: "Returns the requested like." 
        } 
    */    
    try {
        const result = await getOneLike(req.params.id);

        res.send(result.like);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

likes.post('/', authn, async (req, res) => {
    /*  
        #swagger.tags = ['Like']
        #swagger.description = 'Endpoint to create a new like. The account with given jwt token is the liker.' 
        #swagger.responses[201] = { 
            description: "Returns the created like.",
            schema: { $ref: '#/definitions/Like' },
        }
        #swagger.parameters[jwtToken] = {
            $ref: "#myParameters/jwtToken"
        }
        #swagger.requestBody[newLike] = {
            description: 'The post parameter should be ID of the post.',
            required: true,
            schema: { $ref: '#/definitions/NewLike' }
        }
    */
    try {
        const result = await likePost(req);

        res.status(201).send(lodash.pick(result.like, ['user.username', 'post', 'createdAt']));
    }
    catch (err) {
        if (err.message === 'Invalid token')
            return res.status(401).send(`Invalid token`);
        if (err.message === 'Post not found')
            return res.status(404).send('Post not found');
        if (err.code === 11000)
            return res.status(409).send(`Post already liked.`);

        res.status(500).send(err.message);
    }
});

likes.delete('/:id', [authn, likeAuthz], async (req, res) => {
    /*  
        #swagger.tags = ['Like']
        #swagger.description = 'Endpoint to delete a like. The account with given jwt token is the unliker.' 
        #swagger.responses[200] = { 
            description: "Returns some message."
        }
        #swagger.parameters[jwtToken] = {
            $ref: "#myParameters/jwtToken"
        }
    */
    try {
        await unlikePost(req);

        res.status(200).send(`Post unliked successfully.`);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

export { likes };