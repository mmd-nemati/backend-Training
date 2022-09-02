import express from 'express';
import mongoose from 'mongoose';
import config from 'config';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from "fs";
const swaggerFile = JSON.parse(readFileSync("./swagger_output.json"));
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
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile,  {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  }));

app.listen(port, () => console.log(`Listening on ${port}...`));