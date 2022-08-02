import express from 'express';
import Joi from 'joi';
const users = express();

let usersData = [{
"name": "John",
"id": 1
}];

users.get('/', (req, res) => {
    res.send(usersData);
});

users.get('/:id', (req, res) => {
    const user = usersData.find(u => u.id === parseInt(req.params.id));
    if(!user) return res.status(404).send(`User with ${req.params.id} ID Not Found.`);

    res.send(user);
});

export { users };
