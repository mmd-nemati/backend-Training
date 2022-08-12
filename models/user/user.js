import { UserSchema } from './hash.js';
import { validatePostUser, validatePutUser } from './validate.js';

const User = mongoose.model('User', UserSchema);

export { User, UserSchema, validatePostUser, validatePutUser };