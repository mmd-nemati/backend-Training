import express from 'express';
import mongoose from 'mongoose';
import config from 'config';
import { routes } from './routes/routes.js';
const port = process.env.PORT || 5000;

if (!config.get("jwtPrivateKey")) {
    console.error("FATAL ERROR: Server is dead.");
    process.exit(1);
}

mongoose.connect(config.get('dbpath'))
    .then(() => console.log(`Connected to MongoDB...`))
    .catch(() => console.error(`Error connecting to MongoDB...`));

const app = express();
app.use('/', routes);

app.listen(port, () => console.log(`Listening on ${port}...`));