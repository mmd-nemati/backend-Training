import express from 'express';
import bcrypt from 'bcryptjs';
import { User, validateAuthUser } from '../../models/user/user.js';

const auth = express();
auth.use(express.json());

auth.post('/', async (req, res) => {
    try {
        const { error } = validateAuthUser(req.body);
        if (error) return res.status(400).send(error);
        const user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] })
            // .populate('posts');
        if (!user) return res.status(400).send(`Invalid credentials.`);

        const valid = bcrypt.compare(req.body.password, user.password);
        if (!valid) return res.status(400).send(`Invalid credentials.`);

        let token = user.generateAuthToken();
        res.header('x-auth-token', token).status(200).send(`Logged in successfully.`);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

export { auth };