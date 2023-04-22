import express from 'express';
import { RegisterAccount, confirm, changepass, recovery, login, validateToken, emptyvalidator } from './functions.js';

const router = express();

router.post('/login', emptyvalidator,
    login
);
router.post('/recovery', validateToken, emptyvalidator,
    recovery
);
router.post('/confirm', validateToken, emptyvalidator,
    confirm
);
router.post('/register', emptyvalidator,
    RegisterAccount
);
router.post('/changepassbytoken', emptyvalidator,
    changepass
);

export default router;