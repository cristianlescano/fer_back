import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import errors from './src/errors.js';
import logger from './src/logger.js';
import rutas from './src/routers.js';
import connectDb from './src/db.js';

const app = express();

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(compression())
app.use(cors());
app.use(logger);
app.use(errors);
app.use('/images', express.static(path.join(__dirname,'uploads')));
app.use('/', rutas);


connectDb();

app.listen(3308, function () {
    console.log('listening on '+3308)
});