import { User } from '../models/user/user.js'

async function userAutzh(req, res, next) {
    try {
        let user = await User.findById(req.params.id)
            .select('-password -created_at');
        if (!user)
            return res.status(404).send(`User with ID ${req.params.id} Not Found.`);
        if (req.user._id !== user.id)
            return res.status(403).send(`Access denied.`);
        
        next();
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

export { userAutzh };