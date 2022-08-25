import lodash from 'lodash';
import { User } from '../../models/user/user.js';
import { Post } from '../../models/post/post.js';
import { setSortOptins, paginate } from '../helper.js';

async function getAllPosts(req) {
    try {
        const sortOptions = setSortOptins(req.query);
        const pageOptions = paginate(req.query);

        const posts = await Post
            .find()
            .select('title text user likes created_at -_id')
            .populate('user', 'name username  -_id')
            .sort(sortOptions)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .limit(pageOptions.limit);

        return { 'posts': posts };
    }
    catch (err) {
        throw err;
    }
}

async function getOnePost(id) {
    try {
        const post = await Post
            .findById(id)
            .select('title text user likes created_at -_id')
            .populate('user', 'name username  -_id')
        if (!post) throw new Error('Post not found');

        return { 'post': post };
    }
    catch (err) {
        throw err;
    }
}

async function createPost(req) {
    try {
        let post = new Post(lodash.pick(req.body, ['title', 'text']));
        post.user = req.user._id;
        post = await post.populate('user', 'name username -_id');
        if (!post.user) throw new Error('Invalid token');
        post = await post.save();

        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                posts: post._id
            }
        });

        return { 'post': post };
    }
    catch (err) {
        throw err;
    }
}

export { getAllPosts, getOnePost, createPost };