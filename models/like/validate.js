import Joi from 'joi';

function validateLike(like) {
    const schema = Joi.object({
        post: Joi.string().max(255).required()
    });

    return schema.validate(like);
}

export { validateLike };