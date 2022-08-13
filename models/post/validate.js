import Joi from 'joi';

function validatePostPost(post) {
    const schema = Joi.object({
        title: Joi.string().min(5).required(),
        text: Joi.string().min(5).required()
    });

    return schema.validate(post);
}

function validatePutPost(post) {
    const schema = Joi.object({
        title: Joi.string().min(5),
        text: Joi.string().min(5)
    });

    return schema.validate(post);
}

export { validatePostPost, validatePutPost };