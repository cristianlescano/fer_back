import express from 'express';
import { validateToken } from '../auth/functions.js';
import {updateUserDataPublic} from './functions.js'

const router = express();

router.put('/', validateToken, updateUserDataPublic);

export default router;