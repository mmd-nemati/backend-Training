import express from 'express';
import config from 'config';
import { users } from './users/users.js';
import { posts } from './posts/posts.js';
import { likes } from './likes/likes.js';
import { auth } from './auth/auth.js';

const routes = express();
routes.use('/api/users', users);
routes.use('/api/posts', posts);
routes.use('/api/likes', likes);
routes.use('/api/auth', auth);

export { routes };