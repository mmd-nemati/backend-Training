import lodash from 'lodash';
import { User } from '../../models/user/user.js';
import { Post } from '../../models/post/post.js';
import { Like } from '../../models/like/like.js';
import { setSortOptins, paginate } from '../helper.js';

async function getAllLikes(req) {
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

async function getOneLike(id) {
    const like = await Like
        .findById(id)
        .select('user post createdAt -_id')
        .populate('user', 'username  -_id')
        .populate('post', 'title _id')
    if (!like) throw new Error('Like not found');

    return { 'like': like };
}

async function likePost(req) {
    let like = new Like(lodash.pick(req.body, ['post']));
    like.user = req.user._id;
    like = await like.populate('user', 'username -_id')
    like = await like.populate('post', 'title createdAt _id');

    if (!like.user) throw new Error('Invalid token');
    if (!like.post) throw new Error('Post not found');

    like = await like.save();
    await Post.findByIdAndUpdate(like.post._id, {
        $push: {
            likes: like._id
        }
    });
    await User.findByIdAndUpdate(req.user._id, {
        $push: {
            likes: like._id
        }
    });

    return { 'like': like };
}

async function unlikePost(req) {
    await Like.findByIdAndRemove(req.params.id);
    await Post.findByIdAndUpdate(req.like.post.id, {
        $pull: {
            likes: req.params.id
        }
    });
    await User.findByIdAndUpdate(req.user._id, {
        $pull: {
            likes: req.params.id
        }
    });
}

export { getAllLikes, getOneLike, likePost, unlikePost }