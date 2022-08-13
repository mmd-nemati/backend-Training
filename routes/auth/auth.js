import express from 'express';
import bcrypt from 'bcryptjs';
import config from 'config';
import { User, validateAuthUser } from '../../models/user/user.js';

const auth = express();
auth.use(express.json());

auth.post('/', async (req, res) => {
    try {
        const { error } = validateAuthUser(req.body);
        if (error) return res.status(400).send(error.message);
        const user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] })
            // .populate('posts');
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

export { auth };