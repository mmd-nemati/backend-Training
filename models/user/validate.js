import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';
const complexityOptions = {
    min: 7,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
};

function validatePostUser(user) {
    let schema = Joi.object({
        name: Joi.string().required(),
        username: Joi.string().min(5).required(),
        age: Joi.number().integer().min(14).required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().min(11).max(11).required(),
        password: passwordComplexity(complexityOptions)
    });

    return schema.validate(user);
}

function validatePutUser(user) {
    let schema = Joi.object({
        name: Joi.string(),
        username: Joi.string().min(5),
        age: Joi.number().integer().min(14)
    });

    return schema.validate(user);
}

export { validatePostUser, validatePutUser };