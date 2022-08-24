import mongoose from 'mongoose';
import { UserSchema } from './password.js';

const User = mongoose.model('User', UserSchema);

export { User, UserSchema };