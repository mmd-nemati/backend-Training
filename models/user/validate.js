import Joi from 'joi';

function validatePostUser(user) {
    let schema = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().min(5).required(),
        age: Joi.number().integer().min(14).required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().min(11).max(11).required(),
        password: Joi.string().required()
    });

    return schema.validate(user);
}

function validatePutUser(user) {
    let schema = Joi.object({
        name: Joi.string(),
        username: Joi.string().min(5),
        age: Joi.number().integer().min(14),
        email: Joi.string().email(),
        phoneNumber: Joi.string().min(11).max(11),
    });

    return schema.validate(user);
}

export { validatePostUser, validatePutUser };