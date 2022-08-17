import Joi from 'joi';

function validateLike(like) {
    postId: Joi.string().max(255).required()
}

export { validateLike };