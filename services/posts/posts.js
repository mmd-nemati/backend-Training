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

export { getAllPosts, getOnePost };