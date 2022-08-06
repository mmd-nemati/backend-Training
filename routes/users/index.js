import express from 'express';
import Joi from 'joi';
import { indexOf } from 'underscore';
const users = express();
users.use(express.json());

let usersData = [];
let usersDBid = 1;

users.get('/users', (req, res) => {
    res.send(usersData);
});

users.get('/users/:id', (req, res) => {
    const user = findUserById(req.params.id);
    if(!user) return res.status(404).send(`User with ID ${req.params.id} Not Found.`);

    res.send(user);
});

users.post('/users', (req, res) => {
    const { error } = validateUser(req.body, "post");
    if(error) return res.status(400).send(error.message);
    if(isPostDuplicated(req.body)) return res.status(400).send(`Username ${req.body.username} already exists.`);

    let newUser = req.body;
    newUser.id = usersDBid++;
    usersData.push(newUser);

    res.status(201).send(newUser);
});

users.put('/users/:id', (req, res) => {
    const user = findUserById(req.params.id);
    if(!user) return res.status(404).send(`User with ID ${req.params.id} Not Found.`);
    const { error } = validateUser(req.body, "put");
    if(error) return res.status(400).send(error.message);

    ({ name: user.name = user.name, username: user.username = user.username,
         age: user.age = user.age } = req.body);
    res.send(user);
});

users.delete('/users/:id', (req, res) => {
    const user = findUserById(req.params.id);
    if(!user) return res.status(404).send(`User with ID ${req.params.id} Not Found.`);

    let index = usersData.indexOf(user);
    usersData.splice(index, 1);

    res.send(user);
});

function validateUser(user, reqType) {
    let schema;
    if(reqType === "post") {
        schema = Joi.object({ 
            name: Joi.string().required(),
            username: Joi.string().min(5).required(),
            age: Joi.number().integer().min(14).required()
        });
    } else if(reqType === "put") {
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
