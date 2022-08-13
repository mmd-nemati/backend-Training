import mongoose from 'mongoose';
import { PostSchema } from './schema.js';

const Post = new mongoose.model('Post', PostSchema);

export { Post, PostSchema };