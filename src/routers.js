import express from 'express';

const rutas = express();

// App
import app from './components/app/routers.js';
rutas.use('/app', app);

// Auth
import auth from './components/auth/routers.js';
rutas.use('/auth', auth);

// Feed
import feed from './components/feed/routers.js';
rutas.use('/feed', feed);

// Me
import me from './components/me/routers.js';
rutas.use('/me', me);

// User
import user from './components/user/routers.js';
rutas.use('/user', user);

export default rutas;