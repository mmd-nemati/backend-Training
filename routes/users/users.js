import express from 'express';
import config from 'config';
import lodash from 'lodash';
import bcrypt from 'bcryptjs';
import { User } from '../../models/user/user.js';
import { setSortOptins, paginate } from '../helper.js';
import { authn } from '../../middlewares/authn.js';
import { userAutzh } from '../../middlewares/userAuthz.js';

const users = express();
users.use(express.json());

users.get('/', async (req, res) => {
    try {
        let sortParam = setSortOptins(req.query);
        const pageOptions = paginate(req.query);
        
        const users = await User
            .find()
            .select('name username age created_at -_id')
            .sort(sortParam)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .limit(pageOptions.limit);

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
        let user = new User(lodash.pick(req.body, ['name', 'username', 'email', 'password', 'age', 'phoneNumber']));
        user = await user.save();

        let token = user.generateAuthToken();

        res.header(config.get('authTokenName'), token).status(201).send(lodash.pick(user, ['name', 'username', 'created_at']));
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
    try {
        const user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] })
        if (!user) return res.status(400).send(`Invalid credentials.`);
        
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) return res.status(400).send(`Invalid credentials.`);

        let token = user.generateAuthToken();
        res.header(config.get('authTokenName'), token).status(200).send(`Logged in successfully.`);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

users.put('/:id', [authn, userAutzh], async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.id }, lodash.pick(req.body, ['name', 'username', 'age', '_id']),
            { new: true, runValidators: true });

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

users.delete('/:id', [authn, userAutzh], async (req, res) => {
    try {
        const user = await User.findByIdAndRemove(req.params.id, { new: true });
        if (!user) return res.status(404).send(`User with ID ${req.params.id} Not Found.`);

        res.status(200).send(`${user.username} was deleted successfully.`);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

export { users };
