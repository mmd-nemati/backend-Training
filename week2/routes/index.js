import express from 'express';
import {users} from './users/index.js';
//import posts from './posts/index.js';
//import likes from './likes/index.js';

const routes = express();
routes.use('/api/users', users);
// routes.use('/posts', posts);
// routes.use('/likes', likes);


export { routes };