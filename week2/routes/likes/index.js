import { findUserById } from '../users/index.js';
import { findPostById } from '../posts/index.js';
import express from 'express';
import Joi from 'joi';

const likes = express();
likes.use(express.json());

export { likes };