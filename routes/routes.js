import express from 'express';
import { users } from './users/users.js';
import { posts } from './posts/posts.js';
import { likes } from './likes/likes.js';

const routes = express();
routes.use('/api/users', users);
routes.use('/api/posts', posts);
routes.use('/api/likes', likes);

export { routes };