import lodash from 'lodash';
import bcrypt from 'bcryptjs';
import { User } from '../../models/user/user.js';
import { setSortOptins, paginate } from '../helper.js';
async function getAllUsers(req) {
    try {
        const sortOptions = setSortOptins(req.query);
        const pageOptions = paginate(req.query);

        const users = await User
            .find()
            .select('name username age created_at -_id')
            .sort(sortOptions)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .limit(pageOptions.limit);

        return { 'users': users };
    }
    catch (err) {
        throw err;
    }
}

async function getOneUser(id) {
    try {
        const user = await User
            .findById(id)
            .select('name username age created_at -_id');
        if (!user) throw { 'message': 'User not found' };

        return { 'user': user };
    }
    catch (err) {
        throw err;
    };
}

async function signUp(req) {
    try {
        let user = new User(lodash.pick(req.body, ['name', 'username', 'email', 'password', 'age', 'phoneNumber']));
        user = await user.save();

        const token = user.generateAuthToken();

        return { 'token': token, 'user': user };
    }
    catch (err) {
        throw err;
    }
}

async function login(req) {
    try {
        const user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
        if (!user) throw { 'message': 'Invalid credentials.' };

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) throw { 'message': 'Invalid credentials.' };

        const token = user.generateAuthToken();

        return { 'token': token };
    }
    catch (err) {
        throw err;
    }
}

async function editUser(req) {
    try { 
        const user = await User.findOneAndUpdate({ _id: req.params.id }, lodash.pick(req.body, ['name', 'username', 'age', '_id']),
        { new: true, runValidators: true });

        return { 'user': user };
    }
    catch (err) {
        throw err;
    }
}

async function deleteUser(req) {
    try {
        const user = await User.findByIdAndRemove(req.params.id, { new: true });

        return { 'user': user };

    } 
    catch (err) {
        throw err;
    }
}

export { getAllUsers, getOneUser, signUp, login, editUser, deleteUser };