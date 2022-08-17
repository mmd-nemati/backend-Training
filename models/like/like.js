import mongoose from 'mongoose';
import { likeSchema } from './schema.js';

const Like = new mongoose.model('Like', likeSchema);

export { Like, likeSchema };