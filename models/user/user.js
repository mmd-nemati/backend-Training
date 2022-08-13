import mongoose from 'mongoose';
import { UserSchema } from './password.js';
import { validatePostUser, validatePutUser, validateAuthUser } from './validate.js';

const User = mongoose.model('User', UserSchema);

export { User, UserSchema, validatePostUser, validatePutUser, validateAuthUser };