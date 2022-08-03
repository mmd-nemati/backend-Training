import express from 'express';
import { users } from './users/index.js';
import { posts } from './posts/index.js';
//import likes from './likes/index.js';

const routes = express();
routes.use('/api', users);
routes.use('/api', posts);
// routes.use('/likes', likes);


export { routes };