import express from 'express';
import config from 'config';
import lodash from 'lodash';
import { authn } from '../../middlewares/authn.js';
import { userAutzh } from '../../middlewares/userAuthz.js';

import {
    getAllUsers, getOneUser, signUp,
    login, editUser, deleteUser
} from '../../services/users/users.js';

const users = express();
users.use(express.json());

users.get('/', async (req, res) => {
    /*
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint to get all users.'
        #swagger.parameters[page] = {
            $ref: "#myParameters/listQuery/page"
        }
        #swagger.parameters[limit] = {
            $ref: "#myParameters/listQuery/limit"
        }
        #swagger.responses[200] = {
            schema: { $ref: "#/definitions/User" },
            description: 'Returns a paginated list of users.'
        }
    */
    try {
        const result = await getAllUsers(req);

        res.send(result.users);
    }
    catch (err) {
        res.status(500).send(err.message)
    }
});

users.get('/:id', async (req, res) => {
    /*  
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint to get one specific user.' 
        #swagger.responses[200] = { 
            schema: { $ref: "#/definitions/User" },
            description: "Returns the requested user." 
        } 
    */
    try {
        const result = await getOneUser(req.params.id);

        res.send(result.user);
    }
    catch (err) {
        if (err.message === 'User not found') return res.status(404).send(`User with ID ${req.params.id} Not Found.`);

        res.status(500).send(err.message);
    }
});

users.post('/', async (req, res) => {
    /*  
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint to create a new user.' 
        #swagger.responses[201] = { 
            description: "Returns the created user, no updatedAt.",
            schema: { $ref: '#/definitions/User' },
            "headers": {
                "x-auth-token": {
                    "type": 'string',
                    "description": 'JWT token.'
                }
            }
        }
        #swagger.requestBody[newUser] = {
            required: true,
            schema: { $ref: '#/definitions/NewUser' }
        }
    */
    try {
        const result = await signUp(req);

        res.header(config.get('authTokenName'), result.token).status(201).send(lodash.pick(result.user, ['name', 'username', 'age', 'created_at']));
    }
    catch (err) {
        if (err.name === "ValidationError")
            return res.status(400).send(err.message);
        if (err.code === 11000 && err.keyPattern.username === 1)
            return res.status(400).send(`Username '${err.keyValue.username}' already exists.`);
        if (err.code === 11000 && err.keyPattern.email === 1)
            return res.status(400).send(`Email '${err.keyValue.email}' already signed up.`);

        res.status(500).send(err.message);
    }
});

users.post('/login', async (req, res) => {
    /*  
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint to login.' 
        #swagger.requestBody[Login] = {
            description: 'Only need one of username or email parameters.',
            required: true,
            schema: { $ref: '#/definitions/LoginUser' }
        }
        #swagger.responses[200] = {
            "description": 'Logged in successfully.',
            "headers": {
                "x-auth-token": {
                    "type": 'string',
                    "description": 'JWT token.'
                }
            }
        }
    */
    try {
        const result = await login(req);

        res.header(config.get('authTokenName'), result.token).status(200).send(`Logged in successfully.`);
    }
    catch (err) {
        if (err.message === 'Invalid credentials') return res.status(400).send(err.message);

        res.status(500).send(err.message);
    }
});

users.put('/:id', [authn, userAutzh], async (req, res) => {
    try {
    /*  
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint to edit a user.' 
        #swagger.responses[200] = { 
            description: "Returns the updated user, no createdAt.",
            schema: { $ref: '#/definitions/User' }
        }
        #swagger.parameters[jwtToken] = {
            $ref: "#myParameters/jwtToken"
        }
        #swagger.requestBody[editUser] = {
            required: true,
            description: 'Non of the parameters are required.',
            schema: { $ref: '#/definitions/EditUser' },
        }
    */
        const result = await editUser(req);

        res.status(200).send(lodash.pick(result.user, ['name', 'username', 'age', 'updatedAt']));
    }
    catch (err) {
        if (err.name === "ValidationError")
            return res.status(400).send(err.message);
        if (err.code === 11000 && err.keyPattern.username === 1)
            return res.status(400).send(`Username '${err.keyValue.username}' already exists.`);

        res.status(500).send(err.message);
    }
});

users.delete('/:id', [authn, userAutzh], async (req, res) => {
    try {
    /*  
        #swagger.tags = ['User']
        #swagger.description = 'Endpoint to delete a user.' 
        #swagger.responses[200] = { 
            description: "Returns some message."
        }
        #swagger.parameters[jwtToken] = {
            $ref: "#myParameters/jwtToken"
        }
    */
        const result = await deleteUser(req);

        res.status(200).send(`${result.user.username} was deleted successfully.`);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

export { users };