import express from 'express';
import Joi from 'joi';
import lodash from 'lodash';
import { User, validatePostUser, validatePutUser } from '../../models/user/user.js';
import { setSortOptins } from '../helper.js';

const users = express();
users.use(express.json());

let usersData = [];
let usersDBid = 1;

users.get('/', async (req, res) => {
    try {
        let sortParam = setSortOptins(req.query);
        let pageNumber = req.params.pageNumber ? parseInt(req.params.pageNumber) : 1;
        let pageSize = req.params.pageSize ? parseInt(req.params.pageSize) : 10;

        const users = await User
            .find()
            .sort(sortParam)
            .select('name username age created_at -_id')
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);

        res.send(users);
    }
    catch (err) {
        res.status(500).send(err.message)
    }
});

users.get('/:id', async (req, res) => {
    try {
        const user = await User
            .findById(req.params.id)
            .select('name username age created_at -_id');
        if (!user) return res.status(404).send(`User with ID ${req.params.id} Not Found.`);

        res.send(user);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

users.post('/', async (req, res) => {
    try {
        const { error } = validatePostUser(req.body);
        if (error) return res.status(400).send(error.message);

        let newUser = new User(lodash.pick(req.body, ['name', 'username', 'email', 'password', 'age', 'phoneNumber']));
        newUser = await newUser.save();

        res.status(201).send(lodash.pick(newUser, ['name', 'username', 'created_at']));
    }
    catch (err) {
        if (err.name === "ValidationError")
            return res.status(400).send(err.message);
        if (err.code === 11000 && err.keyPattern.username === 1)
            return res.status(400).send(`Username '${err.keyValue.username}' already exists.`);
        if (err.code === 11000 && err.keyPattern.email === 1)
            return res.status(400).send(`Email '${err.keyValue.email}' already signed up.`);

        res.status(500).send(err);
    }
});

users.put('/:id', async (req, res) => {
    try {
        const { error } = validatePutUser(req.body, "put");
        if (error) return res.status(400).send(error.message);
        const user = await User
            .findOneAndUpdate({ _id: req.params.id }, lodash.pick(req.body,['name', 'username', 'age']), 
                { new: true, runValidators: true });
        if (!user) return res.status(404).send(`User with ID ${req.params.id} Not Found.`);

        res.status(200).send(lodash.pick(user, ['name', 'username', 'age']));
    }
    catch (err) {
        if (err.name === "ValidationError")
            return res.status(400).send(err.message);
        if (err.code === 11000 && err.keyPattern.username === 1)
            return res.status(400).send(`Username '${err.keyValue.username}' already exists.`);

        res.status(500).send(err);
    }
});

users.delete('/:id', (req, res) => {
    const user = findUserById(req.params.id);
    if (!user) return res.status(404).send(`User with ID ${req.params.id} Not Found.`);

    let index = usersData.indexOf(user);
    usersData.splice(index, 1);

    res.send(user);
});

function validateUser(user, reqType) {
    let schema;
    if (reqType === "post") {
        schema = Joi.object({
            name: Joi.string().required(),
            username: Joi.string().min(5).required(),
            age: Joi.number().integer().min(14).required()
        });
    } else if (reqType === "put") {
        schema = Joi.object({
            name: Joi.string(),
            username: Joi.string().min(5),
            age: Joi.number().integer().min(14)
        });
    } else return true;

    return schema.validate(user);
}

function isPostDuplicated(user) {
    return usersData.find(u => u.username === user.username) !== undefined;
}

function findUserById(id) {
    return usersData.find(u => u.id === parseInt(id));
}

export { users, usersData, findUserById };
