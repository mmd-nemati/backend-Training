import mongoose from 'mongoose';
import { postSchema } from './schema.js';

const Post = new mongoose.model('Post', postSchema);

export { Post, postSchema };