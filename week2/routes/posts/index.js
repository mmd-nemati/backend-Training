import { usersData } from '../users/index.js';
import express from 'express';

const posts = express();
posts.use(express.json());

let postsData = [];

export { posts, postsData };