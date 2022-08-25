import lodash from 'lodash';
import { User } from '../../models/user/user.js';
import { Post } from '../../models/post/post.js';
import { Like } from '../../models/like/like.js';
import { setSortOptins, paginate } from '../helper.js';

async function getAllLikes(req) {
    try {
        let sortParam = setSortOptins(req.query);
        const pageOptions = paginate(req.query);

        const likes = await Like
            .find()
            .select('user post createdAt -_id')
            .populate('user', 'username  -_id')
            .populate('post', 'title _id')
            .sort(sortParam)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .limit(pageOptions.limit);

        return { 'likes': likes };
    }
    catch (err) {
        throw err;
    }
}

async function getOneLike(id) {
    try {
        const like = await Like
            .findById(id)
            .select('user post createdAt -_id')
            .populate('user', 'username  -_id')
            .populate('post', 'title _id')
        if (!like) throw new Error('Like not found');

        return { 'like': like };
    }
    catch (err) {
        throw err;
    }
}

export { getAllLikes, getOneLike }