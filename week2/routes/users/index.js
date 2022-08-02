import express from 'express';
import Joi from 'joi';
import { indexOf } from 'underscore';
const users = express();
users.use(express.json());

let usersData = [];

users.get('/users', (req, res) => {
    res.send(usersData);
});

users.get('/users/:id', (req, res) => {
    const user = usersData.find(u => u.id === parseInt(req.params.id));
    if(!user) return res.status(404).send(`User with ID ${req.params.id} Not Found.`);

    res.send(user);
});

users.post('/users', (req, res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.message);
    if(isDuplicate(req.body)) return res.status(400).send(`Username ${req.body.username} already exists.`);

    const newUser = {
        "name": req.body.name,
        "username": req.body.username,
        "age": req.body.age,
        "id": usersData.length + 1
    };
    usersData.push(newUser);
    res.send(newUser);

});

users.put('/users/:id', (req, res) => {
    const user = usersData.find(u => u.id === parseInt(req.params.id));
    if(!user) return res.status(404).send(`User with ID ${req.params.id} Not Found.`);
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.message);

    ({ name: user.name, username: user.username, age: user.age } = req.body);
    res.send(user);
});

function validateUser(user) {
    const schema = Joi.object({ 
        name: Joi.string().required(),
        username: Joi.string().min(5).required(),
        age: Joi.number().integer().min(14).required()
    });
    
    return schema.validate(user);
}

function isDuplicate(user) {
    return (usersData.find(u => u.username === user.username) !== undefined);
}

export { users, usersData };
